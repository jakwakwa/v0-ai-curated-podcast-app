import { GoogleGenerativeAI } from "@google/generative-ai"
import { GoogleAIFileManager } from "@google/generative-ai/server"
import { tmpdir } from "node:os"
import { mkdtempSync, writeFileSync, rmSync } from "node:fs"
import path from "node:path"
import { aiConfig } from "@/config/ai"

export async function transcribeWithGeminiFromUrl(srcUrl: string): Promise<string | null> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY
  if (!apiKey) return null
  const client = new GoogleGenerativeAI(apiKey)
  const fileManager = new GoogleAIFileManager(apiKey)

  const modelName = aiConfig?.geminiModel || "gemini-2.5-flash"
  const model = client.getGenerativeModel({ model: modelName })
  const prompt = "Transcribe this media into plain text. Return only the transcript, no timestamps or speakers."

  // If it's a YouTube URL, pass it directly to the model per Gemini video understanding docs
  const isYouTube = /(?:youtu\.be\/|youtube\.com\/)/i.test(srcUrl)
  if (isYouTube) {
    try {
      const result = await model.generateContent([
        { text: srcUrl },
        { text: prompt },
      ])
      const text = result.response.text()
      return text && text.trim().length > 0 ? text : null
    } catch {
      return null
    }
  }

  // Otherwise, treat as a direct media URL; upload via Files API then call the model
  let tempDir: string | null = null
  try {
    const res = await fetch(srcUrl)
    if (!res.ok) return null
    const contentType = res.headers.get("content-type") || "application/octet-stream"

    // Avoid mistakenly uploading HTML (e.g., a watch page) as audio
    if (contentType.includes("text/html")) {
      return null
    }

    const arrayBuffer = await res.arrayBuffer()
    tempDir = mkdtempSync(path.join(tmpdir(), "gemini-"))

    // Infer extension from content-type
    const ext = contentType.includes("wav")
      ? ".wav"
      : contentType.includes("m4a")
      ? ".m4a"
      : contentType.includes("aac")
      ? ".aac"
      : contentType.includes("flac")
      ? ".flac"
      : contentType.includes("mp4")
      ? ".mp4"
      : contentType.includes("webm")
      ? ".webm"
      : contentType.includes("mpeg") || contentType.includes("mp3")
      ? ".mp3"
      : ""

    const filePath = path.join(tempDir, `media${ext}`)
    writeFileSync(filePath, Buffer.from(new Uint8Array(arrayBuffer)))
    const uploaded = await fileManager.uploadFile(filePath, { mimeType: contentType, displayName: "episode-media" })

    const result = await model.generateContent([
      { fileData: { fileUri: uploaded.file.uri, mimeType: contentType } },
      { text: prompt },
    ])

    const text = result.response.text()
    return text && text.trim().length > 0 ? text : null
  } catch {
    return null
  } finally {
    try {
      if (tempDir) rmSync(tempDir, { recursive: true, force: true })
    } catch {}
  }
}

