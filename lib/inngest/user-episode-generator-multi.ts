import { extractUserEpisodeDuration } from "@/app/(protected)/admin/audio-duration/duration-extractor";
import { aiConfig } from "@/config/ai";
import emailService from "@/lib/email-service";
import { ensureBucketName, getStorageUploader } from "@/lib/gcs";
import { generateTtsAudio, generateText as genText } from "@/lib/genai";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
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
	} catch (_error) {
		// Avoid leaking internal error details in logs
		console.error("Failed to upload content");
		throw new Error("Failed to upload content");
	}
}

// Removed @ai-sdk/google in favor of shared genai helpers

const _DEFAULT_TTS_MODEL = process.env.GEMINI_TTS_MODEL || "gemini-2.5-flash-preview-tts";

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

function _convertToWav(rawBase64: string, mimeType: string) {
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

async function ttsWithVoice(text: string, voiceName: string): Promise<Buffer> {
	// Leverage shared helper; voiceName selection via content prompt for now
	return generateTtsAudio(
		`Read the following lines as ${voiceName}, in an engaging podcast style. Read only the spoken words - ignore any sound effects, stage directions, or non-spoken elements.\n\n${text}`,
		{ voiceName }
	);
}

type DialogueLine = { speaker: "A" | "B"; text: string };

const DialogueSchema = z.object({
	speaker: z.enum(["A", "B"]),
	text: z.string().min(1),
});

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
			await prisma.userEpisode.update({
				where: { episode_id: userEpisodeId },
				data: { status: "FAILED" },
			});
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
	{ event: "user.episode.generate.multi.requested" },
	async ({ event, step }) => {
		const { userEpisodeId, voiceA, voiceB, useShortEpisodesOverride } = event.data as {
			userEpisodeId: string;
			voiceA: string;
			voiceB: string;
			useShortEpisodesOverride?: boolean;
		};

		await step.run("update-status-to-processing", async () => {
			return await prisma.userEpisode.update({
				where: { episode_id: userEpisodeId },
				data: { status: "PROCESSING" },
			});
		});

		const transcript = await step.run("get-transcript", async () => {
			const episode = await prisma.userEpisode.findUnique({
				where: { episode_id: userEpisodeId },
			});
			if (!episode) throw new Error(`UserEpisode with ID ${userEpisodeId} not found.`);
			if (!episode.transcript) throw new Error(`No transcript found for episode ${userEpisodeId}`);
			return episode.transcript;
		});

		const isShort = useShortEpisodesOverride ?? aiConfig.useShortEpisodes;

		const summary = await step.run("generate-summary", async () => {
			const modelName = process.env.GEMINI_GENAI_MODEL || "gemini-2.0-flash-lite";
			const text = await genText(
				modelName,
				`Task: Produce a faithful, objective summary of this content's key ideas.\n\nConstraints:\n- Do NOT imitate the original speakers or style.\n- Do NOT write a script or dialogue.\n- No stage directions, no timestamps.\n- Focus on core concepts, arguments, evidence, and takeaways.\n\nFormat:\n1) 5–10 bullet points of key highlights (short, punchy).\n2) A 2–3 sentence narrative recap synthesizing the big picture.\n\nTranscript:\n${transcript}`
			);
			await prisma.userEpisode.update({
				where: { episode_id: userEpisodeId },
				data: { summary: text },
			});
			return text;
		});

		const duetLines = await step.run("generate-duet-script", async () => {
			const modelName2 = process.env.GEMINI_GENAI_MODEL || "gemini-2.0-flash-lite";
			const text = await genText(
				modelName2,
				`Task: Based on the SUMMARY below, write a two-host podcast conversation where Podslice hosts A and B explain the highlights to listeners. Alternate speakers naturally. Keep it ${isShort ? "short (~1 minute)" : "around 3-5 minutes)"}.\n\nIdentity & framing:\n- Hosts are from Podslice and are commenting on someone else's content.\n- They do NOT reenact or impersonate the original speakers.\n- They present key takeaways, context, and insights.\n\nBrand opener (must be the first line, exactly, spoken by A):\n"Feeling lost in the noise? This summary is brought to you by Podslice. We filter out the fluff, the filler, and the drawn-out discussions, leaving you with pure, actionable knowledge. In a world full of chatter, we help you find the insight."\n\nConstraints:\n- No stage directions, no timestamps, no sound effects.\n- Spoken dialogue only.\n- Natural, engaging tone.\n- Avoid claiming ownership of original content; refer to it as “the video” or “the episode.”\n\nOutput ONLY valid JSON array of objects with fields: speaker ("A" or "B") and text (string). No markdown.\n\nSUMMARY:\n${summary}`
			);
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
			return await prisma.userEpisode.update({
				where: { episode_id: userEpisodeId },
				data: { gcs_audio_url: gcsAudioUrl, status: "COMPLETED" },
			});
		});

		// Extract duration after episode is finalized
		await step.run("extract-duration", async () => {
			const result = await extractUserEpisodeDuration(userEpisodeId);
			if (!result.success) {
				console.warn(`[DURATION_EXTRACTION] Failed to extract duration: ${result.error}`);
			}
			return result;
		});

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
						message: `Your multi-speaker episode "${episode.episode_title}" is ready to listen.`,
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
			message: "Multi-speaker episode generation completed",
			userEpisodeId,
			voiceA,
			voiceB,
		};
	}
);
