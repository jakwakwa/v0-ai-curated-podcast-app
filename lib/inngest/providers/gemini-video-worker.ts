import { writeEpisodeDebugLog } from "@/lib/debug-logger";
import { inngest } from "@/lib/inngest/client";
import { transcribeWithGeminiFromUrl } from "@/lib/transcripts/gemini-video";
import { extractVideoId } from "@/lib/transcripts/utils/youtube-audio";
import ytdl from "@distube/ytdl-core";

import { classifyError, ProviderStartedSchema } from "../utils/results";

/**
 * The duration of each video chunk in seconds.
 * A value of 300 seconds (5 minutes) is chosen as a safe starting point
 * to avoid hitting token limits of the transcription API for most videos.
 * @type {number}
 */
const CHUNK_DURATION_SECONDS = 300;

/**
 * An Inngest function that transcribes a YouTube video using the Gemini API.
 * It employs a fan-out/fan-in pattern to handle long videos by breaking them into smaller chunks,
 * processing them in parallel, and then aggregating the results. This approach helps to avoid
 * API token limits and timeouts.
 *
 * @trigger {transcription.provider.gemini.start} - The event that initiates this worker.
 */
export const geminiVideoWorker = inngest.createFunction(
	{ id: "provider-gemini-video", name: "Provider: Gemini Video", retries: 0 },
	{ event: "transcription.provider.gemini.start" },
	async ({ event, step }) => {
		const { jobId, userEpisodeId, srcUrl } = ProviderStartedSchema.parse(event.data);

		await step.run("log-start", async () => {
			await writeEpisodeDebugLog(userEpisodeId, {
				step: "gemini",
				status: "start",
				meta: { jobId },
			});
		});

		try {
			/**
			 * Step 1: Fetches video metadata from YouTube to determine its total duration.
			 * The duration is essential for calculating the number of chunks required for transcription.
			 */
			const videoInfo = await step.run("get-video-info", async () => {
				const id = extractVideoId(srcUrl);
				if (!id) {
					throw new Error("Could not extract video ID from URL.");
				}
				const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`);
				return {
					duration: Number(info.videoDetails.lengthSeconds),
				};
			});

			const duration = videoInfo.duration;
			const chunks: { startOffset: string; endOffset: string }[] = [];

			/**
			 * Step 2: Generates an array of time-based chunks.
			 * This loop creates segments of CHUNK_DURATION_SECONDS to split the video.
			 */
			for (let i = 0; i < duration; i += CHUNK_DURATION_SECONDS) {
				chunks.push({
					startOffset: `${i}s`,
					endOffset: `${Math.min(i + CHUNK_DURATION_SECONDS, duration)}s`,
				});
			}

			await writeEpisodeDebugLog(userEpisodeId, {
				step: "gemini-chunking",
				status: "info",
				message: `Video of ${duration}s split into ${chunks.length} chunks.`,
			});

			/**
			 * Step 3: Fan-Out - Processes all generated chunks in parallel.
			 * Each chunk is passed to the `transcribeWithGeminiFromUrl` function.
			 * Any failures at this stage are caught and returned as error objects.
			 */
			const transcriptionJobs = chunks.map((chunk, index) => {
				return step.run(`transcribe-chunk-${index + 1}`, async () => {
					return transcribeWithGeminiFromUrl(srcUrl, {
						startOffset: chunk.startOffset,
						endOffset: chunk.endOffset,
					}).catch(e => ({ error: `Chunk ${index + 1} failed: ${e instanceof Error ? e.message : String(e)}` }));
				});
			});

			const transcriptionResults = await Promise.all(transcriptionJobs);

			/**
			 * Step 4: Fan-In - Aggregates the results from all processed chunks.
			 * It separates successful transcriptions from errors.
			 */
			const { fullTranscript, errors } = transcriptionResults.reduce(
				(acc: { fullTranscript: string[]; errors: string[] }, result) => {
					if (typeof result === "string") {
						acc.fullTranscript.push(result);
					} else if (result && typeof result === "object" && "error" in result) {
						acc.errors.push(result.error as string);
					}
					return acc;
				},
				{ fullTranscript: [], errors: [] }
			);

			/**
			 * Step 5: Handles any errors from failed chunks and finalizes the transcription.
			 * If any chunk failed, the entire job is marked as failed to ensure data integrity.
			 * Partial transcriptions are not considered successful.
			 */
			if (errors.length > 0) {
				const errorMessage = `Transcription failed for ${errors.length} chunk(s): ${errors.join(", ")}`;
				await writeEpisodeDebugLog(userEpisodeId, {
					step: "gemini",
					status: "fail",
					message: errorMessage,
				});
				// Decide if partial success is acceptable. Here, we fail the whole job.
				throw new Error(errorMessage);
			}

			const finalTranscript = fullTranscript.join(" ").trim();

			if (finalTranscript) {
				await step.sendEvent("succeeded", {
					name: "transcription.succeeded",
					data: {
						jobId,
						userEpisodeId,
						provider: "gemini",
						transcript: finalTranscript,
						meta: { chunkCount: chunks.length },
					},
				});
			} else {
				const message = errors.length > 0 ? `Gemini returned empty transcript despite ${chunks.length - errors.length}/${chunks.length} successful chunks.` : "Gemini returned empty transcript";
				await writeEpisodeDebugLog(userEpisodeId, {
					step: "gemini",
					status: "fail",
					message,
				});
				await step.sendEvent("failed", {
					name: "transcription.failed",
					data: {
						jobId,
						userEpisodeId,
						provider: "gemini",
						errorType: "unknown",
						errorMessage: "Gemini returned empty transcript",
					},
				});
			}
		} catch (e) {
			await writeEpisodeDebugLog(userEpisodeId, {
				step: "gemini",
				status: "fail",
				message: e instanceof Error ? e.message : String(e),
			});
			const { errorType, errorMessage } = classifyError(e);
			await step.sendEvent("failed", {
				name: "transcription.failed",
				data: {
					jobId,
					userEpisodeId,
					provider: "gemini",
					errorType,
					errorMessage,
				},
			});
		}
	}
);
