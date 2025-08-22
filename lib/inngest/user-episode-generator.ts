import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { GoogleGenAI } from "@google/genai"
import { generateText } from "ai"
import mime from "mime"
import { YoutubeTranscript } from "youtube-transcript"
import { aiConfig } from "@/config/ai"
import { ensureUserEpisodesBucketName, getStorageUploader } from "@/lib/gcs"
import { prisma } from "@/lib/prisma"
import { inngest } from "./client"

// ensure we store to correct bucket with  GCS_USER_EPISODES_BUCKET_NAME when user creates an episode
// ensure we store to correct bucket name when admin creates episode with GOOGLE_CLOUD_STORAGE_BUCKET_NAME

async function uploadContentToBucket(data: Buffer, destinationFileName: string) {
	try {
		const uploader = getStorageUploader()
		// Use the dedicated user episodes bucket for user-generated content
		const bucketName = ensureUserEpisodesBucketName()
		console.log(`Uploading to bucket: ${bucketName}`)

		const [exists] = await uploader.bucket(bucketName).exists()

		if (!exists) {
			console.error("ERROR: Bucket does not exist:", bucketName)
			throw new Error(`Bucket ${bucketName} does not exist`)
		}

		console.log("Bucket exists, uploading file…")
		await uploader.bucket(bucketName).file(destinationFileName).save(data)
		console.log("File uploaded successfully")
		// Return the GCS URI
		return `gs://${bucketName}/${destinationFileName}`
	} catch (error) {
		console.error("Failed to upload content:", error)
		// Avoid leaking internal error details
		throw new Error("Failed to upload content")
	}
}

// TODO: Define types for event payload
const googleAI = createGoogleGenerativeAI({
	apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

// Gemini TTS configuration
const geminiTTSConfig = {
	temperature: 1,
	responseModalities: ["audio"],
	speechConfig: {
		multiSpeakerVoiceConfig: {
			speakerVoiceConfigs: [
				{
					speaker: "Speaker 1 (Host)",
					voiceConfig: {
						prebuiltVoiceConfig: {
							voiceName: "Enceladus",
						},
					},
				},
				{
					speaker: "Speaker 2 (PodSlice AI)",
					voiceConfig: {
						prebuiltVoiceConfig: {
							voiceName: "Aoede",
						},
					},
				},
			],
		},
	},
}

interface WavConversionOptions {
	numChannels: number
	sampleRate: number
	bitsPerSample: number
}

function convertToWav(rawData: string, mimeType: string) {
	const options = parseMimeType(mimeType)
	const wavHeader = createWavHeader(rawData.length, options)
	const buffer = Buffer.from(rawData, "base64")

	return Buffer.concat([wavHeader, buffer])
}

function parseMimeType(mimeType: string) {
	const [fileType, ...params] = mimeType.split(";").map(s => s.trim())
	const [_, format] = fileType.split("/")

	const options: Partial<WavConversionOptions> = {
		numChannels: 1,
	}

	if (format?.startsWith("L")) {
		const bits = parseInt(format.slice(1), 10)
		if (!Number.isNaN(bits)) {
			options.bitsPerSample = bits
		}
	}

	for (const param of params) {
		const [key, value] = param.split("=").map(s => s.trim())
		if (key === "rate") {
			options.sampleRate = parseInt(value, 10)
		}
	}

	return options as WavConversionOptions
}

function createWavHeader(dataLength: number, options: WavConversionOptions) {
	const { numChannels, sampleRate, bitsPerSample } = options

	// http://soundfile.sapp.org/doc/WaveFormat

	const byteRate = (sampleRate * numChannels * bitsPerSample) / 8
	const blockAlign = (numChannels * bitsPerSample) / 8
	const buffer = Buffer.alloc(44)

	buffer.write("RIFF", 0) // ChunkID
	buffer.writeUInt32LE(36 + dataLength, 4) // ChunkSize
	buffer.write("WAVE", 8) // Format
	buffer.write("fmt ", 12) // Subchunk1ID
	buffer.writeUInt32LE(16, 16) // Subchunk1Size (PCM)
	buffer.writeUInt16LE(1, 20) // AudioFormat (1 = PCM)
	buffer.writeUInt16LE(numChannels, 22) // NumChannels
	buffer.writeUInt32LE(sampleRate, 24) // SampleRate
	buffer.writeUInt32LE(byteRate, 28) // ByteRate
	buffer.writeUInt16LE(blockAlign, 32) // BlockAlign
	buffer.writeUInt16LE(bitsPerSample, 34) // BitsPerSample
	buffer.write("data", 36) // Subchunk2ID
	buffer.writeUInt32LE(dataLength, 40) // Subchunk2Size

	return buffer
}

async function generateAudioWithGeminiTTS(script: string): Promise<Buffer> {
	const geminiApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

	if (!geminiApiKey) {
		throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set.")
	}

	const ai = new GoogleGenAI({
		apiKey: geminiApiKey,
	})

	const model = "gemini-2.5-pro-preview-tts" // Using a specific TTS model
	const contents = [
		{
			role: "user",
			parts: [
				{
					text: `Please read the following script aloud in a clear, engaging podcast style:\n\n${script}`,
				},
			],
		},
	]

	const response = await ai.models.generateContentStream({
		model,
		config: geminiTTSConfig,
		contents,
	})

	let audioBuffer: Buffer | null = null

	for await (const chunk of response) {
		if (!chunk.candidates?.[0]?.content?.parts?.[0]) {
			continue
		}
		const inlineData = chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData
		if (inlineData) {
			let fileExtension = mime.getExtension(inlineData.mimeType || "")
			let buffer = Buffer.from(inlineData.data || "", "base64")

			if (!fileExtension) {
				fileExtension = "wav"
				buffer = convertToWav(inlineData.data || "", inlineData.mimeType || "")
			}

			audioBuffer = buffer
			break // Take the first audio chunk
		}
	}

	if (!audioBuffer) {
		throw new Error("Failed to generate audio with Gemini TTS")
	}

	return audioBuffer
}

type JsonBuffer = { type: "Buffer"; data: number[] }

function isJsonBuffer(value: unknown): value is JsonBuffer {
	return typeof value === "object" && value !== null && (value as { type?: unknown }).type === "Buffer" && Array.isArray((value as { data?: unknown }).data)
}

function ensureNodeBuffer(value: unknown): Buffer {
	if (Buffer.isBuffer(value)) return value
	if (isJsonBuffer(value)) return Buffer.from(value.data)
	throw new Error("Invalid audio buffer returned from TTS step")
}

export const generateUserEpisode = inngest.createFunction(
	{
		id: "generate-user-episode-workflow",
		name: "Generate User Episode Workflow",
		retries: 2,
		onFailure: async ({ error: _error, event }) => {
			const { userEpisodeId } = (event as unknown as { data: { userEpisodeId: string } }).data
			await prisma.userEpisode.update({
				where: { episode_id: userEpisodeId },
				data: { status: "FAILED" },
			})
		},
	},
	{
		event: "user.episode.generate.requested",
	},
	async ({ event, step }) => {
		const { userEpisodeId } = event.data as { userEpisodeId: string }

		await step.run("update-status-to-processing", async () => {
			return await prisma.userEpisode.update({
				where: { episode_id: userEpisodeId },
				data: { status: "PROCESSING" },
			})
		})

		// Step 1: Fetch Transcript
		const transcript = await step.run("fetch-transcript", async () => {
			const episode = await prisma.userEpisode.findUnique({
				where: { episode_id: userEpisodeId },
			})

			if (!episode) {
				throw new Error(`UserEpisode with ID ${userEpisodeId} not found.`)
			}

			const transcriptData = await YoutubeTranscript.fetchTranscript(episode.youtube_url)
			const transcriptText = transcriptData.map(entry => entry.text).join(" ")

			await prisma.userEpisode.update({
				where: { episode_id: userEpisodeId },
				data: { transcript: transcriptText },
			})

			return transcriptText
		})

		// Step 2: Summarize Transcript
		const summary = await step.run("summarize-transcript", async () => {
			const model = googleAI(aiConfig.geminiModel)
			try {
				const { text } = await generateText({
					model: model,
					prompt: `Summarize the following transcript into an engaging podcast script of approximately 300 words. The script should have a clear narrative, including an introduction, main points, and a conclusion. The tone should be informative and conversational. Focus on the most interesting and important information from the transcript.\n\nTranscript: ${transcript}`,
				})

				await prisma.userEpisode.update({
					where: { episode_id: userEpisodeId },
					data: { summary: text },
				})

				return text
			} catch (error) {
				console.error("Error during summarization:", error)
				throw new Error(`Failed to summarize content: ${(error as Error).message}`)
			}
		})

		// Step 3: Convert to Audio
		const audioBuffer = await step.run("convert-to-audio", async () => {
			return await generateAudioWithGeminiTTS(summary)
		})

		// Step 4: Upload to GCS
		const gcsAudioUrl = await step.run("upload-audio-to-gcs", async () => {
			const fileName = `user-episodes/${userEpisodeId}-${Date.now()}.wav`
			return await uploadContentToBucket(ensureNodeBuffer(audioBuffer as unknown), fileName)
		})

		// Step 5: Finalize Episode
		await step.run("finalize-episode", async () => {
			return await prisma.userEpisode.update({
				where: { episode_id: userEpisodeId },
				data: {
					gcs_audio_url: gcsAudioUrl,
					status: "COMPLETED",
				},
			})
		})

		return {
			message: "Episode generation workflow completed",
			userEpisodeId,
		}
	}
)
