import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { GoogleGenAI } from "@google/genai";
import { generateText } from "ai";
import mime from "mime";

// TODO: Consider switching to Google Cloud Text-to-Speech API for stable TTS

import { extractUserEpisodeDuration } from "@/app/(protected)/admin/audio-duration/duration-extractor";
import { aiConfig } from "@/config/ai";
import { extractAudioDuration } from "@/lib/audio-metadata";
import emailService from "@/lib/email-service";
import { ensureBucketName, getStorageUploader } from "@/lib/gcs";
import { prisma } from "@/lib/prisma";
import { inngest } from "./client";

// All uploads use the primary bucket defined by GOOGLE_CLOUD_STORAGE_BUCKET_NAME

async function uploadContentToBucket(data: Buffer, destinationFileName: string) {
	try {
		const uploader = getStorageUploader();
		const bucketName = ensureBucketName();
		console.log(`Uploading to bucket: ${bucketName}`);

		const [exists] = await uploader.bucket(bucketName).exists();

		if (!exists) {
			console.error("ERROR: Bucket does not exist:", bucketName);
			throw new Error(`Bucket ${bucketName} does not exist`);
		}

		console.log("Bucket exists, uploading file…");
		await uploader.bucket(bucketName).file(destinationFileName).save(data);
		console.log("File uploaded successfully");
		// Return the GCS URI
		return `gs://${bucketName}/${destinationFileName}`;
	} catch (error) {
		console.error("Failed to upload content:", error);
		// Avoid leaking internal error details
		throw new Error("Failed to upload content");
	}
}

// TODO: Define types for event payload
const googleAI = createGoogleGenerativeAI({
	apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Gemini TTS configuration - Single speaker for faster processing
const geminiTTSConfig = {
	temperature: 1,
	responseModalities: ["audio"],
	speechConfig: {
		voiceConfig: {
			prebuiltVoiceConfig: {
				voiceName: "Enceladus",
			},
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
	// Try both env variable names for compatibility
	const geminiApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

	if (!geminiApiKey) {
		throw new Error("GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY is not set.");
	}

	console.log("🎤 Starting audio generation with Zephyr voice...");
	console.log(`📝 Script length: ${script.length} characters`);

	// Dynamic script length limits based on episode type
	const maxLength = aiConfig.useShortEpisodes ? 1000 : 4000;
	const episodeType = aiConfig.useShortEpisodes ? "1-minute" : "3-minute";

	if (script.length > maxLength) {
		console.log(`⚠️ Script too long for ${episodeType} episode (${script.length} chars), truncating to ${maxLength} chars`);
		script = `${script.substring(0, maxLength)}...`;
	}

	const ai = new GoogleGenAI({
		apiKey: geminiApiKey,
	});

	const model = "gemini-2.5-flash-preview-tts"; // Using faster Flash TTS model
	console.log(`🤖 Using TTS model: ${model}`);
	const contents = [
		{
			role: "user",
			parts: [
				{
					text: `Please read the following script aloud in a clear, engaging podcast style:\n\n${script}`,
				},
			],
		},
	];

	console.log("📡 Sending request to Gemini TTS API...");
	const response = await ai.models.generateContentStream({
		model,
		config: geminiTTSConfig,
		contents,
	});

	console.log("📨 Response received, processing stream...");
	let audioBuffer: Buffer | null = null;
	let chunkCount = 0;

	for await (const chunk of response) {
		chunkCount++;
		console.log(`📦 Processing chunk ${chunkCount}...`);

		// biome-ignore lint/complexity/useOptionalChain: <fix later>
		if (!(chunk.candidates && chunk.candidates[0].content && chunk.candidates[0].content.parts)) {
			console.log("⚠️ Chunk missing expected structure");
			continue;
		}
		if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
			console.log("🎵 Found audio data in chunk!");
			const inlineData = chunk.candidates[0].content.parts[0].inlineData;
			let fileExtension = mime.getExtension(inlineData.mimeType || "");
			let buffer = Buffer.from(inlineData.data || "", "base64");

			if (!fileExtension) {
				fileExtension = "wav";
				buffer = convertToWav(inlineData.data || "", inlineData.mimeType || "");
			}

			audioBuffer = buffer;
			console.log(`✅ Audio buffer created: ${buffer.length} bytes`);
			break; // Take the first audio chunk
		} else {
			// Log any text responses (for debugging)
			if (chunk.text) {
				console.log("📝 TTS text response:", chunk.text);
			}
		}
	}

	if (!audioBuffer) {
		throw new Error("Failed to generate audio with Gemini TTS");
	}

	console.log("✅ Audio generation completed!");
	return audioBuffer;
}

type JsonBuffer = { type: "Buffer"; data: number[] };

function isJsonBuffer(value: unknown): value is JsonBuffer {
	return typeof value === "object" && value !== null && (value as { type?: unknown }).type === "Buffer" && Array.isArray((value as { data?: unknown }).data);
}

function _ensureNodeBuffer(value: unknown): Buffer {
	if (Buffer.isBuffer(value)) return value;
	if (isJsonBuffer(value)) return Buffer.from(value.data);
	throw new Error("Invalid audio buffer returned from TTS step");
}

export const generateUserEpisode = inngest.createFunction(
	{
		id: "generate-user-episode-workflow",
		name: "Generate User Episode Workflow",
		retries: 2,
		onFailure: async ({ error: _error, event }) => {
			const { userEpisodeId } = (event as unknown as { data: { userEpisodeId: string } }).data;
			await prisma.userEpisode.update({
				where: { episode_id: userEpisodeId },
				data: { status: "FAILED" },
			});

			// Best-effort in-app notification on failure
			try {
				const episode = await prisma.userEpisode.findUnique({
					where: { episode_id: userEpisodeId },
					select: { episode_title: true, user_id: true },
				});
				if (episode) {
					const user = await prisma.user.findUnique({
						where: { user_id: episode.user_id },
						select: { in_app_notifications: true },
					});
					if (user?.in_app_notifications) {
						await prisma.notification.create({
							data: {
								user_id: episode.user_id,
								type: "episode_failed",
								message: `We couldn't generate your episode "${episode.episode_title}". Please try again.`,
							},
						});
					}
				}
			} catch (notifyError) {
				console.error("[USER_EPISODE_FAILED_NOTIFY]", notifyError);
			}
		},
	},
	{
		event: "user.episode.generate.requested",
	},
	async ({ event, step }) => {
		const { userEpisodeId } = event.data as { userEpisodeId: string };

		await step.run("update-status-to-processing", async () => {
			return await prisma.userEpisode.update({
				where: { episode_id: userEpisodeId },
				data: { status: "PROCESSING" },
			});
		});

		// Step 1: Get Transcript from Database
		const transcript = await step.run("get-transcript", async () => {
			const episode = await prisma.userEpisode.findUnique({
				where: { episode_id: userEpisodeId },
			});

			if (!episode) {
				throw new Error(`UserEpisode with ID ${userEpisodeId} not found.`);
			}

			if (!episode.transcript) {
				throw new Error(`No transcript found for episode ${userEpisodeId}`);
			}

			return episode.transcript;
		});

		// Step 2: Summarize Transcript
		const summary = await step.run("summarize-transcript", async () => {
			const model = googleAI(aiConfig.geminiModel);
			try {
				// Dynamic episode length based on config flag
				const episodeConfig = aiConfig.useShortEpisodes
					? {
							words: "200 - 300 words",
							duration: "about 3 minute of audio",
							description: "testing version",
						}
					: {
							words: "500-600 words",
							duration: "about 3-4 minutes of audio",
							description: "production version",
						};

				console.log(`📝 Generating ${episodeConfig.description}: ${episodeConfig.words}`);

				const { text } = await generateText({
					model: model,
					prompt: `Create an engaging podcast script of approximately ${episodeConfig.words} (${episodeConfig.duration}) based on the following transcript. Write it as a single narrator presenting the content in an engaging, conversational podcast style.

The script should include:
- An engaging introduction that hooks the listener
- Clear narrative structure with smooth transitions
- Key insights and takeaways from the transcript
- Interesting examples and explanations
- A compelling conclusion with actionable advice or thought-provoking questions

Write in a warm, conversational tone as if speaking directly to the listener. Use phrases like "you might wonder," "here's what's fascinating," "let's dive into," etc. to maintain engagement.

Transcript: ${transcript}`,
				});

				await prisma.userEpisode.update({
					where: { episode_id: userEpisodeId },
					data: { summary: text },
				});

				return text;
			} catch (error) {
				console.error("Error during summarization:", error);
				throw new Error(`Failed to summarize content: ${(error as Error).message}`);
			}
		});

		// Step 3: Convert to Audio and Upload to GCS (combined to avoid large data transfer)
		const { gcsAudioUrl, durationSeconds } = await step.run("convert-to-audio-and-upload", async () => {
			console.log("🎤 Generating audio and uploading directly to GCS...");
			const audioBuffer = await generateAudioWithGeminiTTS(summary);
			const fileName = `user-episodes/${userEpisodeId}-${Date.now()}.wav`;
			console.log(`📁 Uploading ${audioBuffer.length} bytes to GCS...`);

			// Extract duration from the generated audio
			const duration = extractAudioDuration(audioBuffer, "audio/wav");
			console.log(`🎵 Extracted audio duration: ${duration ? `${duration}s` : "unknown"}`);

			const gcsUrl = await uploadContentToBucket(audioBuffer, fileName);
			return { gcsAudioUrl: gcsUrl, durationSeconds: duration };
		});

		// Step 4: Finalize Episode
		await step.run("finalize-episode", async () => {
			return await prisma.userEpisode.update({
				where: { episode_id: userEpisodeId },
				data: {
					gcs_audio_url: gcsAudioUrl,
					duration_seconds: durationSeconds,
					status: "COMPLETED",
				},
			});
		});

		// Step 5: Extract duration (fallback if initial extraction failed)
		await step.run("extract-duration", async () => {
			console.log(`[DURATION_EXTRACTION] Starting duration extraction for episode ${userEpisodeId}`);
			const result = await extractUserEpisodeDuration(userEpisodeId);
			if (result.success) {
				console.log(`[DURATION_EXTRACTION] Successfully extracted duration: ${result.duration}s`);
			} else {
				console.warn(`[DURATION_EXTRACTION] Failed to extract duration: ${result.error}`);
			}
			return result;
		});

		// Step 6: Episode Usage is now tracked by counting UserEpisode records
		// No need to update subscription table - usage is calculated dynamically

		// Step 7: Notify user (in-app + email)
		await step.run("notify-user", async () => {
			const episode = await prisma.userEpisode.findUnique({
				where: { episode_id: userEpisodeId },
				select: { episode_id: true, episode_title: true, user_id: true },
			});

			if (!episode) return;

			const [user, profile] = await Promise.all([
				prisma.user.findUnique({
					where: { user_id: episode.user_id },
					select: { email: true, name: true, in_app_notifications: true },
				}),
				prisma.userCurationProfile.findFirst({
					where: { user_id: episode.user_id, is_active: true },
					select: { name: true },
				}),
			]);

			if (user?.in_app_notifications) {
				await prisma.notification.create({
					data: {
						user_id: episode.user_id,
						type: "episode_ready",
						message: `Your episode "${episode.episode_title}" is ready to listen.`,
					},
				});
			}

			if (user?.email) {
				const userFirstName = (user.name || "").trim().split(" ")[0] || "there";
				const profileName = profile?.name ?? "Your personalized feed";
				const baseUrl = process.env.EMAIL_LINK_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "";
				const episodeUrl = `${baseUrl}/my-episodes`;

				await emailService.sendEpisodeReadyEmail(episode.user_id, user.email, {
					userFirstName,
					episodeTitle: episode.episode_title,
					episodeUrl,
					profileName,
				});
			}
		});

		return {
			message: "Episode generation workflow completed",
			userEpisodeId,
		};
	}
);
