import { writeEpisodeDebugLog, writeEpisodeDebugReport } from "@/lib/debug-logger";
import { inngest } from "@/lib/inngest/client";
import { prisma } from "@/lib/prisma";
import { extractYouTubeVideoId, getYouTubeVideoDuration, isYouTubeAPIConfigured } from "@/lib/youtube-api";
import { preflightProbe } from "./utils/preflight";
import { TranscriptionRequestedSchema } from "./utils/results";

const Events = {
	JobRequested: "transcription.job.requested",
	Succeeded: "transcription.succeeded",
	Failed: "transcription.failed",
	Finalized: "transcription.finalized",
} as const;

// Maximum duration for single job processing (15 minutes)
const MAX_DURATION_FOR_SINGLE_JOB_SECONDS = 900;

export const transcriptionCoordinator = inngest.createFunction(
	{ id: "transcription-coordinator", name: "Transcription Coordinator", retries: 0 },
	{ event: Events.JobRequested },
	async ({ event, step }) => {
		const input = TranscriptionRequestedSchema.parse(event.data);
		const { jobId, userEpisodeId, srcUrl, generationMode, voiceA, voiceB } = input;

		try {

		await step.run("mark-processing", async () => {
			await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { status: "PROCESSING", youtube_url: srcUrl } });
			await writeEpisodeDebugLog(userEpisodeId, { step: "status", status: "start", message: "PROCESSING" });
		});

		const probe = await step.run("preflight-probe", async () => await preflightProbe(srcUrl));
		await writeEpisodeDebugLog(userEpisodeId, {
			step: "preflight",
			status: probe.ok ? "success" : "fail",
			meta: probe.ok ? probe.value : probe,
		});

		// If preflight probe fails, notify user and fail the episode
		if (!probe.ok) {
			await step.run("preflight-failed", async () => {
				await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { status: "FAILED" } });

				// Create user notification for preflight failure
				await prisma.notification.create({
					data: {
						user_id: (await prisma.userEpisode.findUnique({
							where: { episode_id: userEpisodeId },
							select: { user_id: true }
						}))?.user_id || "",
						type: "error",
						message: "Episode Generation Failed: Unable to access the video. The video might be private, deleted, or have access restrictions.",
						is_read: false,
					},
				});
			});

			await step.sendEvent("finalize-failed", {
				name: Events.Finalized,
				data: { jobId, userEpisodeId, status: "failed" },
			});
			return { ok: false, jobId };
		}

		// Fetch video duration for chunking decision
		const videoDuration = await step.run("get-video-duration", async () => {
			try {
				const videoId = extractYouTubeVideoId(srcUrl);
				if (!videoId) {
					// Create user notification for invalid URL
					await prisma.notification.create({
						data: {
							user_id: (await prisma.userEpisode.findUnique({
								where: { episode_id: userEpisodeId },
								select: { user_id: true }
							}))?.user_id || "",
							type: "error",
							message: "Episode Generation Failed: The provided URL is not a valid YouTube video URL. Please check the URL and try again.",
							is_read: false,
						},
					});

					await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { status: "FAILED" } });
					await writeEpisodeDebugLog(userEpisodeId, {
						step: "url-validation",
						status: "fail",
						message: "Invalid YouTube URL - could not extract video ID",
					});

					return undefined;
				}

				// Only when YouTube API is configured; else skip duration detection
				if (!isYouTubeAPIConfigured()) {
					await writeEpisodeDebugLog(userEpisodeId, {
						step: "duration-check",
						status: "info",
						message: "YouTube Data API not configured",
					});

					// Create user notification for API configuration issue
					await prisma.notification.create({
						data: {
							user_id: (await prisma.userEpisode.findUnique({
								where: { episode_id: userEpisodeId },
								select: { user_id: true }
							}))?.user_id || "",
							type: "error",
							message: "Episode Generation Failed: There was a configuration issue with the YouTube service. Please try again later or contact support.",
							is_read: false,
						},
					});

					return undefined;
				}

				const lengthSeconds = await getYouTubeVideoDuration(videoId);

				await writeEpisodeDebugLog(userEpisodeId, {
					step: "duration-check",
					status: "success",
					meta: { durationSeconds: lengthSeconds, maxSingleJobSeconds: MAX_DURATION_FOR_SINGLE_JOB_SECONDS },
				});

				return lengthSeconds > 0 ? lengthSeconds : undefined;
			} catch (error) {
				await writeEpisodeDebugLog(userEpisodeId, {
					step: "duration-check",
					status: "fail",
					message: error instanceof Error ? error.message : String(error),
				});

				// Create user notification for duration detection failure
				await prisma.notification.create({
					data: {
						user_id: (await prisma.userEpisode.findUnique({
							where: { episode_id: userEpisodeId },
							select: { user_id: true }
						}))?.user_id || "",
						type: "error",
						message: "Episode Generation Failed: Unable to determine video duration. The video might be unavailable or have access restrictions.",
						is_read: false,
					},
				});

				return undefined;
			}
		});

		// With Gemini 2.5 Pro's capabilities, we can handle long videos efficiently using time-based prompting
		// No need for physical chunking - just use the full video URL with time segments
		await writeEpisodeDebugLog(userEpisodeId, {
			step: "transcription-strategy",
			status: "info",
			meta: {
				videoDuration,
				strategy: videoDuration && videoDuration > MAX_DURATION_FOR_SINGLE_JOB_SECONDS ? "time-segmented" : "full-video"
			},
		});

		return await processVideoWithTimeSegments(step, {
			jobId,
			userEpisodeId,
			srcUrl,
			generationMode,
			voiceA,
			voiceB,
			videoDuration: videoDuration || 0
		});
	}
		)

		/**
		 * Process video using time-based segmentation with Gemini's native capabilities
		 */
		async function processVideoWithTimeSegments(
			step: any,
			params: { jobId: string; userEpisodeId: string; srcUrl: string; generationMode?: string; voiceA?: string; voiceB?: string; videoDuration: number }
		) {
			const { jobId, userEpisodeId, srcUrl, generationMode, voiceA, voiceB, videoDuration } = params;

			// Handle excessively long videos (over 3 hours)
			const MAX_TOTAL_DURATION_SECONDS = 3 * 60 * 60; // 3 hours
			if (videoDuration > MAX_TOTAL_DURATION_SECONDS) {
				await step.run("mark-failed-too-long", async () => {
					await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { status: "FAILED" } });
					await writeEpisodeDebugLog(userEpisodeId, {
						step: "validation",
						status: "fail",
						message: `Video too long: ${Math.round(videoDuration / 60)}min > ${Math.round(MAX_TOTAL_DURATION_SECONDS / 60)}min`,
					});

					// Create user notification for excessively long video
					await prisma.notification.create({
						data: {
							user_id:
								(
									await prisma.userEpisode.findUnique({
										where: { episode_id: userEpisodeId },
										select: { user_id: true },
									})
								)?.user_id || "",
							type: "error",
							message: "Episode Generation Failed: The episode generation failed because the source video is too long.",
							is_read: false,
						},
					});
				});

				await step.sendEvent("finalize-failed", {
					name: Events.Finalized,
					data: { jobId, userEpisodeId, status: "failed" },
				});
				return { ok: false, jobId };
			}

			// For shorter videos, process as single job
			if (!videoDuration || videoDuration <= MAX_DURATION_FOR_SINGLE_JOB_SECONDS) {
				return await processSingleVideoSegment(step, {
					jobId,
					userEpisodeId,
					srcUrl,
					generationMode,
					voiceA,
					voiceB,
				});
			}

			// For longer videos, use time-based segmentation
			const numSegments = Math.ceil(videoDuration / MAX_DURATION_FOR_SINGLE_JOB_SECONDS);

			await writeEpisodeDebugLog(userEpisodeId, {
				step: "time-segmentation",
				status: "start",
				meta: {
					videoDuration,
					numSegments,
					segmentDuration: MAX_DURATION_FOR_SINGLE_JOB_SECONDS,
				},
			});

			// Process each time segment sequentially (Gemini can handle this efficiently)
			const transcriptSegments: string[] = [];

			for (let i = 0; i < numSegments; i++) {
				const startTime = i * MAX_DURATION_FOR_SINGLE_JOB_SECONDS;
				const duration = Math.min(MAX_DURATION_FOR_SINGLE_JOB_SECONDS, videoDuration - startTime);

				const segmentTranscript = await step.run(`transcribe-segment-${i}`, async () => {
					const { transcribeWithGeminiFromUrl } = await import("@/lib/transcripts/gemini-video");
					return await transcribeWithGeminiFromUrl(srcUrl, startTime, duration);
				});

				if (segmentTranscript) {
					transcriptSegments.push(segmentTranscript);
				} else {
					// Handle transcription failure for this segment
					await step.run(`segment-${i}-failed`, async () => {
						await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { status: "FAILED" } });
						await writeEpisodeDebugLog(userEpisodeId, {
							step: "time-segmentation",
							status: "fail",
							message: `Segment ${i} transcription failed`,
						});

						// Create user notification for segment failure
						await prisma.notification.create({
							data: {
								user_id:
									(
										await prisma.userEpisode.findUnique({
											where: { episode_id: userEpisodeId },
											select: { user_id: true },
										})
									)?.user_id || "",
								type: "error",
								message: "Episode Generation Failed: The AI transcription service encountered an issue while processing part of the video. Please try again in 10 minutes.",
								is_read: false,
							},
						});
					});

					await step.sendEvent("finalize-failed", {
						name: Events.Finalized,
						data: { jobId, userEpisodeId, status: "failed" },
					});
					return { ok: false, jobId };
				}
			}

			// Combine all segments
			const finalTranscript = transcriptSegments.join(" ");

			await writeEpisodeDebugLog(userEpisodeId, {
				step: "time-segmentation",
				status: "success",
				meta: {
					segmentsProcessed: transcriptSegments.length,
					finalTranscriptLength: finalTranscript.length,
				},
			});

			// Store the combined transcript
			await step.run("store-combined-transcript", async () => {
				await prisma.userEpisode.update({
					where: { episode_id: userEpisodeId },
					data: { transcript: finalTranscript },
				});
			});

			// Continue with generation
			await step.sendEvent("forward-generation", {
				name: generationMode === "multi" ? "user.episode.generate.multi.requested" : "user.episode.generate.requested",
				data: { userEpisodeId, voiceA, voiceB },
			});

			await step.run("write-final-report", async () => {
				const report = `# Transcription Saga Report (Time-Segmented)\n- job: ${jobId}\n- provider: gemini\n- segments: ${transcriptSegments.length}\n- transcriptChars: ${finalTranscript.length}\n- videoDuration: ${videoDuration}s\n`;
				await writeEpisodeDebugReport(userEpisodeId, report);
			});

			await step.sendEvent("finalize-success", {
				name: Events.Finalized,
				data: { jobId, userEpisodeId, status: "succeeded", provider: "gemini" },
			});

			return { ok: true, jobId };
		}
		catch (error)
		// Catch-all error handler for unexpected failures
		console.error("[TRANSCRIPTION_SAGA] Unexpected error:", error);

		await step.run("unexpected-error", async () => {
			await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { status: "FAILED" } });

			await writeEpisodeDebugLog(userEpisodeId, {
				step: "unexpected-error",
				status: "fail",
				message: error instanceof Error ? error.message : String(error),
			});

			// Create user notification for unexpected errors
			await prisma.notification.create({
				data: {
					user_id:
						(
							await prisma.userEpisode.findUnique({
								where: { episode_id: userEpisodeId },
								select: { user_id: true },
							})
						)?.user_id || "",
					type: "error",
					message: "Episode Generation Failed: An unexpected error occurred while processing your video. Please try again or contact support if the issue persists.",
					is_read: false,
				},
			});
		});

		await step.sendEvent("finalize-failed", {
			name: Events.Finalized,
			data: { jobId, userEpisodeId, status: "failed" },
		});

		return { ok: false, jobId };
	}
);

/**
 * Process a single video segment (short videos or individual time segments)
 */
async function processSingleVideoSegment(step: any, params: { jobId: string; userEpisodeId: string; srcUrl: string; generationMode?: string; voiceA?: string; voiceB?: string }) {
	const { jobId, userEpisodeId, srcUrl, generationMode, voiceA, voiceB } = params;

	// Direct Gemini transcription with time-based prompting
	const transcriptText = await step.run("transcribe-video", async () => {
		const { transcribeWithGeminiFromUrl } = await import("@/lib/transcripts/gemini-video");
		return await transcribeWithGeminiFromUrl(srcUrl);
	});

	if (!transcriptText) {
		// Try fallback orchestrator
		const { getTranscriptOrchestrated } = await import("@/lib/transcripts");
		const fallback = await step.run("fallback-orchestrator", async () => {
			return await getTranscriptOrchestrated({ url: srcUrl, kind: "youtube" });
		});

		if (!fallback.success) {
			await step.run("mark-failed", async () => {
				await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { status: "FAILED" } });
				await writeEpisodeDebugLog(userEpisodeId, {
					step: "transcription",
					status: "fail",
					message: "Gemini transcription failed; fallback also failed",
				});

				// Create user notification for transcription failure
				await prisma.notification.create({
					data: {
						user_id:
							(
								await prisma.userEpisode.findUnique({
									where: { episode_id: userEpisodeId },
									select: { user_id: true },
								})
							)?.user_id || "",
						type: "error",
						message: "Episode Generation Failed: The AI transcription service was unable to process your video. Please try again in 10 minutes or contact support if the issue persists.",
						is_read: false,
					},
				});
			});
			await step.sendEvent("finalize-failed", {
				name: Events.Finalized,
				data: { jobId, userEpisodeId, status: "failed" },
			});
			return { ok: false, jobId };
		}

		const fallbackTranscript = (fallback as { transcript?: string }).transcript as string;
		await step.run("store-transcript", async () => {
			await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { transcript: fallbackTranscript } });
		});
		await step.sendEvent("forward-generation", {
			name: generationMode === "multi" ? "user.episode.generate.multi.requested" : "user.episode.generate.requested",
			data: { userEpisodeId, voiceA, voiceB },
		});
		await step.run("write-final-report", async () => {
			const report = `# Transcription Saga Report\n- job: ${jobId}\n- provider: fallback\n- transcriptChars: ${fallbackTranscript.length}\n`;
			await writeEpisodeDebugReport(userEpisodeId, report);
		});
		await step.sendEvent("finalize-success", {
			name: Events.Finalized,
			data: { jobId, userEpisodeId, status: "succeeded", provider: "fallback" },
		});
		return { ok: true, jobId };
	}

	await step.run("store-transcript", async () => {
		await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { transcript: transcriptText } });
	});

	await step.sendEvent("forward-generation", {
		name: generationMode === "multi" ? "user.episode.generate.multi.requested" : "user.episode.generate.requested",
		data: { userEpisodeId, voiceA, voiceB },
	});

	await step.run("write-final-report", async () => {
		const report = `# Transcription Saga Report\n- job: ${jobId}\n- provider: gemini\n- transcriptChars: ${transcriptText.length}\n`;
		await writeEpisodeDebugReport(userEpisodeId, report);
	});

	await step.sendEvent("finalize-success", {
		name: Events.Finalized,
		data: { jobId, userEpisodeId, status: "succeeded", provider: "gemini" },
	});

	return { ok: true, jobId };
}
