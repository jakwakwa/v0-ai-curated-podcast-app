import { randomUUID } from "node:crypto";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { GoogleGenAI } from "@google/genai";
import { generateText } from "ai";
import mime from "mime";
import { aiConfig } from "@/config/ai";
import emailService from "@/lib/email-service";
import { ensureBucketName, getStorageReader, getStorageUploader } from "@/lib/gcs";
import { prisma } from "@/lib/prisma";
import { getTranscriptOrchestrated } from "@/lib/transcripts";
import type { Podcast as PodcastModel } from "@/lib/types";
import { inngest } from "./client";

type SourceWithTranscript = Omit<PodcastModel, "created_at"> & {
	createdAt: string;
	transcript: string;
};

type AdminSourceData = {
	id: string;
	name: string;
	url: string;
	imageUrl: string | null;
	createdAt: string;
};

type AdminSourceWithTranscript = AdminSourceData & {
	transcript: string;
};

async function uploadContentToBucket(data: Buffer, destinationFileName: string) {
	try {
		const storageUploader = getStorageUploader();
		const bucketName = ensureBucketName();
		console.log(`Uploading to bucket: ${bucketName}`);

		const [exists] = await storageUploader.bucket(bucketName).exists();

		if (!exists) {
			console.error("ERROR: Bucket does not exist:", bucketName);
			throw new Error(`Bucket ${bucketName} does not exist`);
		}

		console.log("Bucket exists, uploading file…");
		await storageUploader.bucket(bucketName).file(destinationFileName).save(data);
		console.log("File uploaded successfully");
		return { success: true, fileName: destinationFileName };
	} catch {
		// Avoid leaking internal error details
		throw new Error("Failed to upload content");
	}
}

async function _readContentFromBucket(fileName: string): Promise<Buffer> {
	try {
		const storageReader = getStorageReader();
		const bucketName = ensureBucketName();
		const [fileBuffer] = await storageReader.bucket(bucketName).file(fileName).download();
		return fileBuffer;
	} catch {
		throw new Error("Failed to read content");
	}
}

const googleAI = createGoogleGenerativeAI({ fetch: global.fetch });

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
};

interface WavConversionOptions {
	numChannels: number;
	sampleRate: number;
	bitsPerSample: number;
}

function convertToWav(rawData: string, mimeType: string) {
	const options = parseMimeType(mimeType);
	const wavHeader = createWavHeader(rawData.length, options);
	const buffer = Buffer.from(rawData, "base64");

	return Buffer.concat([wavHeader, buffer]);
}

function parseMimeType(mimeType: string) {
	const [fileType, ...params] = mimeType.split(";").map(s => s.trim());
	const [_, format] = fileType.split("/");

	const options: Partial<WavConversionOptions> = {
		numChannels: 1,
	};

	if (format?.startsWith("L")) {
		const bits = parseInt(format.slice(1), 10);
		if (!Number.isNaN(bits)) {
			options.bitsPerSample = bits;
		}
	}

	for (const param of params) {
		const [key, value] = param.split("=").map(s => s.trim());
		if (key === "rate") {
			options.sampleRate = parseInt(value, 10);
		}
	}

	return options as WavConversionOptions;
}

function createWavHeader(dataLength: number, options: WavConversionOptions) {
	const { numChannels, sampleRate, bitsPerSample } = options;

	// http://soundfile.sapp.org/doc/WaveFormat

	const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
	const blockAlign = (numChannels * bitsPerSample) / 8;
	const buffer = Buffer.alloc(44);

	buffer.write("RIFF", 0); // ChunkID
	buffer.writeUInt32LE(36 + dataLength, 4); // ChunkSize
	buffer.write("WAVE", 8); // Format
	buffer.write("fmt ", 12); // Subchunk1ID
	buffer.writeUInt32LE(16, 16); // Subchunk1Size (PCM)
	buffer.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
	buffer.writeUInt16LE(numChannels, 22); // NumChannels
	buffer.writeUInt32LE(sampleRate, 24); // SampleRate
	buffer.writeUInt32LE(byteRate, 28); // ByteRate
	buffer.writeUInt16LE(blockAlign, 32); // BlockAlign
	buffer.writeUInt16LE(bitsPerSample, 34); // BitsPerSample
	buffer.write("data", 36); // Subchunk2ID
	buffer.writeUInt32LE(dataLength, 40); // Subchunk2Size

	return buffer;
}

async function generateAudioWithGeminiTTS(script: string): Promise<Buffer> {
	const geminiApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

	if (!geminiApiKey) {
		throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set.");
	}

	const ai = new GoogleGenAI({
		apiKey: geminiApiKey,
	});

	const model = "gemini-2.5-pro-preview-tts";
	const contents = [
		{
			role: "user",
			parts: [
				{
					text: `Please read aloud the following in a podcast interview style:\n\n${script}`,
				},
			],
		},
	];

	const response = await ai.models.generateContentStream({
		model,
		config: geminiTTSConfig,
		contents,
	});

	let audioBuffer: Buffer | null = null;

	for await (const chunk of response) {
		if (!chunk.candidates?.[0]?.content?.parts?.[0]) {
			continue;
		}
		const inlineData = chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData;
		if (inlineData) {
			let fileExtension = mime.getExtension(inlineData.mimeType || "");
			let buffer = Buffer.from(inlineData.data || "", "base64");

			if (!fileExtension) {
				fileExtension = "wav";
				buffer = convertToWav(inlineData.data || "", inlineData.mimeType || "");
			}

			audioBuffer = buffer;
			break; // Take the first audio chunk
		}
	}

	if (!audioBuffer) {
		throw new Error("Failed to generate audio with Gemini TTS");
	}

	return audioBuffer;
}

export const generatePodcastWithGeminiTTS = inngest.createFunction(
	{
		id: "generate-podcast-gemini-tts-workflow",
		name: "Generate Podcast with Gemini TTS Workflow",
		retries: 1,
	},
	{
		event: "podcast/generate-gemini-tts.requested",
	},
	async ({ event, step }) => {
		const { collectionId } = event.data;

		// Stage 1: Content Aggregation
		const userCurationProfile = await step.run("fetch-collection-data", async () => {
			const fetchedUserCurationProfile = await prisma.userCurationProfile.findUnique({
				where: { profile_id: collectionId },
				include: {
					profile_podcast: {
						include: { podcast: true },
					},
				},
			});
			if (!fetchedUserCurationProfile) {
				throw new Error(`User Curation Profile with ID ${collectionId} not found.`);
			}
			return fetchedUserCurationProfile;
		});

		const sourcesWithTranscripts: SourceWithTranscript[] = await Promise.all(
			userCurationProfile.profile_podcast.map(async selection => {
				const s = selection.podcast;
				// Extract video ID from YouTube URL
				const videoIdMatch = s.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
				const videoId = videoIdMatch ? videoIdMatch[1] : null;

				let transcriptContent = `No transcript available for ${s.name} from ${s.url}.`;

				if (videoId) {
					try {
						const result = await getTranscriptOrchestrated({ url: s.url, allowPaid: true });
						if (result.success) {
							transcriptContent = result.transcript;
						} else {
							transcriptContent = `Transcript unavailable for ${s.name}: ${result.error ?? "Unknown error"}`;
						}
					} catch (error) {
						transcriptContent = `Failed to retrieve transcript for ${s.name} from ${s.url}. Error: ${(error as Error).message}`;
					}
				} else {
					console.error(`Could not extract youtube video ID from URL: ${s.url}`);
				}

				const { created_at, ...rest } = s;
				return {
					...rest,
					createdAt: created_at.toString(),
					transcript: transcriptContent,
				} as SourceWithTranscript;
			})
		);

		const aggregatedContent = sourcesWithTranscripts.map((s: SourceWithTranscript) => `Source: ${s.name} (${s.url})\nTranscript: ${s.transcript}`).join("\n\n");

		// Stage 2: Summarization
		const summary = await step.run("summarize-content", async () => {
			const geminiApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

			if (!geminiApiKey) {
				throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set.");
			}
			if (!aiConfig.geminiModel) {
				throw new Error("aiConfig.geminiModel is not defined.");
			}

			const model = googleAI(aiConfig.geminiModel);

			try {
				const { text } = await generateText({
					model: model,
					prompt: `Summarize the following content for a podcast episode, focusing on all key themes and interesting points. Provide a comprehensive overview, suitable for developing into a 2-minute podcast script. Ensure sufficient detail for expansion.\n\n${aggregatedContent}`,
				});
				return text;
			} catch (error) {
				console.error("Error during summarization:", error);
				throw new Error(`Failed to summarize content: ${(error as Error).message}`);
			}
		});

		// Stage 3: Script Generation
		const script = await step.run("generate-script", async () => {
			const model = googleAI(aiConfig.geminiModel);
			try {
				const { text } = await generateText({
					model: model,
					prompt: `Based on the following summary, write a podcast style script of approximately 300 words (enough for about a 2-minute podcast). Include a witty introduction, smooth transitions between topics, and a concise conclusion. Make it engaging, easy to listen to, and maintain a friendly and informative tone. **The script should only contain the spoken words without: (e.g., "Host:"), sound effects, specific audio cues, structural markers (e.g., "section 1", "ad breaks"), or timing instructions (e.g., "2 minutes").** Cover most interesting themes from the summary.\n\nSummary: ${summary}`,
				});
				return text;
			} catch (error) {
				console.error("Error during script generation:", error);
				throw new Error(`Failed to generate script: ${(error as Error).message}`);
			}
		});

		// Stage 4: Audio Synthesis with Gemini TTS and Upload to Google Cloud Storage
		const publicUrl = await step.run("synthesize-audio-and-upload", async () => {
			if (aiConfig.simulateAudioSynthesis) {
				return "sample-for-simulated-tests.mp3";
			}

			try {
				const audioBuffer = await generateAudioWithGeminiTTS(script);
				const audioFileName = `podcasts/${collectionId}-${Date.now()}.wav`;

				const file = await uploadContentToBucket(audioBuffer, audioFileName);

				if (file.success) {
					return file.fileName;
				}
			} catch (error) {
				throw new Error(`Failed to generate script: ${(error as Error).message}`);
			}
		});

		// Create a new Episode linked to the UserCurationProfile
		const episode = await step.run("create-episode", async () => {
			// Use the first podcast as the main source for the episode (or adjust as needed)
			const mainPodcast = userCurationProfile.profile_podcast[0]?.podcast;
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
			});
			await prisma.userCurationProfile.update({
				where: { profile_id: collectionId },
				data: { status: "Generated" },
			});
			return episode;
		});

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
			});

			if (!userWithProfile) {
				console.error("User not found for episode notification");
				return;
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
			});

			// Send email notification if user has email notifications enabled
			if (userWithProfile.email_notifications) {
				const firstName = userWithProfile.name?.split(" ")[0] || "there";
				const episodeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/episodes/${episode.episode_id}`;

				await emailService.sendEpisodeReadyEmail(userWithProfile.user_id, userWithProfile.email, {
					userFirstName: firstName,
					episodeTitle: episode.title,
					episodeUrl,
					profileName: userCurationProfile.name,
				});
			}
		});

		if (aiConfig.simulateAudioSynthesis) {
			// DO NOT CHANGE THIS RETURN STATEMENT
			return {
				success: true,
				collectionId,
				audioUrl: "public/sample-for-simulated-tests.mp3",
				isSimulated: aiConfig.simulateAudioSynthesis,
			};
		}
		return {
			success: true,
			collectionId,
			audioUrl: publicUrl,
			isSimulated: aiConfig.simulateAudioSynthesis,
		};
	}
);

// Admin Bundle Episode Generation Function with Gemini TTS
export const generateAdminBundleEpisodeWithGeminiTTS = inngest.createFunction(
	{
		id: "generate-admin-bundle-episode-gemini-tts-workflow",
		name: "Generate Admin Bundle Episode with Gemini TTS Workflow",
		retries: 1,
	},
	{
		event: "podcast/admin-generate-gemini-tts.requested",
	},
	async ({ event, step }) => {
		const { adminCurationProfile, bundleId, podcastId, episodeTitle, episodeDescription } = event.data;

		// Stage 1: Content Aggregation
		const sourcesWithTranscripts: AdminSourceWithTranscript[] = await Promise.all(
			adminCurationProfile.sources.map(async (s: AdminSourceData) => {
				// Extract video ID from YouTube URL
				const videoIdMatch = s.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
				const videoId = videoIdMatch ? videoIdMatch[1] : null;

				let transcriptContent = `No transcript available for ${s.name} from ${s.url}.`;

				if (videoId) {
					try {
						const result = await getTranscriptOrchestrated({ url: s.url, allowPaid: true });
						if (result.success) {
							transcriptContent = result.transcript;
						} else {
							transcriptContent = `Transcript unavailable for ${s.name}: ${result.error ?? "Unknown error"}`;
						}
					} catch (error) {
						transcriptContent = `Failed to retrieve transcript for ${s.name} from ${s.url}. Error: ${(error as Error).message}`;
					}
				} else {
					console.error(`Could not extract youtube video ID from URL: ${s.url}`);
				}

				return {
					id: s.id,
					name: s.name,
					url: s.url,
					imageUrl: s.imageUrl,
					createdAt: s.createdAt,
					transcript: transcriptContent,
				};
			})
		);

		const aggregatedContent = sourcesWithTranscripts.map((s: AdminSourceWithTranscript) => `Source: ${s.name} (${s.url})\nTranscript: ${s.transcript}`).join("\n\n");

		// Stage 2: Summarization
		const summary = await step.run("summarize-content", async () => {
			const geminiApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

			if (!geminiApiKey) {
				throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set.");
			}
			if (!aiConfig.geminiModel) {
				throw new Error("aiConfig.geminiModel is not defined.");
			}

			const model = googleAI(aiConfig.geminiModel);

			try {
				const { text } = await generateText({
					model: model,
					prompt: `Summarize the following content for a podcast episode, focusing on all key themes and interesting points. Provide a comprehensive overview, suitable for developing into a 2-minute podcast script. Ensure sufficient detail for expansion.\n\n${aggregatedContent}`,
				});
				return text;
			} catch (error) {
				console.error("Error during summarization:", error);
				throw new Error(`Failed to summarize content: ${(error as Error).message}`);
			}
		});

		// Stage 3: Script Generation
		const script = await step.run("generate-script", async () => {
			const model = googleAI(aiConfig.geminiModel);
			try {
				const { text } = await generateText({
					model: model,
					prompt: `Based on the following summary, write a podcast style script of approximately 50 words (enough for about a 10 seconds podcast). Include a witty introduction of the summary. **The script should only contain the spoken words without: (e.g., "Host:"), sound effects, specific audio cues, structural markers (e.g., "section 1", "ad breaks"), or timing instructions (e.g., "2 minutes").** Cover most interesting themes from the summary.\n\nSummary: ${summary}`,
				});
				return text;
			} catch (error) {
				console.error("Error during script generation:", error);
				throw new Error(`Failed to generate script: ${(error as Error).message}`);
			}
		});

		// Stage 4: Audio Synthesis with Gemini TTS and Upload to Google Cloud Storage
		const publicUrl = await step.run("synthesize-audio-and-upload", async () => {
			if (aiConfig.simulateAudioSynthesis) {
				return "admin-sample-for-simulated-tests.mp3";
			}

			try {
				const audioBuffer = await generateAudioWithGeminiTTS(script);
				const audioFileName = `podcasts/${bundleId}-${Date.now()}.wav`;

				const file = await uploadContentToBucket(audioBuffer, audioFileName);

				if (file.success) {
					return file.fileName;
				}
			} catch (error) {
				console.error("Error during admin audio synthesis/upload:", (error as Error).message);
				throw new Error(`Failed to generate admin episode audio: ${(error as Error).message}`);
			}
		});

		// Create a new CuratedBundleEpisode
		const episode = await step.run("create-bundle-episode", async () => {
			const currentWeek = new Date();
			currentWeek.setHours(0, 0, 0, 0); // Start of day

			// Get the bundle with its associated podcasts to use a valid podcast ID
			const bundleWithPodcasts = await prisma.bundle.findUnique({
				where: { bundle_id: bundleId },
				include: {
					bundle_podcast: {
						include: { podcast: true },
					},
				},
			});

			if (!bundleWithPodcasts || bundleWithPodcasts.bundle_podcast.length === 0) {
				throw new Error(`Bundle ${bundleId} not found or has no associated podcasts`);
			}

			// Use the explicitly selected podcast from the admin UI and ensure it belongs to the bundle
			const membership = bundleWithPodcasts.bundle_podcast.find(bp => bp.podcast_id === podcastId);
			if (!membership) {
				throw new Error(`Podcast ${podcastId} is not a member of bundle ${bundleId}`);
			}
			const selectedPodcast = membership.podcast;

			const txResults = await prisma.$transaction([
				// Avoid creating membership here; assume existing membership as validated above
				prisma.episode.create({
					data: {
						episode_id: randomUUID(),
						title: episodeTitle,
						description: episodeDescription || script,
						audio_url: `https://storage.cloud.google.com/${ensureBucketName()}/${publicUrl}`,
						image_url: adminCurationProfile.image_url || bundleWithPodcasts.image_url || null,
						published_at: new Date(),
						week_nr: currentWeek,
						bundle_id: bundleId, // diagnostics only; reads remain membership-based
						podcast_id: selectedPodcast.podcast_id,
					},
				}),
			]);
			return txResults[txResults.length - 1] as Awaited<ReturnType<typeof prisma.episode.create>>;
		});

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
			});

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
				});

				// Send email notification if enabled
				if (profile.user.email_notifications) {
					const firstName = profile.user.name?.split(" ")[0] || "there";
					const episodeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/episodes/${episode.episode_id}`;

					await emailService.sendEpisodeReadyEmail(profile.user.user_id, profile.user.email, {
						userFirstName: firstName,
						episodeTitle: episode.title,
						episodeUrl,
						profileName: profile.name,
					});
				}
			}

			console.log(`Sent notifications to ${usersWithBundle.length} users for bundle episode: ${episode.title}`);
		});

		if (aiConfig.simulateAudioSynthesis) {
			return {
				success: true,
				bundleId,
				audioUrl: "public/admin-sample-for-simulated-tests.mp3",
				isSimulated: aiConfig.simulateAudioSynthesis,
				title: episodeTitle,
			};
		}
		return {
			success: true,
			bundleId,
			audioUrl: `https://storage.cloud.google.com/${ensureBucketName()}/${publicUrl}`,
			isSimulated: aiConfig.simulateAudioSynthesis,
			title: episodeTitle,
		};
	}
);
