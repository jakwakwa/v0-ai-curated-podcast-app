import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js"
import { Storage } from "@google-cloud/storage"

import type { Podcast as SourceModel } from "@prisma/client"
import { generateText } from "ai"
import { randomUUID } from "node:crypto"
import { YoutubeTranscript } from "youtube-transcript"
import { aiConfig } from "../config/ai"
import emailService from "../lib/email-service"
import { prisma } from "../lib/prisma"
import { inngest } from "./client"

type SourceWithTranscript = Omit<SourceModel, "createdAt"> & {
	createdAt: string
	transcript: string
}

type AdminSourceData = {
	id: string
	name: string
	url: string
	imageUrl: string | null
	createdAt: string
}

type AdminSourceWithTranscript = AdminSourceData & {
	transcript: string
}

const elevenlabs = new ElevenLabsClient({
	apiKey: process.env.NODE_ENV === "production" ? process.env.ELEVEN_LABS_PROD : process.env.ELEVEN_LABS_DEV,
})
const uploaderKeyPath = process.env.GCS_UPLOADER_KEY_PATH
const readerKeyPath = process.env.GCS_READER_KEY_PATH

if (!uploaderKeyPath) {
	console.error("ERROR: GCS_UPLOADER_KEY_PATH environment variable is not set.")
	process.exit(1)
}
if (!readerKeyPath) {
	console.error("ERROR: GCS_READER_KEY_PATH environment variable is not set.")
	process.exit(1)
}

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
		const [exists] = await storageUploader.bucket(bucketName).exists()

		if (!exists) {
			console.error("ERROR: Bucket does not exist:", bucketName)
			throw new Error(`Bucket ${bucketName} does not exist`)
		}

		await storageUploader.bucket(bucketName).file(destinationFileName).save(data)
		return { success: true, fileName: destinationFileName }
	} catch (error) {
		console.error("Upload error:", (error as Error).message)
		throw new Error(`Failed to upload content: ${error}`)
	}
}

async function _readContentFromBucket(bucketName: string, fileName: string): Promise<Buffer> {
	try {
		const [fileBuffer] = await storageReader.bucket(bucketName).file(fileName).download()
		return fileBuffer
	} catch (error) {
		console.error("ERROR during read:", error)
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
		const userCurationProfile = await step.run("fetch-collection-data", async () => {
			const fetchedUserCurationProfile = await prisma.userCurationProfile.findUnique({
				where: { profile_id: collectionId },
				include: {
					profile_podcast: {
						include: { podcast: true },
					},
				},
			})
			if (!fetchedUserCurationProfile) {
				throw new Error(`User Curation Profile with ID ${collectionId} not found.`)
			}
			return fetchedUserCurationProfile
		})

		const sourcesWithTranscripts: SourceWithTranscript[] = await Promise.all(
			userCurationProfile.profile_podcast.map(async selection => {
				const s = selection.podcast
				// Extract video ID from YouTube URL
				const videoIdMatch = s.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/)
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
					console.error(`Could not extract youtube video ID from URL: ${s.url}`)
				}

				const { created_at, ...rest } = s
				return {
					...rest,
					createdAt: created_at.toString(),
					transcript: transcriptContent,
				} as SourceWithTranscript
			})
		)

		const aggregatedContent = sourcesWithTranscripts.map((s: SourceWithTranscript) => `Source: ${s.name} (${s.url})\nTranscript: ${s.transcript}`).join("\n\n")

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
				console.error("Error during script generation:", error)
				throw new Error(`Failed to generate script: ${(error as Error).message}`)
			}
		})

		// Stage 4: Audio Synthesis and Upload to Google Cloud Storage
		const publicUrl = await step.run("synthesize-audio-and-upload", async () => {
			if (aiConfig.simulateAudioSynthesis) {
				return "sample-for-simulated-tests.mp3"
			}

			try {
				const audio = await elevenlabs.textToSpeech.convert(aiConfig.synthVoice, {
					text: script,
					modelId: "eleven_flash_v2",
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
				const audioFileName = `podcasts/${collectionId}-${Date.now()}.mp3`

				const file = await uploadContentToBucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME!, audioBuffer, audioFileName)

				if (file.success) {
					return file.fileName
				}
			} catch (error) {
				throw new Error(`Failed to generate script: ${(error as Error).message}`)
			}
		})

		// Create a new Episode linked to the UserCurationProfile
		const episode = await step.run("create-episode", async () => {
			// Use the first podcast as the main source for the episode (or adjust as needed)
			const mainPodcast = userCurationProfile.profile_podcast[0]?.podcast
			const episode = await prisma.episode.create({
				data: {
					episode_id: randomUUID(),
					title: `AI Podcast for ${userCurationProfile.name}`,
					description: script,
					audio_url: publicUrl ? publicUrl : "",
					image_url: mainPodcast?.image_url || null,
					published_at: new Date(),
					podcast_id: mainPodcast?.podcast_id || userCurationProfile.profile_podcast[0].podcast.podcast_id,
					profile_id: userCurationProfile.profile_id,
				},
			})
			await prisma.userCurationProfile.update({
				where: { profile_id: collectionId },
				data: { status: "Generated" },
			})
			return episode
		})

		// Send notifications (in-app and email)
		await step.run("send-notifications", async () => {
			const userWithProfile = await prisma.user.findUnique({
				where: { user_id: userCurationProfile.user_id },
				select: {
					user_id: true,
					name: true,
					email: true,
					email_notifications: true,
				},
			})

			if (!userWithProfile) {
				console.error("User not found for episode notification")
				return
			}

			// Create in-app notification
			await prisma.notification.create({
				data: {
					notification_id: randomUUID(),
					user_id: userWithProfile.user_id,
					type: "episode_ready",
					message: `🎧 Your episode "${episode.title}" is ready to listen!`,
					is_read: false,
				},
			})

			// Send email notification if user has email notifications enabled
			if (userWithProfile.email_notifications) {
				const firstName = userWithProfile.name?.split(" ")[0] || "there"
				const episodeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/episodes/${episode.episode_id}`

				await emailService.sendEpisodeReadyEmail(userWithProfile.user_id, userWithProfile.email, {
					userFirstName: firstName,
					episodeTitle: episode.title,
					episodeUrl,
					profileName: userCurationProfile.name,
				})
			}
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

// Admin Bundle Episode Generation Function
export const generateAdminBundleEpisode = inngest.createFunction(
	{
		id: "generate-admin-bundle-episode-workflow",
		name: "Generate Admin Bundle Episode Workflow",
		retries: 1,
	},
	{
		event: "podcast/admin-generate.requested",
	},
	async ({ event, step }) => {
		const { adminCurationProfile, bundleId, episodeTitle, episodeDescription } = event.data

		// Stage 1: Content Aggregation
		const sourcesWithTranscripts: AdminSourceWithTranscript[] = await Promise.all(
			adminCurationProfile.sources.map(async (s: AdminSourceData) => {
				// Extract video ID from YouTube URL
				const videoIdMatch = s.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/)
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
					console.error(`Could not extract youtube video ID from URL: ${s.url}`)
				}

				return {
					id: s.id,
					name: s.name,
					url: s.url,
					imageUrl: s.imageUrl,
					createdAt: s.createdAt,
					transcript: transcriptContent,
				}
			})
		)

		const aggregatedContent = sourcesWithTranscripts.map((s: AdminSourceWithTranscript) => `Source: ${s.name} (${s.url})\nTranscript: ${s.transcript}`).join("\n\n")

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
					prompt: `Based on the following summary, write a podcast style script of approximately 50 words (enough for about a 10 seconds podcast). Include a witty introduction of the summary. **The script should only contain the spoken words without: (e.g., "Host:"), sound effects, specific audio cues, structural markers (e.g., "section 1", "ad breaks"), or timing instructions (e.g., "2 minutes").** Cover most interesting themes from the summary.\n\nSummary: ${summary}`,
				})
				return text
			} catch (error) {
				console.error("Error during script generation:", error)
				throw new Error(`Failed to generate script: ${(error as Error).message}`)
			}
		})

		// Stage 4: Audio Synthesis and Upload to Google Cloud Storage
		const publicUrl = await step.run("synthesize-audio-and-upload", async () => {
			if (aiConfig.simulateAudioSynthesis) {
				return "admin-sample-for-simulated-tests.mp3"
			}

			try {
				const audio = await elevenlabs.textToSpeech.convert(aiConfig.synthVoice, {
					text: script,
					modelId: "eleven_flash_v2",
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
				const audioFileName = `podcasts/${bundleId}-${Date.now()}.mp3`

				const file = await uploadContentToBucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME!, audioBuffer, audioFileName)

				if (file.success) {
					return file.fileName
				}
			} catch (error) {
				console.error("Error during admin audio synthesis/upload:", error)
				throw new Error(`Failed to generate admin episode audio: ${(error as Error).message}`)
			}
		})

		// Create a new CuratedBundleEpisode
		const episode = await step.run("create-bundle-episode", async () => {
			const currentWeek = new Date()
			currentWeek.setHours(0, 0, 0, 0) // Start of day

			// Get the bundle with its associated podcasts to use a valid podcast ID
			const bundleWithPodcasts = await prisma.bundle.findUnique({
				where: { bundle_id: bundleId },
				include: {
					bundle_podcast: {
						include: { podcast: true },
					},
				},
			})

			if (!bundleWithPodcasts || bundleWithPodcasts.bundle_podcast.length === 0) {
				throw new Error(`Bundle ${bundleId} not found or has no associated podcasts`)
			}

			// Use the first podcast from the bundle as the podcast reference
			const firstPodcast = bundleWithPodcasts.bundle_podcast[0].podcast

			const episode = await prisma.episode.create({
				data: {
					episode_id: randomUUID(),
					title: episodeTitle,
					description: episodeDescription || script,
					audio_url: `https://storage.cloud.google.com/ai-weekly-curator-app-bucket/${publicUrl}`,
					image_url: adminCurationProfile.image_url || bundleWithPodcasts.image_url || null,
					published_at: new Date(),
					week_nr: currentWeek,
					bundle_id: bundleId,
					podcast_id: firstPodcast.podcast_id, // Use actual podcast ID from bundle
				},
			})
			return episode
		})

		// Send notifications to users who have this bundle selected
		await step.run("send-bundle-notifications", async () => {
			// Get all users who have selected this bundle in their active profiles
			const usersWithBundle = await prisma.userCurationProfile.findMany({
				where: {
					selected_bundle_id: bundleId,
					is_active: true,
				},
				include: {
					user: {
						select: {
							user_id: true,
							name: true,
							email: true,
							email_notifications: true,
						},
					},
				},
			})

			// Create notifications for each user
			for (const profile of usersWithBundle) {
				// Create in-app notification
				await prisma.notification.create({
					data: {
						notification_id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
						user_id: profile.user.user_id,
						type: "episode_ready",
						message: `🎧 New episode "${episode.title}" is available in your bundle!`,
						is_read: false,
					},
				})

				// Send email notification if enabled
				if (profile.user.email_notifications) {
					const firstName = profile.user.name?.split(" ")[0] || "there"
					const episodeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/episodes/${episode.episode_id}`

					await emailService.sendEpisodeReadyEmail(profile.user.user_id, profile.user.email, {
						userFirstName: firstName,
						episodeTitle: episode.title,
						episodeUrl,
						profileName: profile.name,
					})
				}
			}

			console.log(`Sent notifications to ${usersWithBundle.length} users for bundle episode: ${episode.title}`)
		})

		if (aiConfig.simulateAudioSynthesis) {
			return {
				success: true,
				bundleId,
				audioUrl: "public/admin-sample-for-simulated-tests.mp3",
				isSimulated: aiConfig.simulateAudioSynthesis,
				title: episodeTitle,
			}
		}
		return {
			success: true,
			bundleId,
			audioUrl: `https://storage.cloud.google.com/ai-weekly-curator-app-bucket/${publicUrl}`,
			isSimulated: aiConfig.simulateAudioSynthesis,
			title: episodeTitle,
		}
	}
)
