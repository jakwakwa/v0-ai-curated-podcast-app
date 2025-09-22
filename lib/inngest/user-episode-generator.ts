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

		const [exists] = await uploader.bucket(bucketName).exists();

		if (!exists) {
			console.error("ERROR: Bucket does not exist:", bucketName);
			throw new Error(`Bucket ${bucketName} does not exist`);
		}

		await uploader.bucket(bucketName).file(destinationFileName).save(data);
		// Return the GCS URI
		return `gs://${bucketName}/${destinationFileName}`;
	} catch (_error) {
		// Avoid leaking internal error details in logs
		console.error("Failed to upload content");
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

function isWav(buffer: Buffer): boolean {
	return buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WAVE";
}

function extractWavOptions(buffer: Buffer): WavConversionOptions {
	const numChannels = buffer.readUInt16LE(22);
	const sampleRate = buffer.readUInt32LE(24);
	const bitsPerSample = buffer.readUInt16LE(34);
	return { numChannels, sampleRate, bitsPerSample };
}

function getPcmData(buffer: Buffer): Buffer {
	return buffer.subarray(44);
}

function _concatenateWavs(buffers: Buffer[]): Buffer {
	if (buffers.length === 0) throw new Error("No buffers to concatenate");
	const first = buffers[0];
	if (!isWav(first)) throw new Error("First buffer is not a WAV file");
	const options = extractWavOptions(first);
	const pcmParts = buffers.map(buf => (isWav(buf) ? getPcmData(buf) : buf));
	const totalPcmLength = pcmParts.reduce((acc, b) => acc + b.length, 0);
	const header = createWavHeader(totalPcmLength, options);
	return Buffer.concat([header, ...pcmParts]);
}

function _splitScriptIntoChunks(text: string, approxWordsPerChunk = 130): string[] {
	const words = text.split(/\s+/).filter(Boolean);
	const chunks: string[] = [];
	let current: string[] = [];
	for (const w of words) {
		current.push(w);
		if (current.length >= approxWordsPerChunk) {
			chunks.push(current.join(" "));
			current = [];
		}
	}
	if (current.length) chunks.push(current.join(" "));
	return chunks;
}
async function generateAudioWithGeminiTTS(script: string): Promise<Buffer> {
	// Try both env variable names for compatibility
	const geminiApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

	if (!geminiApiKey) {
		throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set.");
	}

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

	const model = process.env.GEMINI_TTS_MODEL || "gemini-2.5-flash-preview-tts"; // Using TTS model for speech synthesis
	const contents = [
		{
			role: "user",
			parts: [
				{
					text: `Please read the following podcast script aloud in a clear, engaging style. Read only the spoken words - ignore any sound effects, stage directions, or non-spoken elements:\n\n${script}`,
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
	let _chunkCount = 0;

	for await (const chunk of response) {
		_chunkCount++;

		if (!chunk.candidates?.[0]?.content?.parts) {
			console.log("⚠️ Chunk missing expected structure");
			continue;
		}
		if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
			const inlineData = chunk.candidates[0].content.parts[0].inlineData;
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
						select: { in_app_notifications: true, email: true, name: true },
					});
					if (user?.in_app_notifications) {
						await prisma.notification.create({
							data: {
								user_id: episode.user_id,
								type: "episode_failed",
								message: `We're sorry — we hit a technical issue while generating your episode "${episode.episode_title}". Please try again later. If it keeps happening, contact support.`,
							},
						});
					}
					if (user?.email) {
						const userFirstName = (user.name || "").trim().split(" ")[0] || "there";
						await emailService.sendEpisodeFailedEmail(episode.user_id, user.email, {
							userFirstName,
							episodeTitle: episode.episode_title,
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

		// Step 2: Generate TRUE neutral summary (bullets + recap)
		const summary = await step.run("generate-summary", async () => {
			const modelName = process.env.GEMINI_GENAI_MODEL || "gemini-2.0-flash-lite";
			const model = googleAI(modelName);
			try {
				const { text } = await generateText({
					model,
					prompt: `Task: Produce a faithful, objective summary of this content's key ideas.\n\nConstraints:\n- Do NOT imitate the original speakers or style.\n- Do NOT write a script or dialogue.\n- No stage directions, no timestamps.\n- Focus on core concepts, arguments, evidence, and takeaways.\n\nFormat:\n1) 5–10 bullet points of key highlights (short, punchy).\n2) A 2–3 sentence narrative recap synthesizing the big picture.\n\nTranscript:\n${transcript}`,
				});

				await prisma.userEpisode.update({
					where: { episode_id: userEpisodeId },
					data: { summary: text },
				});

				return text;
			} catch (error) {
				console.error("Error during summarization");
				throw new Error(`Failed to summarize content: ${(error as Error).message}`);
			}
		});

		// Step 3: Generate Podslice-hosted script (commentary over summary)
		const script = await step.run("generate-script", async () => {
			const modelName2 = process.env.GEMINI_GENAI_MODEL || "gemini-2.0-flash-lite";
			const model2 = googleAI(modelName2);
			const targetMinutes = Math.max(3, Number(process.env.EPISODE_TARGET_MINUTES || 1));
			const minWords = Math.floor(targetMinutes * 140);
			const maxWords = Math.floor(targetMinutes * 180);
			const { text } = await generateText({
				model: model2,
				prompt: `Task: Based on the SUMMARY below, write a ${minWords}-${maxWords} word (about ${targetMinutes} minutes) single-narrator podcast segment where a Podslice host explains the highlights to listeners.\n\nIdentity & framing:\n- The speaker is a Podslice host summarizing someone else's content.\n- Do NOT reenact or impersonate the original speakers.\n- Present key takeaways, context, and insights.\n\nBrand opener (must be the first line, exactly):\n"Feeling lost in the noise? This summary is brought to you by Podslice. We filter out the fluff, the filler, and the drawn-out discussions, leaving you with pure, actionable knowledge. In a world full of chatter, we help you find the insight."\n\nConstraints:\n- No stage directions, no timestamps, no sound effects.\n- Spoken words only.\n- Natural, engaging tone.\n- Avoid claiming ownership of original content; refer to it as “the video” or “the episode.”\n\nStructure:\n- Hook that frames this as a Podslice summary.\n- Smooth transitions between highlight clusters.\n- Clear, concise wrap-up.\n\nSUMMARY:\n${summary}`,
			});
			return text;
		});

		// Step 4: Convert to Audio (chunked) and Upload to GCS
		const { gcsAudioUrl, durationSeconds } = await step.run("convert-to-audio-and-upload", async () => {
			const parts = _splitScriptIntoChunks(script, 130);
			const wavChunks: Buffer[] = [];
			for (const part of parts) {
				const buf = await generateAudioWithGeminiTTS(part);
				wavChunks.push(buf);
			}
			const finalWav = _concatenateWavs(wavChunks);
			const fileName = `user-episodes/${userEpisodeId}-${Date.now()}.wav`;
			const duration = extractAudioDuration(finalWav, "audio/wav");
			const gcsUrl = await uploadContentToBucket(finalWav, fileName);
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
			const result = await extractUserEpisodeDuration(userEpisodeId);
			if (!result.success) {
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
						message: `Your generated episode "${episode.episode_title}" is ready.`,
					},
				});
			}

			if (user?.email) {
				const userFirstName = (user.name || "").trim().split(" ")[0] || "there";
				const profileName = profile?.name ?? "Your personalized feed";
				const baseUrl = process.env.EMAIL_LINK_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "";
				const episodeUrl = `${baseUrl}/my-episodes/${encodeURIComponent(userEpisodeId)}`;

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
