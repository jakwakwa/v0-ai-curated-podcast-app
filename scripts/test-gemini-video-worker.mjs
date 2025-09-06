// scripts/test-gemini-video-worker.mjs
import { config } from "dotenv"
import { transcribeWithGeminiFromUrl } from "../lib/transcripts/gemini-video.ts"

// Load environment variables
config()

// Test URLs - you can replace these with your own test URLs
const TEST_URLS = [
  // Short public audio test (should process in one chunk)
  "https://www.w3schools.com/html/horse.mp3",

  // Longer public audio sample (Alice in Wonderland chapter)
  "https://ia800604.us.archive.org/15/items/alice_in_wonderland_librivox/aliceinwonderland_01_carroll_64kb.mp3",

  // YouTube URL test (will be downloaded and processed)
  "https://www.youtube.com/watch?v=rrADZCpyVV0",

  // Add more test URLs as needed
]

async function testGeminiTranscription() {
  console.log("🧪 Testing Gemini Video Transcription Worker")
  console.log("=".repeat(50))

  // Check environment variables
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is not set in environment variables")
    process.exit(1)
  }
  console.log("✅ GEMINI_API_KEY found")

  // Test each URL
  for (let i = 0; i < TEST_URLS.length; i++) {
    const url = TEST_URLS[i]
    console.log(`\n📝 Test ${i + 1}/${TEST_URLS.length}: ${url}`)
    console.log("-".repeat(50))

    try {
      const startTime = Date.now()
      console.log("⏳ Starting transcription...")

      const transcript = await transcribeWithGeminiFromUrl(url)

      const endTime = Date.now()
      const duration = endTime - startTime

      if (transcript) {
        console.log("✅ Transcription successful!")
        console.log(`⏱️  Duration: ${duration}ms`)
        console.log(`📊 Transcript length: ${transcript.length} characters`)
        console.log(`📄 First 200 characters: ${transcript.substring(0, 200)}...`)

        // Save transcript to file for inspection
        const fs = await import("fs/promises")
        const filename = `test-transcript-${i + 1}-${Date.now()}.txt`
        await fs.writeFile(filename, transcript)
        console.log(`💾 Transcript saved to: ${filename}`)
      } else {
        console.log("❌ Transcription failed - empty result")
      }

    } catch (error) {
      console.error("❌ Transcription failed with error:")
      console.error("Error type:", error.constructor.name)
      console.error("Error message:", error.message)
      console.error("Stack trace:", error.stack)
    }
  }

  console.log("\n🏁 Testing completed!")
}

// Run the test
testGeminiTranscription()
  .catch(error => {
    console.error("⚠️ Test script failed:", error)
    process.exit(1)
  })
