/**
 * TTS Chunk Worker for processing individual text segments
 * Part of the Fan-Out/Fan-In pattern for long TTS generation
 */

import { GoogleGenAI } from "@google/genai";
import mime from "mime";
import { z } from "zod";
import { ensureBucketName, getStorageUploader } from "@/lib/gcs";
import { inngest } from "./client";

// TTS configuration
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

async function uploadContentToBucket(data: Buffer, destinationFileName: string): Promise<string> {
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

async function ttsWithVoice(text: string, voiceName: string, retries = 2): Promise<Buffer> {
	const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
	if (!apiKey) throw new Error("GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY is not set.");
	
	let lastError: unknown;
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const ai = new GoogleGenAI({ apiKey });
			const contents = [{ 
				role: "user", 
				parts: [{ 
					text: `Read the following lines as ${voiceName}, in an engaging podcast style. Only speak the text.\n\n${text}` 
				}] 
			}];
			
			const response = await ai.models.generateContentStream({
				model: DEFAULT_TTS_MODEL,
				config: { 
					temperature: 1, 
					responseModalities: ["audio"], 
					speechConfig: { 
						voiceConfig: { 
							prebuiltVoiceConfig: { voiceName } 
						} 
					} 
				},
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

// Schema for TTS chunk events
const TTSChunkRequestSchema = z.object({
	userEpisodeId: z.string(),
	chunkIndex: z.number(),
	totalChunks: z.number(),
	text: z.string(),
	voiceName: z.string(),
	jobId: z.string(),
	// Multi-speaker support
	voiceA: z.string().optional(),
	voiceB: z.string().optional(),
	dialogueLines: z.array(z.object({
		speaker: z.enum(["A", "B"]),
		text: z.string(),
	})).optional(),
});

export const ttsChunkWorker = inngest.createFunction(
	{
		id: "tts-chunk-worker",
		name: "TTS Chunk Worker",
		retries: 2,
	},
	{ event: "tts.chunk.generate" },
	async ({ event, step }) => {
		const { userEpisodeId, chunkIndex, totalChunks, text, voiceName, jobId, voiceA, voiceB, dialogueLines } = TTSChunkRequestSchema.parse(event.data);

		await step.run("log-start", async () => {
			const isMultiSpeaker = dialogueLines && dialogueLines.length > 0;
			console.log(`[TTS_CHUNK] Processing chunk ${chunkIndex + 1}/${totalChunks} for episode ${userEpisodeId} (${isMultiSpeaker ? 'multi-speaker' : 'single-speaker'})`);
		});

		try {
			// Generate audio for this text chunk
			const audioBuffer = await step.run("generate-audio", async () => {
				// Check if this is a multi-speaker chunk
				if (dialogueLines && dialogueLines.length > 0 && voiceA && voiceB) {
					// Multi-speaker processing
					const chunks: Buffer[] = [];
					for (const line of dialogueLines) {
						const voice = line.speaker === "A" ? voiceA : voiceB;
						const audio = await ttsWithVoice(line.text, voice);
						chunks.push(audio);
					}
					
					// Concatenate the chunks for this dialogue segment
					return concatenateWavs(chunks);
				} else {
					// Single-speaker processing
					return await ttsWithVoice(text, voiceName);
				}
			});

			// Upload to GCS
			const gcsUrl = await step.run("upload-audio", async () => {
				const fileName = `user-episodes/${userEpisodeId}/chunks/chunk-${chunkIndex}-${Date.now()}.wav`;
				// Ensure audioBuffer is a proper Buffer (Inngest might serialize/deserialize it)
				let buffer: Buffer;
				if (Buffer.isBuffer(audioBuffer)) {
					buffer = audioBuffer;
				} else if (audioBuffer && typeof audioBuffer === 'object' && 'type' in audioBuffer && audioBuffer.type === 'Buffer' && Array.isArray(audioBuffer.data)) {
					// Handle serialized Buffer from Inngest
					buffer = Buffer.from(audioBuffer.data);
				} else {
					throw new Error('Invalid audio buffer format');
				}
				return await uploadContentToBucket(buffer, fileName);
			});

			// Send success event
			await step.sendEvent("chunk-succeeded", {
				name: "tts.chunk.succeeded",
				data: {
					userEpisodeId,
					chunkIndex,
					totalChunks,
					gcsUrl,
					jobId,
					audioSize: Buffer.isBuffer(audioBuffer) ? audioBuffer.length : (audioBuffer as any).data?.length || 0,
				},
			});

			return { success: true, chunkIndex, gcsUrl };
		} catch (error) {
			console.error(`[TTS_CHUNK] Failed for chunk ${chunkIndex}:`, error);
			
			await step.sendEvent("chunk-failed", {
				name: "tts.chunk.failed",
				data: {
					userEpisodeId,
					chunkIndex,
					totalChunks,
					jobId,
					error: error instanceof Error ? error.message : "Unknown error",
				},
			});

			throw error;
		}
	}
);
