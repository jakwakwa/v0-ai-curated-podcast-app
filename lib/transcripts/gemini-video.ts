import { GoogleGenerativeAI, type Part } from "@google/generative-ai"
import { promises as fs } from "node:fs"
import path from "node:path"
import os from "node:os"
import ffmpeg from "fluent-ffmpeg"
import ffmpegStatic from "ffmpeg-static"
import { aiConfig } from "@/config/ai"
import { extractYouTubeAudioUrl } from "@/lib/transcripts/utils/youtube-audio"

const PROMPT = "Please transcribe the following audio segment accurately. Provide only the transcribed text. Do not include any additional commentary." as const

function bufferToGenerativePart(buffer: Buffer, mimeType: string): Part {
  return { inlineData: { data: buffer.toString("base64"), mimeType } }
}

function getAudioDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(new Error(`ffprobe failed: ${err.message}`))
      resolve(metadata.format.duration || 0)
    })
  })
}

function createAudioChunk(inputPath: string, outputPath: string, startTime: number, duration: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(startTime)
      .setDuration(duration)
      .toFormat("mp3")
      .on("error", err => reject(new Error(`ffmpeg processing failed: ${err.message}`)))
      .on("end", async () => {
        try {
          const data = await fs.readFile(outputPath)
          resolve(data)
        } catch (e) {
          reject(e)
        }
      })
      .save(outputPath)
  })
}

export async function transcribeWithGeminiFromUrl(url: string): Promise<string | null> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY
  if (!apiKey) return null
  if (ffmpegStatic) {
    try { ffmpeg.setFfmpegPath(String(ffmpegStatic)) } catch {}
  }

  const client = new GoogleGenerativeAI(apiKey)
  const modelName = aiConfig.geminiModel || "gemini-1.5-pro"
  const model = client.getGenerativeModel({ model: modelName })

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "gemini-audio-"))
  const originalFilePath = path.join(tempDir, "original")
  const transcripts: string[] = []

  try {
    let fetchUrl = url
    if (/youtu(be\.be|be\.com)/i.test(fetchUrl)) {
      try {
        const info = await extractYouTubeAudioUrl(fetchUrl)
        fetchUrl = info.audioUrl
      } catch (e) {
        console.error("[GEMINI][youtube-extract]", e)
        return null
      }
    }

    const response = await fetch(fetchUrl, { headers: { "User-Agent": "Mozilla/5.0" } })
    if (!response.ok) {
      let bodySnippet = ""
      try { bodySnippet = (await response.text()).slice(0, 500) } catch {}
      console.error(`[GEMINI][download] status=${response.status} body=${bodySnippet}`)
      return null
    }

    const mimeType = (response.headers.get("content-type") || "audio/mpeg").split(";")[0]
    const audioBuffer = Buffer.from(await response.arrayBuffer())
    await fs.writeFile(originalFilePath, audioBuffer)

    const totalDuration = await getAudioDuration(originalFilePath)
    const CHUNK_DURATION_SECONDS = 10 * 60

    if (!totalDuration || totalDuration <= CHUNK_DURATION_SECONDS) {
      const singlePart = bufferToGenerativePart(audioBuffer, mimeType)
      const result = await model.generateContent([PROMPT, singlePart])
      return result.response.text()
    }

    const numChunks = Math.ceil(totalDuration / CHUNK_DURATION_SECONDS)
    for (let i = 0; i < numChunks; i++) {
      const startTime = i * CHUNK_DURATION_SECONDS
      const outPath = path.join(tempDir, `chunk-${i}.mp3`)
      const chunkBuffer = await createAudioChunk(originalFilePath, outPath, startTime, CHUNK_DURATION_SECONDS)
      const chunkPart = bufferToGenerativePart(chunkBuffer, "audio/mp3")
      if (i > 0) await new Promise(res => setTimeout(res, 500))
      const result = await model.generateContent([PROMPT, chunkPart])
      transcripts.push(result.response.text())
    }

    return transcripts.join(" ")
  } catch (err) {
    console.error("[GEMINI][chunked-transcription]", err)
    return null
  } finally {
    try { await fs.rm(tempDir, { recursive: true, force: true }) } catch {}
  }
}

