// lib/inngest/providers/gemini-video-worker.ts

import { z } from "zod";
import { extractAudioSegment } from "@/lib/audio-segment-extractor";
import { writeEpisodeDebugLog } from "@/lib/debug-logger";
import { inngest } from "@/lib/inngest/client";
import { transcribeWithGeminiFromBuffer, transcribeWithGeminiFromUrl } from "@/lib/transcripts/gemini-video";
import { withTimeout } from "@/lib/utils";
import { classifyError, ProviderStartedSchema } from "../utils/results";

// Extended schema for chunked requests
const ChunkedProviderStartedSchema = ProviderStartedSchema.extend({
	chunk: z.number().optional(),
	totalChunks: z.number().optional(),
	startTime: z.number().optional(),
	duration: z.number().optional(),
});

export const geminiVideoWorker = inngest.createFunction(
	{ id: "provider-gemini-video", name: "Provider: Gemini Video", retries: 0 },
	{ event: "transcription.provider.gemini.start" },
	async ({ event, step }) => {
		const eventData = ChunkedProviderStartedSchema.parse(event.data);
		const { jobId, userEpisodeId, srcUrl, chunk, totalChunks, startTime, duration } = eventData;

		await step.run("log-start", async () => {
			const isChunked = chunk !== undefined && totalChunks !== undefined;
			await writeEpisodeDebugLog(userEpisodeId, {
				step: "gemini",
				status: "start",
				meta: {
					jobId,
					isChunked,
					chunk: chunk ?? "full",
					totalChunks: totalChunks ?? 1,
					startTime: startTime ?? 0,
					duration: duration ?? "full",
				},
			});
		});

		try {
			const transcript = await step.run("run", async () => {
				// Check if this is a chunked request
				if (chunk !== undefined && totalChunks !== undefined && startTime !== undefined && duration !== undefined) {
					// Process a single chunk
					await writeEpisodeDebugLog(userEpisodeId, {
						step: "gemini-chunk",
						status: "info",
						message: `Processing chunk ${chunk + 1}/${totalChunks} (${startTime}s - ${startTime + duration}s)`,
					});

					// Extract the specific audio segment
					const audioSegment = await extractAudioSegment(srcUrl, startTime, duration);

					// Transcribe the audio segment
					return await withTimeout(
						transcribeWithGeminiFromBuffer(audioSegment.buffer, audioSegment.mimeType),
						45000, // 45 seconds with buffer
						"Gemini chunk transcription timed out"
					);
				} else {
					// Process the full video (legacy mode)
					await writeEpisodeDebugLog(userEpisodeId, {
						step: "gemini-full",
						status: "info",
						message: "Processing full video (legacy mode)",
					});

					return await withTimeout(
						transcribeWithGeminiFromUrl(srcUrl),
						45000, // 45 seconds with buffer
						"Gemini transcription timed out"
					);
				}
			});

			if (transcript) {
				const meta = chunk !== undefined ? { chunk, totalChunks } : {};
				await step.sendEvent("succeeded", {
					name: "transcription.succeeded",
					data: { jobId, userEpisodeId, provider: "gemini", transcript, meta },
				});
			} else {
				await writeEpisodeDebugLog(userEpisodeId, { step: "gemini", status: "fail", message: "empty transcript or failure; check server logs" });
				await step.sendEvent("failed", {
					name: "transcription.failed",
					data: { jobId, userEpisodeId, provider: "gemini", errorType: "unknown", errorMessage: "Gemini returned empty transcript" },
				});
			}
		} catch (e) {
			await writeEpisodeDebugLog(userEpisodeId, { step: "gemini", status: "fail", message: e instanceof Error ? e.message : String(e) });
			const { errorType, errorMessage } = classifyError(e);
			await step.sendEvent("failed", {
				name: "transcription.failed",
				data: { jobId, userEpisodeId, provider: "gemini", errorType, errorMessage },
			});
		}
	}
);
