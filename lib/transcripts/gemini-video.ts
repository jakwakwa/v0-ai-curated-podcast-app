import { GoogleGenerativeAI } from "@google/generative-ai"
import { GoogleAIFileManager } from "@google/generative-ai/server"
import { tmpdir } from "node:os"
import { mkdtempSync, writeFileSync, rmSync } from "node:fs"
import path from "node:path"

export async function transcribeWithGeminiFromUrl(audioUrl: string): Promise<string | null> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY
  if (!apiKey) return null
  const client = new GoogleGenerativeAI(apiKey)
  const fileManager = new GoogleAIFileManager(apiKey)

  let tempDir: string | null = null
  try {
    // Stream fetch the audio and upload using Files API
    const res = await fetch(audioUrl, { headers: { "User-Agent": "Mozilla/5.0" } })
    if (!res.ok) {
      console.error(`Failed to download audio from URL. Status: ${res.status}`)
      return null
    }
    const contentType = res.headers.get("content-type") || "audio/mpeg"
    const arrayBuffer = await res.arrayBuffer()

    // Write to a temp file to satisfy FileManager upload API
    tempDir = mkdtempSync(path.join(tmpdir(), "gemini-"))
    const ext = contentType.includes("wav") ? ".wav" : contentType.includes("m4a") ? ".m4a" : contentType.includes("aac") ? ".aac" : contentType.includes("flac") ? ".flac" : ".mp3"
    const filePath = path.join(tempDir, `audio${ext}`)
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
  } catch (error) {
    console.error("Gemini transcription failed:", error)
    return null
  } finally {
    // Best-effort cleanup of temporary directory
    if (tempDir) {
      try {
        rmSync(tempDir, { recursive: true, force: true })
      } catch (cleanupError) {
        console.warn("Failed to cleanup temporary directory:", cleanupError)
      }
    }
  }
}

