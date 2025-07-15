import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js"
import { Storage } from "@google-cloud/storage"

import type { Source as SourceModel } from "@prisma/client"
import { generateText } from "ai"
import { YoutubeTranscript } from "youtube-transcript"
import { aiConfig } from "../config/ai"
import prisma from "../lib/prisma"
import { inngest } from "./client"

type SourceWithTranscript = Omit<SourceModel, "createdAt"> & {
	createdAt: string
	transcript: string
}

const elevenlabs = new ElevenLabsClient({
	apiKey: process.env.XAI_API_KEY || "",
})
const uploaderKeyPath = process.env.GCS_UPLOADER_KEY_PATH
const readerKeyPath = process.env.GCS_READER_KEY_PATH

if (!uploaderKeyPath) {
	// biome-ignore lint/suspicious/noConsole: <debug>
	console.error("ERROR: GCS_UPLOADER_KEY_PATH environment variable is not set.")
	process.exit(1) // Exit or handle gracefully
}
if (!readerKeyPath) {
	// biome-ignore lint/suspicious/noConsole: <debug>
	console.error("ERROR: GCS_READER_KEY_PATH environment variable is not set.")
	process.exit(1) // Exit or handle gracefully
}

// Debugging: Log the resolved path to see what the application is using
// biome-ignore lint/suspicious/noConsole: <debugging>
console.log("Resolved GCS_UPLOADER_KEY_PATH:", uploaderKeyPath)

// Initialize a Storage client Service with Key for uploading operations
const storageUploader = new Storage({
	keyFilename: uploaderKeyPath,
})

// Initialize a separate Storage client Service with Key for reading operations
const _storageReader = new Storage({
	keyFilename: readerKeyPath,
})

// Initialize a separate Storage client for reading operations
const storageReader = new Storage({
	keyFilename: readerKeyPath,
})

async function uploadContentToBucket(bucketName: string, data: Buffer, destinationFileName: string) {
	try {
		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.log("=== UPLOAD DEBUG START ===")
		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.log("Bucket name:", bucketName)
		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.log("Destination file name:", destinationFileName)
		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.log("Data buffer size:", data.length, "bytes")
		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.log("Storage uploader key path:", uploaderKeyPath)
		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.log("GOOGLE_CLOUD_STORAGE_BUCKET_NAME env var:", process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME)
		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.log("Bucket name parameter:", bucketName)
		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.log("Bucket name is undefined:", bucketName === undefined)
		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.log("Bucket name is null:", bucketName === null)
		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.log("Bucket name is empty string:", bucketName === "")

		// Check if bucket exists (commented out due to permissions issue)
		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.log("Skipping bucket existence check due to permissions...")
		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.log("Proceeding directly to upload...")
		/*
		const [exists] = await storageUploader.bucket(bucketName).exists()
		console.log("Bucket exists:", exists)

		if (!exists) {
			console.error("ERROR: Bucket does not exist:", bucketName)
			throw new Error(`Bucket ${bucketName} does not exist`)
		}
		*/

		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.log("Attempting to upload file...")
		await storageUploader.bucket(bucketName).file(destinationFileName).save(data)
		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.log("File uploaded successfully!")
		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.log("=== UPLOAD DEBUG END ===")
		return { success: true, fileName: destinationFileName }
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.error("=== UPLOAD ERROR DEBUG ===")
		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.error("Error type:", typeof error)
		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.error("Error message:", (error as Error).message)
		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.error("Error stack:", (error as Error).stack)
		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.error("Full error object:", error)
		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.error("=== UPLOAD ERROR DEBUG END ===")
		throw new Error(`Failed to upload content: ${error}`)
	}
}

async function _readContentFromBucket(bucketName: string, fileName: string): Promise<Buffer> {
	try {
		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.info(`Attempting to read ${fileName} from ${bucketName}...`)
		const [fileBuffer] = await storageReader.bucket(bucketName).file(fileName).download()
		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.info(`Successfully read ${fileName}.`)
		return fileBuffer
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: <debugging>
		console.error("ERROR during read:", error)
		toast(`Failed to read content from ${fileName}! Please try another Source`)
		throw new Error(`Failed to read content: ${error as Error}`)
	}
}

const googleAI = createGoogleGenerativeAI({ fetch: global.fetch })

export const generatePodcast = inngest.createFunction(
	{
		id: "generate-podcast-workflow",
		name: "Generate Podcast Workflow",
		retries: 1,
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
						toast(`Failed to retrieve transcript for ${s.name} from ${s.url}. Error: ${(error as Error).message}`)
					}
				} else {
					// biome-ignore lint/suspicious/noConsole: <debugging: This log is for debugging purposes when a youtubevideo ID cannot be extracted from a URL.>
					console.error(`Could not extract youtube video ID from URL: ${s.url}`)
					toast(`Could not extract youtube video ID from URL: ${s.url}`)
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
			const geminiApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

			if (!geminiApiKey) {
				throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set.")
			}
			if (!aiConfig.geminiModel) {
				throw new Error("aiConfig.geminiModel is not defined.")
			}

			const model = googleAI(aiConfig.geminiModel)

			try {
				const { text } = await generateText({
					model: model,
					prompt: `Summarize the following content for a podcast episode, focusing on all key themes and interesting points. Provide a comprehensive overview, suitable for developing into a 2-minute podcast script. Ensure sufficient detail for expansion.\n\n${aggregatedContent}`,
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
					prompt: `Based on the following summary, write a podcast style script of approximately 300 words (enough for about a 2-minute podcast). Include a witty introduction, smooth transitions between topics, and a concise conclusion. Make it engaging, easy to listen to, and maintain a friendly and informative tone. **The script should only contain the spoken words without: (e.g., "Host:"), sound effects, specific audio cues, structural markers (e.g., "section 1", "ad breaks"), or timing instructions (e.g., "2 minutes").** Cover most interesting themes from the summary.\n\nSummary: ${summary}`,
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
			// biome-ignore lint/suspicious/noConsole: <debugging>
			console.log("=== AUDIO SYNTHESIS DEBUG START ===")
			// biome-ignore lint/suspicious/noConsole: <debugging>
			console.log("Collection ID:", collectionId)
			// biome-ignore lint/suspicious/noConsole: <debugging>
			console.log("Script length:", script.length, "characters")
			// biome-ignore lint/suspicious/noConsole: <debugging>
			console.log("AI config simulate audio synthesis:", aiConfig.simulateAudioSynthesis)

			if (aiConfig.simulateAudioSynthesis) {
				// biome-ignore lint/suspicious/noConsole: <debugging>
				console.log("Using simulated audio synthesis")
				// Simulate an audio buffer and a public URL to continue the workflow
				// const simulatedAudioFileName = `podcasts/${collectionId}-${Date.now()}.mp3`
				// In a real simulation, you might store this in a temp mock storage
				return "sample-for-simulated-tests.mp3"
			}

			try {
				// biome-ignore lint/suspicious/noConsole: <debugging>
				console.log("Starting ElevenLabs text-to-speech conversion...")
				// biome-ignore lint/suspicious/noConsole: <debugging>
				console.log("Voice ID:", aiConfig.synthVoice)
				// biome-ignore lint/suspicious/noConsole: <debugging>
				console.log("XAI_API_KEY set:", !!process.env.XAI_API_KEY)

				const audio = await elevenlabs.textToSpeech.convert(aiConfig.synthVoice, {
					text: script,
					modelId: "eleven_flash_v2",
				})

				// biome-ignore lint/suspicious/noConsole: <debugging>
				console.log("Audio stream received, converting to buffer...")

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
				// biome-ignore lint/suspicious/noConsole: <debugging>
				console.log("Audio buffer created, size:", audioBuffer.length, "bytes")

				const audioFileName = `https://storage.cloud.google.com/ai-weekly-curator-app-bucket/podcasts/${collectionId}-${Date.now()}.mp3` // Generate filename here
				// biome-ignore lint/suspicious/noConsole: <debugging>
				console.log("Generated audio file name:", audioFileName)
				// biome-ignore lint/suspicious/noConsole: <debugging>
				console.log("Bucket name for upload:", process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME)

				const file = await uploadContentToBucket(
					process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME!,
					audioBuffer,
					audioFileName
				)

				if (file.success) {
					// biome-ignore lint/suspicious/noConsole: <debugging>
					console.log("File upload successful, returning:", file.fileName)
					return file.fileName
				}
			} catch (error) {
				// biome-ignore lint/suspicious/noConsole: <debugging>
				console.error("=== AUDIO SYNTHESIS ERROR DEBUG ===")
				// biome-ignore lint/suspicious/noConsole: <debugging>
				console.error("Error during audio synthesis/upload:", error)
				// biome-ignore lint/suspicious/noConsole: <debugging>
				console.error("Error message:", (error as Error).message)
				// biome-ignore lint/suspicious/noConsole: <debugging>
				console.error("Error stack:", (error as Error).stack)
				// biome-ignore lint/suspicious/noConsole: <debugging>
				console.error("=== AUDIO SYNTHESIS ERROR DEBUG END ===")
				// console.error("Error during script generation:", error)
				throw new Error(`Failed to generate script: ${(error as Error).message}`)
			}
		})

		// Create a new Episode linked to the Collection
		await step.run("create-episode", async () => {
			// Use the first source as the main source for the episode (or adjust as needed)
			const mainSource = collection.sources[0]
			await prisma.episode.create({
				data: {
					title: `AI Podcast for ${collection.name}`,
					description: script,
					audioUrl: publicUrl ? publicUrl : "",
					imageUrl: mainSource?.imageUrl || null,
					publishedAt: new Date(),
					sourceId: mainSource?.id || collection.sources[0].id,
					collectionId: collection.id,
				},
			})
			await prisma.collection.update({
				where: { id: collectionId },
				data: { status: "Generated" },
			})
		})
		if (aiConfig.simulateAudioSynthesis) {
			// DO NOT CHANGE THIS RETURN STATEMENT
			return {
				success: true,
				collectionId,
				audioUrl: "public/sample-for-simulated-tests.mp3",
				isSimulated: aiConfig.simulateAudioSynthesis,
			}
		}
		return {
			success: true,
			collectionId,
			audioUrl: publicUrl,
			isSimulated: aiConfig.simulateAudioSynthesis,
		}
	}
)
function toast(message: string) {
	// biome-ignore lint/suspicious/noConsole: <debugging>
	console.log("TOAST:", message)
}
