import { GoogleGenerativeAI } from "@google/generative-ai"
import { GoogleAIFileManager } from "@google/generative-ai/server"
import { tmpdir } from "node:os"
import { mkdtempSync, writeFileSync, } from "node:fs"
import path from "node:path"

export async function transcribeWithGeminiFromUrl(audioUrl: string): Promise<string | null> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY
  if (!apiKey) return null
  const client = new GoogleGenerativeAI(apiKey)
  const fileManager = new GoogleAIFileManager(apiKey)

  try {
    // Stream fetch the audio and upload using Files API
    const res = await fetch(audioUrl)
    if (!res.ok) return null
    const contentType = res.headers.get("content-type") || "audio/mpeg"
    const arrayBuffer = await res.arrayBuffer()

    // Write to a temp file to satisfy FileManager upload API
    const dir = mkdtempSync(path.join(tmpdir(), "gemini-"))
    const ext = contentType.includes("wav") ? ".wav" : contentType.includes("m4a") ? ".m4a" : contentType.includes("aac") ? ".aac" : contentType.includes("flac") ? ".flac" : ".mp3"
    const filePath = path.join(dir, `audio${ext}`)
    writeFileSync(filePath, Buffer.from(new Uint8Array(arrayBuffer)))
    const uploaded = await fileManager.uploadFile(filePath, { mimeType: contentType, displayName: "episode-audio" })

    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" })
    const prompt = "Transcribe this audio into plain text. Return only the transcript, no timestamps or speakers."

    const result = await model.generateContent([
      { fileData: { fileUri: uploaded.file.uri, mimeType: contentType } },
      { text: prompt },
    ])

    const text = result.response.text()
    return text && text.trim().length > 0 ? text : null
  } catch {
    return null
  } finally {
    // Best-effort cleanup
    try {
      const _base = path.dirname(path.dirname((await import("node:url")).fileURLToPath(import.meta.url))) // noop to avoid TS unused
    } catch {}
  }
}

