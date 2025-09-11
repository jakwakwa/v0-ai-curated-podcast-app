// scripts/minimal-gemini-test.mjs
import { config } from "dotenv"
import { GoogleGenerativeAI } from "@google/generative-ai"

config()

const PROMPT = `Please transcribe the following audio segment accurately. Provide only the transcribed text. Do not include any additional commentary, introductory phrases like "Here is the transcription:", or summaries. The audio is a segment of a larger file, so do not add a beginning or an end.`

async function minimalTest() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY)

  // Test with a simple text prompt first using flash model
  try {
    const flashModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    const result = await flashModel.generateContent("Hello, can you hear me?")
    console.log("✅ Basic API test:", result.response.text())
  } catch (error) {
    console.error("❌ Basic API test failed:", error.message)
  }

  // Test YouTube URL transcription using pro model
  try {
    const proModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    console.log("🔄 Testing YouTube URL transcription...")

    // YouTube video URL to test
    const youtubeUrl = "https://www.youtube.com/watch?v=9hE5-98ZeCg" // Replace with your test video

    const result = await proModel.generateContent([
      PROMPT,
      {
        fileData: {
          fileUri: youtubeUrl,
        },
      },
    ])

    console.log("✅ YouTube transcription result:")
    console.log("-----------------------------------")
    console.log(result.response.text().substring(0, 500) + "...")
    console.log("-----------------------------------")
  } catch (error) {
    console.error("❌ YouTube transcription test failed:", error.message)
    console.error(error)
  }
}

minimalTest()
