import { GoogleGenerativeAI } from "@google/generative-ai"
import { GoogleAIFileManager } from "@google/generative-ai/server"
import { tmpdir } from "node:os"
import { mkdtempSync, writeFileSync, rmSync } from "node:fs"
import path from "node:path"
import { aiConfig } from "@/config/ai"

export async function transcribeWithGeminiFromUrl(audioUrl: string): Promise<string | null> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY
  if (!apiKey) return null
  const client = new GoogleGenerativeAI(apiKey)
  const fileManager = new GoogleAIFileManager(apiKey)
  const modelName = aiConfig.geminiModel || "gemini-1.5-pro"
  const model = client.getGenerativeModel({ model: modelName })

  // Helper: quick YouTube detector
  const isYouTubeUrl = (url: string): boolean => /youtu(be\.be|be\.com)/i.test(url)

  // Helper: try to resolve direct audio stream from a YouTube watch URL
  async function resolveYouTubeDirectAudio(url: string): Promise<{ url: string; mimeType?: string } | null> {
    const videoId = (url.match(/(?:v=|\/)([\w-]{11})/) || [])[1]
    if (!videoId) return null

    const ytKey = process.env.YOUTUBE_API_KEY
    if (ytKey) {
      try {
        const resp = await fetch(`https://www.youtube.com/youtubei/v1/player?key=${ytKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0",
            Referer: "https://www.youtube.com/",
          },
          body: JSON.stringify({ context: { client: { clientName: "WEB", clientVersion: process.env.YOUTUBE_CLIENT_VERSION || "2.20240101.00.00" } }, videoId }),
        })
        if (resp.ok) {
          const data = await resp.json()
          const formats = data?.streamingData?.adaptiveFormats || []
          const audioFormats = formats.filter((f: { mimeType?: string; url?: string }) => f?.mimeType?.includes("audio") && f?.url)
          if (audioFormats.length > 0) {
            const preferred = audioFormats.find((f: { mimeType?: string }) => f?.mimeType?.includes("audio/webm") || f?.mimeType?.includes("audio/mp4")) || audioFormats[0]
            return { url: preferred.url as string, mimeType: (preferred as { mimeType?: string }).mimeType }
          }
        }
      } catch {}
    }

    const rapidKey = process.env.RAPIDAPI_KEY
    if (rapidKey) {
      try {
        const resp = await fetch(`https://youtube-video-info1.p.rapidapi.com/youtube_video_info?url=${encodeURIComponent(url)}`, {
          headers: { "X-RapidAPI-Key": rapidKey, "X-RapidAPI-Host": "youtube-video-info1.p.rapidapi.com" },
        })
        if (resp.ok) {
          const data = await resp.json()
          if (data?.audio_url) return { url: data.audio_url as string, mimeType: data?.audio_mime || undefined }
        }
      } catch {}
    }

    return null
  }

  // Helper: decide a reasonable file extension for the provided content type
  const extForMime = (ct: string): string => {
    const lower = ct.toLowerCase()
    if (lower.includes("audio/wav") || lower.includes("audio/x-wav")) return ".wav"
    if (lower.includes("audio/m4a") || lower.includes("audio/mp4")) return ".m4a"
    if (lower.includes("audio/aac")) return ".aac"
    if (lower.includes("audio/flac")) return ".flac"
    if (lower.includes("audio/webm")) return ".webm"
    if (lower.includes("video/mp4")) return ".mp4"
    if (lower.includes("video/webm")) return ".webm"
    if (lower.includes("audio/mpeg") || lower.includes("audio/mp3")) return ".mp3"
    return ".mp3"
  }

  let tempDir: string | null = null
  try {
    let fetchUrl = audioUrl
    let hintedMimeType: string | undefined

    // If a YouTube URL was provided, resolve to a direct audio stream first
    if (isYouTubeUrl(fetchUrl)) {
      // First attempt: use YouTube URL directly as a fileData part (preview feature)
      try {
        const prompt = "Transcribe this video into plain text. Return only the transcript, no timestamps or speakers."
        const ytResult = await model.generateContent([
          { fileData: { fileUri: fetchUrl, mimeType: "video/mp4" } },
          { text: prompt },
        ])
        const ytText = ytResult.response.text()?.trim() || ""
        if (ytText.length > 0) {
          const lower = ytText.toLowerCase()
          const badPhrases = [
            "i cannot transcribe",
            "i am a large language model",
            "i can't transcribe",
            "cannot access or process the data",
            "i am unable to process audio",
            "as an ai",
            "i cannot access",
          ]
          if (!badPhrases.some(p => lower.includes(p))) {
            return ytText
          }
        }
      } catch {
        // Ignore and fall back to audio extraction
      }

      const resolved = await resolveYouTubeDirectAudio(fetchUrl)
      if (!resolved) return null
      fetchUrl = resolved.url
      hintedMimeType = resolved.mimeType
    }

    const res = await fetch(fetchUrl, { headers: { "User-Agent": "Mozilla/5.0" } })
    if (!res.ok) return null
    const contentTypeRaw = res.headers.get("content-type") || hintedMimeType || "audio/mpeg"
    const contentType = contentTypeRaw.split(";")[0].trim()

    // Guard against HTML/text pages which Gemini cannot transcribe as audio
    if (!(contentType.startsWith("audio/") || contentType.startsWith("video/"))) {
      // As a last-ditch fallback: if original was YouTube, we already tried; otherwise bail
      return null
    }

    const arrayBuffer = await res.arrayBuffer()

    // Write to a temp file to satisfy FileManager upload API
    tempDir = mkdtempSync(path.join(tmpdir(), "gemini-"))
    const filePath = path.join(tempDir, `media${extForMime(contentType)}`)
    writeFileSync(filePath, Buffer.from(new Uint8Array(arrayBuffer)))
    const uploaded = await fileManager.uploadFile(filePath, { mimeType: contentType, displayName: "episode-media" })
    const prompt = "Transcribe this audio/video into plain text. Return only the transcript, no timestamps or speakers."

    const result = await model.generateContent([
      { fileData: { fileUri: uploaded.file.uri, mimeType: contentType } },
      { text: prompt },
    ])

    const text = result.response.text()
    const cleaned = text?.trim() || ""
    if (cleaned.length === 0) return null
    const lower = cleaned.toLowerCase()
    // Guard against LLM explanation instead of transcript
    const badPhrases = [
      "i cannot transcribe",
      "i am a large language model",
      "i can't transcribe",
      "cannot access or process the data",
      "i am unable to process audio",
      "as an ai",
      "i cannot access",
    ]
    if (badPhrases.some(p => lower.includes(p))) return null
    return cleaned
  } catch {
    return null
  } finally {
    if (tempDir) {
      try {
        rmSync(tempDir, { recursive: true, force: true })
      } catch {}
    }
  }
}

