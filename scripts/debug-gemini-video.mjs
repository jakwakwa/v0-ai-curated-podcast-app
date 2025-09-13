// scripts/debug-gemini-video.mjs
import { config } from "dotenv"
import { transcribeWithGeminiFromUrl } from "../lib/transcripts/gemini-video.ts"

config()

async function debugGeminiTranscription() {
  console.log("🔍 Debugging Gemini Video Transcription")
  console.log("=".repeat(50))

  const testUrl = "https://www.w3schools.com/html/horse.mp3" // Simple test file that's publicly accessible

  try {
    console.log("🔗 Testing URL:", testUrl)
    console.log("🔐 API Key present:", !!process.env.GOOGLE_GENERATIVE_AI_API_KEY)
    console.log("🔑 API Key (first 10 chars):", process.env.GOOGLE_GENERATIVE_AI_API_KEY?.substring(0, 10))

    // Test the URL accessibility first
    console.log("\n📡 Testing URL accessibility...")
    const response = await fetch(testUrl)
    console.log("🌐 Response status:", response.status)
    console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()))

    if (response.ok) {
      const buffer = await response.arrayBuffer()
      console.log("📡 Audio buffer size:", buffer.byteLength, "bytes")
      console.log("📡 Content type:", response.headers.get("content-type"))
    } else {
      console.log("❌ URL not accessible:", response.statusText)
      return
    }

    console.log("\n🎯 Running Gemini transcription...")
    const transcript = await transcribeWithGeminiFromUrl(testUrl)

    if (transcript) {
      console.log("✅ Success! Transcript length:", transcript.length)
      console.log("📝 Transcript preview:", transcript.substring(0, 500))
    } else {
      console.log("❌ Empty transcript returned")
    }

  } catch (error) {
    console.error("💥 Error:", error.message)
    console.error("Stack:", error.stack)
  }
}

debugGeminiTranscription()
