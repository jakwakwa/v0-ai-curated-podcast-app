import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { GoogleGenAI } from "@google/genai";
import { generateText } from "ai";
import mime from "mime";
import { z } from "zod";
import { extractUserEpisodeDuration } from "@/app/(protected)/admin/audio-duration/duration-extractor";
import { aiConfig } from "@/config/ai";
import emailService from "@/lib/email-service";
import { ensureBucketName, getStorageUploader } from "@/lib/gcs";
import { prisma } from "@/lib/prisma";
import { inngest } from "./client";

// Utilities and helpers copied/adapted from single-speaker workflow
async function uploadContentToBucket(data: Buffer, destinationFileName: string) {
	try {
		const uploader = getStorageUploader();
		const bucketName = ensureBucketName();
		const [exists] = await uploader.bucket(bucketName).exists();
		if (!exists) {
			throw new Error(`Bucket ${bucketName} does not exist`);
		}
		await uploader.bucket(bucketName).file(destinationFileName).save(data);
		return `gs://${bucketName}/${destinationFileName}`;
	} catch (error) {
		console.error("Failed to upload content:", error);
		throw new Error("Failed to upload content");
	}
}

const googleAI = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });

const DEFAULT_TTS_MODEL = "gemini-2.5-flash-preview-tts";

interface WavConversionOptions {
	numChannels: number;
	sampleRate: number;
	bitsPerSample: number;
}

function parseMimeType(mimeType: string) {
	const [fileType, ...params] = mimeType.split(";").map(s => s.trim());
	const [_, format] = fileType.split("/");
	const options: Partial<WavConversionOptions> = { numChannels: 1 };
	if (format?.startsWith("L")) {
		const bits = parseInt(format.slice(1), 10);
		if (!Number.isNaN(bits)) options.bitsPerSample = bits;
	}
	for (const param of params) {
		const [key, value] = param.split("=").map(s => s.trim());
		if (key === "rate") options.sampleRate = parseInt(value, 10);
	}
	return options as WavConversionOptions;
}

function createWavHeader(dataLength: number, options: WavConversionOptions) {
	const { numChannels, sampleRate, bitsPerSample } = options;
	const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
	const blockAlign = (numChannels * bitsPerSample) / 8;
	const buffer = Buffer.alloc(44);
	buffer.write("RIFF", 0);
	buffer.writeUInt32LE(36 + dataLength, 4);
	buffer.write("WAVE", 8);
	buffer.write("fmt ", 12);
	buffer.writeUInt32LE(16, 16);
	buffer.writeUInt16LE(1, 20);
	buffer.writeUInt16LE(numChannels, 22);
	buffer.writeUInt32LE(sampleRate, 24);
	buffer.writeUInt32LE(byteRate, 28);
	buffer.writeUInt16LE(blockAlign, 32);
	buffer.writeUInt16LE(bitsPerSample, 34);
	buffer.write("data", 36);
	buffer.writeUInt32LE(dataLength, 40);
	return buffer;
}

function convertToWav(rawBase64: string, mimeType: string) {
	const options = parseMimeType(mimeType);
	const wavHeader = createWavHeader(Buffer.from(rawBase64, "base64").length, options);
	const buffer = Buffer.from(rawBase64, "base64");
	return Buffer.concat([wavHeader, buffer]);
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

function concatenateWavs(buffers: Buffer[]): Buffer {
	if (buffers.length === 0) throw new Error("No buffers to concatenate");
	const first = buffers[0];
	if (!isWav(first)) throw new Error("First buffer is not a WAV file");
	const options = extractWavOptions(first);
	const pcmParts = buffers.map(buf => (isWav(buf) ? getPcmData(buf) : buf));
	const totalPcmLength = pcmParts.reduce((acc, b) => acc + b.length, 0);
	const header = createWavHeader(totalPcmLength, options);
	return Buffer.concat([header, ...pcmParts]);
}

async function ttsWithVoice(text: string, voiceName: string, retries = 2): Promise<Buffer> {
	const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
	if (!apiKey) throw new Error("GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY is not set.");
	let lastError: unknown;
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const ai = new GoogleGenAI({ apiKey });
			const contents = [{ role: "user", parts: [{ text: `Read the following lines as ${voiceName}, in an engaging podcast style. Only speak the text.\n\n${text}` }] }];
			const response = await ai.models.generateContentStream({
				model: DEFAULT_TTS_MODEL,
				config: { temperature: 1, responseModalities: ["audio"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } } },
				contents,
			});
			for await (const chunk of response) {
				const inlineData = chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData as { data?: string; mimeType?: string } | undefined;
				if (!inlineData) continue;
				const ext = mime.getExtension(inlineData.mimeType || "");
				const buf = Buffer.from(inlineData.data || "", "base64");
				if (ext === "wav" && isWav(buf)) return buf;
				return convertToWav(inlineData.data || "", inlineData.mimeType || "audio/L16;rate=24000");
			}
			throw new Error("TTS response had no audio data");
		} catch (err) {
			lastError = err;
			if (attempt === retries) break;
			await new Promise(res => setTimeout(res, 1000 * (attempt + 1)));
		}
	}
	throw lastError instanceof Error ? lastError : new Error("Unknown TTS error");
}

type DialogueLine = { speaker: "A" | "B"; text: string };

const DialogueSchema = z.object({ speaker: z.enum(["A", "B"]), text: z.string().min(1) });

function stripMarkdownJsonFences(input: string): string {
	return input.replace(/```json\n?|\n?```/g, "").trim();
}

function coerceJsonArray(input: string): DialogueLine[] {
	const attempts: Array<() => unknown> = [() => JSON.parse(input), () => JSON.parse(input.match(/\[[\s\S]*\]/)?.[0] || "[]"), () => JSON.parse(stripMarkdownJsonFences(input))];
	for (const attempt of attempts) {
		try {
			const parsed = attempt();
			return z.array(DialogueSchema).parse(parsed);
		} catch {}
	}
	throw new Error("Failed to parse dialogue script");
}

export const generateUserEpisodeMulti = inngest.createFunction(
	{
		id: "generate-user-episode-multi-workflow",
		name: "Generate User Episode Multi-Speaker Workflow",
		retries: 2,
		onFailure: async ({ event }) => {
			const { userEpisodeId } = (event as unknown as { data: { userEpisodeId: string } }).data;
			await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { status: "FAILED" } });
			try {
				const episode = await prisma.userEpisode.findUnique({ where: { episode_id: userEpisodeId }, select: { episode_title: true, user_id: true } });
				if (episode) {
					const user = await prisma.user.findUnique({ where: { user_id: episode.user_id }, select: { in_app_notifications: true } });
					if (user?.in_app_notifications) {
						await prisma.notification.create({
							data: { user_id: episode.user_id, type: "episode_failed", message: `We couldn't generate your episode "${episode.episode_title}". Please try again.` },
						});
					}
				}
			} catch (notifyError) {
				console.error("[USER_EPISODE_FAILED_NOTIFY]", notifyError);
			}
		},
	},
	{ event: "user.episode.generate.multi.requested" },
	async ({ event, step }) => {
		const { userEpisodeId, voiceA, voiceB, useShortEpisodesOverride } = event.data as {
			userEpisodeId: string;
			voiceA: string;
			voiceB: string;
			useShortEpisodesOverride?: boolean;
		};

		await step.run("update-status-to-processing", async () => {
			return await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { status: "PROCESSING" } });
		});

		const transcript = await step.run("get-transcript", async () => {
			const episode = await prisma.userEpisode.findUnique({ where: { episode_id: userEpisodeId } });
			if (!episode) throw new Error(`UserEpisode with ID ${userEpisodeId} not found.`);
			if (!episode.transcript) throw new Error(`No transcript found for episode ${userEpisodeId}`);
			return episode.transcript;
		});

		const isShort = useShortEpisodesOverride ?? aiConfig.useShortEpisodes;

		const summary = await step.run("summarize-transcript", async () => {
			const model = googleAI(aiConfig.geminiModel);
			const episodeConfig = isShort
				? { words: "150-220 words", duration: "~1 minute", description: "testing version" }
				: { words: "550-800 words", duration: "~3-5 minutes", description: "production version" };
			const { text } = await generateText({
				model,
				prompt: `Create a concise summary in ${episodeConfig.words} (${episodeConfig.duration}) capturing the main points and narrative arc of the following transcript. Write as a neutral narrator (no dialogues), suitable to expand into a two-host podcast script.\n\nTranscript: ${transcript}`,
			});
			await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { summary: text } });
			return text;
		});

		const duetLines = await step.run("generate-duet-script", async () => {
			const model = googleAI(aiConfig.geminiModel);
			const { text } = await generateText({
				model,
				prompt: `Using the following summary, write a two-host podcast conversation between Host A and Host B. Alternate speakers naturally. Keep it ${isShort ? "short (~1 minute)" : "around 3-5 minutes"}. Do not include stage directions or timestamps.\n\nOutput ONLY valid JSON array of objects with fields: speaker ("A" or "B") and text (string). No markdown.\n\nSummary: ${summary}`,
			});
			return coerceJsonArray(text);
		});

		const gcsAudioUrl = await step.run("synthesize-multi-voice-and-upload", async () => {
			const chunks: Buffer[] = [];
			for (const line of duetLines) {
				const voice = line.speaker === "A" ? voiceA : voiceB;
				const audio = await ttsWithVoice(line.text, voice);
				chunks.push(audio);
			}
			const finalWav = concatenateWavs(chunks);
			const fileName = `user-episodes/${userEpisodeId}-duet-${Date.now()}.wav`;
			return await uploadContentToBucket(finalWav, fileName);
		});

		await step.run("finalize-episode", async () => {
			return await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { gcs_audio_url: gcsAudioUrl, status: "COMPLETED" } });
		});

		// Extract duration after episode is finalized
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

		await step.run("notify-user", async () => {
			const episode = await prisma.userEpisode.findUnique({ where: { episode_id: userEpisodeId }, select: { episode_id: true, episode_title: true, user_id: true } });
			if (!episode) return;
			const [user, profile] = await Promise.all([
				prisma.user.findUnique({ where: { user_id: episode.user_id }, select: { email: true, name: true, in_app_notifications: true } }),
				prisma.userCurationProfile.findFirst({ where: { user_id: episode.user_id, is_active: true }, select: { name: true } }),
			]);
			if (user?.in_app_notifications) {
				await prisma.notification.create({ data: { user_id: episode.user_id, type: "episode_ready", message: `Your multi-speaker episode "${episode.episode_title}" is ready to listen.` } });
			}
			if (user?.email) {
				const userFirstName = (user.name || "").trim().split(" ")[0] || "there";
				const profileName = profile?.name ?? "Your personalized feed";
				const baseUrl = process.env.EMAIL_LINK_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "";
				const episodeUrl = `${baseUrl}/my-episodes`;
				await emailService.sendEpisodeReadyEmail(episode.user_id, user.email, { userFirstName, episodeTitle: episode.episode_title, episodeUrl, profileName });
			}
		});

		return { message: "Multi-speaker episode generation completed", userEpisodeId, voiceA, voiceB };
	}
);
