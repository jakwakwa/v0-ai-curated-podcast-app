import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js"
import { Storage } from "@google-cloud/storage"
import type { Source } from "@prisma/client"
import { generateText } from "ai"
import { YoutubeTranscript } from "youtube-transcript" // New import
import { aiConfig } from "../config/ai"
import prisma from "../lib/prisma"
import { inngest } from "./client"

type SourceWithTranscript = Omit<Source, "createdAt"> & {
	createdAt: string
	transcript: string
}

const elevenlabs = new ElevenLabsClient({
	apiKey: process.env.ELEVENLABS_API_KEY || "",
})
const storage = new Storage({
	projectId: process.env.GOOGLE_CLOUD_PROJECT_ID as string,
})
const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME as string)

const googleAI = createGoogleGenerativeAI({ fetch: global.fetch })

export const generatePodcast = inngest.createFunction(
	{
		id: "generate-podcast-workflow",
		name: "Generate Podcast Workflow",
		retries: 2,
	},
	{
		event: "podcast/generate.requested",
	},
	async ({ event, step }) => {
		const { collectionId } = event.data

		// Stage 1: Content Aggregation
		const collection = await step.run("fetch-collection-data", async () => {
			const fetchedCollection = await prisma.collection.findUnique({
				where: { id: collectionId },
				include: { sources: true },
			})
			if (!fetchedCollection) {
				throw new Error(`Collection with ID ${collectionId} not found.`)
			}
			return fetchedCollection
		})

		const sourcesWithTranscripts: SourceWithTranscript[] = await Promise.all(
			collection.sources.map(async s => {
				// Extract video ID from YouTube URL
				const videoIdMatch = s.url.match(
					/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/
				)
				const videoId = videoIdMatch ? videoIdMatch[1] : null

				let transcriptContent = `No transcript available for ${s.name} from ${s.url}.`

				if (videoId) {
					try {
						const transcriptData = await YoutubeTranscript.fetchTranscript(videoId)
						transcriptContent = transcriptData.map(entry => entry.text).join(" ")
					} catch (error) {
						transcriptContent = `Failed to retrieve transcript for ${s.name} from ${s.url}. Error: ${(error as Error).message}`
					}
				} else {
					// biome-ignore lint/suspicious/noConsole: <explanation: This log is for debugging purposes when a video ID cannot be extracted from a URL.>
					console.error(`Could not extract video ID from URL: ${s.url}`)
				}

				const { createdAt, ...rest } = s
				return {
					...rest,
					createdAt: createdAt,
					transcript: transcriptContent,
				} as SourceWithTranscript
			})
		)

		const aggregatedContent = sourcesWithTranscripts
			.map((s: SourceWithTranscript) => `Source: ${s.name} (${s.url})\nTranscript: ${s.transcript}`)
			.join("\n\n")

		// Stage 2: Summarization
		const summary = await step.run("summarize-content", async () => {
			const geminiApiKey = process.env.GOOGLE_GENERATIVE_AI_GEMINI_API_KEY

			if (!geminiApiKey) {
				throw new Error("GOOGLE_GENERATIVE_AI_GEMINI_API_KEY is not set.")
			}
			if (!aiConfig.geminiModel) {
				throw new Error("aiConfig.geminiModel is not defined.")
			}

			const model = googleAI(aiConfig.geminiModel)

			try {
				const { text } = await generateText({
					model: model,
					prompt: `Summarize the following content for a podcast episode, focusing on all key themes and interesting points. Provide a comprehensive overview, suitable for developing into a 5-minute podcast script. Ensure sufficient detail for expansion.\n\n${aggregatedContent}`,
				})
				return text
			} catch (error) {
				// biome-ignore lint/suspicious/noConsole: <explanation: This log is for debugging purposes to catch errors during text generation.>
				console.error("Error during summarization:", error)
				throw new Error(`Failed to summarize content: ${(error as Error).message}`)
			}
		})

		// Stage 3: Script Generation
		const script = await step.run("generate-script", async () => {
			const model = googleAI(aiConfig.geminiModel)
			try {
				const { text } = await generateText({
					model: model,
					prompt: `Based on the following summary, write a conversational podcast script of approximately 750 words (enough for about a 5-minute podcast). Include a clear introduction, smooth transitions between topics, and a concise conclusion. Make it engaging, easy to listen to, and maintain a friendly and informative tone. **The script should only contain the spoken words, without any formatting (like bolding), speaker labels (e.g., "Host:"), sound effects, specific audio cues, structural markers (e.g., "section 1", "ad breaks"), or timing instructions (e.g., "2 minutes").** Cover all key themes and interesting points from the summary.\n\nSummary: ${summary}`,
				})
				return text
			} catch (error) {
				// biome-ignore lint/suspicious/noConsole: <explanation: This log is for debugging purposes to catch errors during script generation.>
				console.error("Error during script generation:", error)
				throw new Error(`Failed to generate script: ${(error as Error).message}`)
			}
		})

		// Stage 4: Audio Synthesis and Upload to Google Cloud Storage
		const publicUrl = await step.run("synthesize-audio-and-upload", async () => {
			if (aiConfig.simulateAudioSynthesis) {
				// Simulate an audio buffer and a public URL to continue the workflow
				const simulatedAudioFileName = `podcasts/${collectionId}-${Date.now()}.mp3`
				// In a real simulation, you might store this in a temp mock storage
				return `https://mock-storage.googleapis.com/simulated-bucket/${simulatedAudioFileName}`
			}
			try {
				const audio = await elevenlabs.textToSpeech.convert(aiConfig.synthVoice, {
					text: script,
					modelId: aiConfig.geminiModel,
				})

				const streamToBuffer = async (stream: ReadableStream<Uint8Array>) => {
					const reader = stream.getReader()
					const chunks: Uint8Array[] = []
					while (true) {
						const { done, value } = await reader.read()
						if (done) break
						if (value) chunks.push(value)
					}
					return Buffer.concat(chunks)
				}

				const audioBuffer = await streamToBuffer(audio)
				const audioFileName = `podcasts/${collectionId}-${Date.now()}.mp3` // Generate filename here
				const file = bucket.file(audioFileName)
				await file.save(audioBuffer, {
					contentType: "audio/mpeg",
				})
				return `https://storage.googleapis.com/${bucket.name}/${audioFileName}`
			} catch (error) {
				// biome-ignore lint/suspicious/noConsole: <explanation: This log is for debugging purposes to catch errors during audio synthesis or upload.>
				console.error("Error during audio synthesis or upload:", error)
				throw new Error(`Failed to synthesize audio or upload to storage: ${(error as Error).message}`)
			}
		})

		// Create a new Episode linked to the Collection
		await step.run("create-episode", async () => {
			// Use the first source as the main source for the episode (or adjust as needed)
			const mainSource = collection.sources[0]
			await prisma.episode.create({
				data: {
					title: `AI Podcast for ${collection.name}`,
					description: script, // or summary
					audioUrl: publicUrl,
					imageUrl: mainSource?.imageUrl || null,
					publishedAt: new Date(),
					sourceId: mainSource?.id || collection.sources[0].id, // fallback to first source
					collectionId: collection.id,
				},
			})
			// Optionally, update collection status
			await prisma.collection.update({
				where: { id: collectionId },
				data: { status: "Generated" },
			})
		})
		return {
			success: true,
			collectionId,
			audioUrl: publicUrl,
		}
	}
)
