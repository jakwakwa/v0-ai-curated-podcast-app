import { writeEpisodeDebugLog, writeEpisodeDebugReport } from "@/lib/debug-logger";
import { inngest } from "@/lib/inngest/client";
import { prisma } from "@/lib/prisma";
import { preflightProbe } from "./utils/preflight";
import { ProviderSucceededSchema, TranscriptionRequestedSchema } from "./utils/results";

const Events = {
	JobRequested: "transcription.job.requested",
	ProviderStart: {
		Gemini: "transcription.provider.gemini.start",
		GeminiChunk: "transcription.provider.gemini.chunk.start",
	},
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

		// Fetch video duration for chunking decision
		const videoDuration = await step.run("get-video-duration", async () => {
			try {
				const { extractVideoId } = await import('@/lib/transcripts/utils/youtube-audio');
				const videoId = extractVideoId(srcUrl);
				if (!videoId) return undefined;

				// Only when allowed in this env; else skip duration detection
				const enableServerYtdl = process.env.ENABLE_SERVER_YTDL === 'true';
				if (!enableServerYtdl) return undefined;

				const ytdl = (await import('@distube/ytdl-core')).default ?? (await import('@distube/ytdl-core'));
				const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`);
				const lengthSeconds = Number(info?.videoDetails?.lengthSeconds || 0);
				
				await writeEpisodeDebugLog(userEpisodeId, {
					step: "duration-check",
					status: "success",
					meta: { durationSeconds: lengthSeconds, maxSingleJobSeconds: MAX_DURATION_FOR_SINGLE_JOB_SECONDS },
				});
				
				return lengthSeconds || undefined;
			} catch (error) {
				await writeEpisodeDebugLog(userEpisodeId, {
					step: "duration-check",
					status: "fail",
					message: error instanceof Error ? error.message : String(error),
				});
				return undefined;
			}
		});

		// Decide whether to chunk the video or process it as a single job
		if (!videoDuration || videoDuration <= MAX_DURATION_FOR_SINGLE_JOB_SECONDS) {
			// Process as single job (existing workflow)
			return await processSingleVideo(step, { jobId, userEpisodeId, srcUrl, generationMode, voiceA, voiceB });
		} else {
			// Process as chunked video
			return await processChunkedVideo(step, { jobId, userEpisodeId, srcUrl, generationMode, voiceA, voiceB, videoDuration });
		}
	}
);

/**
 * Process a single video (existing workflow)
 */
async function processSingleVideo(
	step: {
		sendEvent: (id: string, event: any) => Promise<void>;
		waitForEvent: (id: string, options: any) => Promise<any>;
		run: (id: string, fn: () => Promise<any>) => Promise<any>;
	},
	params: { jobId: string; userEpisodeId: string; srcUrl: string; generationMode?: string; voiceA?: string; voiceB?: string }
) {
	const { jobId, userEpisodeId, srcUrl, generationMode, voiceA, voiceB } = params;

	// Direct Gemini transcription - no fallbacks, no orchestrator complexity
	await step.sendEvent("start-gemini", {
		name: Events.ProviderStart.Gemini,
		data: { jobId, userEpisodeId, srcUrl, provider: "gemini" },
	});

	// Wait for Gemini to complete or timeout (either success or failure)
	const successEvent = await step.waitForEvent("wait-gemini-success", {
		event: Events.Succeeded,
		timeout: "600s",
		if: `event.data.jobId == "${jobId}"`,
	});
	if (!successEvent) {
		await step.waitForEvent("wait-gemini-failed", {
			event: Events.Failed,
			timeout: "1s",
			if: `event.data.jobId == "${jobId}"`,
		});
	}

	if (!successEvent) {
		// Gemini did not succeed within the window or explicitly failed; try orchestrator fallback
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
					message: "Gemini transcription failed or timed out; fallback also failed",
				});
			});
			await step.sendEvent("finalize-failed", {
				name: Events.Finalized,
				data: { jobId, userEpisodeId, status: "failed" },
			});
			return { ok: false, jobId };
		}

		const transcriptText = (fallback as { transcript?: string; provider?: string }).transcript as string;
		const provider = (fallback as { provider?: string }).provider ?? "fallback-orchestrator";
		await step.run("store-transcript", async () => {
			await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { transcript: transcriptText } });
		});
		await step.sendEvent("forward-generation", {
			name: generationMode === "multi" ? "user.episode.generate.multi.requested" : "user.episode.generate.requested",
			data: { userEpisodeId, voiceA, voiceB },
		});
		await step.run("write-final-report", async () => {
			const report = `# Transcription Saga Report\n- job: ${jobId}\n- provider: ${provider}\n- transcriptChars: ${transcriptText.length}\n`;
			await writeEpisodeDebugReport(userEpisodeId, report);
		});
		await step.sendEvent("finalize-success", {
			name: Events.Finalized,
			data: { jobId, userEpisodeId, status: "succeeded", provider },
		});
		return { ok: true, jobId };
	}

	// Gemini succeeded - process the result
	const successPayload = ProviderSucceededSchema.parse((successEvent as { data: unknown }).data);
	const transcriptText = successPayload.transcript;

	await step.run("store-transcript", async () => {
		await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { transcript: transcriptText } });
	});

	await step.sendEvent("forward-generation", {
		name: generationMode === "multi" ? "user.episode.generate.multi.requested" : "user.episode.generate.requested",
		data: { userEpisodeId, voiceA, voiceB },
	});

	await step.run("write-final-report", async () => {
		const report = `# Transcription Saga Report\n- job: ${jobId}\n- provider: ${successPayload.provider}\n- transcriptChars: ${transcriptText.length}\n`;
		await writeEpisodeDebugReport(userEpisodeId, report);
	});

	await step.sendEvent("finalize-success", {
		name: Events.Finalized,
		data: { jobId, userEpisodeId, status: "succeeded", provider: successPayload.provider },
	});

	return { ok: true, jobId };
}

/**
 * Process a chunked video using fan-out/gather pattern
 */
async function processChunkedVideo(
	step: {
		sendEvent: (id: string, event: any) => Promise<void>;
		waitForEvent: (id: string, options: any) => Promise<any>;
		run: (id: string, fn: () => Promise<any>) => Promise<any>;
	},
	params: { jobId: string; userEpisodeId: string; srcUrl: string; generationMode?: string; voiceA?: string; voiceB?: string; videoDuration: number }
) {
	const { jobId, userEpisodeId, srcUrl, generationMode, voiceA, voiceB, videoDuration } = params;

	// Handle excessively long videos (over 3 hours)
	const MAX_TOTAL_DURATION_SECONDS = 3 * 60 * 60; // 3 hours
	if (videoDuration > MAX_TOTAL_DURATION_SECONDS) {
		await step.run("mark-failed-too-long", async () => {
			await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { status: "FAILED" } });
			await writeEpisodeDebugLog(userEpisodeId, {
				step: "chunking",
				status: "fail",
				message: `Video too long: ${Math.round(videoDuration / 60)}min > ${Math.round(MAX_TOTAL_DURATION_SECONDS / 60)}min`,
			});
			
			// Create user notification for excessively long video
			await prisma.notification.create({
				data: {
					user_id: (await prisma.userEpisode.findUnique({ 
						where: { episode_id: userEpisodeId },
						select: { user_id: true }
					}))?.user_id || '',
					type: 'error',
					title: 'Episode Generation Failed',
					message: 'The episode generation failed because the source video is too long.',
					read: false,
				}
			});
		});
		
		await step.sendEvent("finalize-failed", {
			name: Events.Finalized,
			data: { jobId, userEpisodeId, status: "failed" },
		});
		return { ok: false, jobId };
	}

	// Calculate number of chunks needed
	const numChunks = Math.ceil(videoDuration / MAX_DURATION_FOR_SINGLE_JOB_SECONDS);
	
	await writeEpisodeDebugLog(userEpisodeId, {
		step: "chunking",
		status: "start",
		meta: { 
			videoDuration, 
			numChunks, 
			chunkDuration: MAX_DURATION_FOR_SINGLE_JOB_SECONDS 
		},
	});

	// Create chunk events
	const chunkEvents = [];
	for (let i = 0; i < numChunks; i++) {
		const startTime = i * MAX_DURATION_FOR_SINGLE_JOB_SECONDS;
		const duration = Math.min(MAX_DURATION_FOR_SINGLE_JOB_SECONDS, videoDuration - startTime);
		
		chunkEvents.push({
			name: Events.ProviderStart.GeminiChunk,
			data: {
				jobId,
				userEpisodeId,
				srcUrl,
				provider: "gemini",
				startTime,
				duration,
			},
		});
	}

	// Send all chunk events in parallel
	await step.sendEvent("start-gemini-chunks", chunkEvents);

	// Wait for all chunks to complete
	const chunkResults = [];
	for (let i = 0; i < numChunks; i++) {
		const chunkEvent = await step.waitForEvent(`wait-chunk-${i}`, {
			event: Events.Succeeded,
			timeout: "900s", // 15 minutes per chunk
			if: `event.data.jobId == "${jobId}" && event.data.startTime == ${i * MAX_DURATION_FOR_SINGLE_JOB_SECONDS}`,
		});
		
		if (!chunkEvent) {
			// Check if this chunk failed
			await step.waitForEvent(`wait-chunk-${i}-failed`, {
				event: Events.Failed,
				timeout: "1s",
				if: `event.data.jobId == "${jobId}"`,
			});
			
			// Handle chunk failure
			await step.run("mark-chunk-failed", async () => {
				await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { status: "FAILED" } });
				await writeEpisodeDebugLog(userEpisodeId, {
					step: "chunking",
					status: "fail",
					message: `Chunk ${i} failed or timed out`,
				});
				
				// Create user notification
				await prisma.notification.create({
					data: {
						user_id: (await prisma.userEpisode.findUnique({ 
							where: { episode_id: userEpisodeId },
							select: { user_id: true }
						}))?.user_id || '',
						type: 'error',
						title: 'Episode Generation Failed',
						message: 'The AI model failed to transcribe the video due to a technical issue. Please try again in 10 minutes.',
						read: false,
					}
				});
			});
			
			await step.sendEvent("finalize-failed", {
				name: Events.Finalized,
				data: { jobId, userEpisodeId, status: "failed" },
			});
			return { ok: false, jobId };
		}
		
		chunkResults.push(ProviderSucceededSchema.parse((chunkEvent as { data: unknown }).data));
	}

	// Sort chunks by startTime and stitch transcripts together
	chunkResults.sort((a, b) => (a.startTime || 0) - (b.startTime || 0));
	const finalTranscript = chunkResults.map(chunk => chunk.transcript).join(' ');

	await writeEpisodeDebugLog(userEpisodeId, {
		step: "chunking",
		status: "success",
		meta: { 
			chunksProcessed: chunkResults.length,
			finalTranscriptLength: finalTranscript.length 
		},
	});

	// Store the combined transcript
	await step.run("store-combined-transcript", async () => {
		await prisma.userEpisode.update({ 
			where: { episode_id: userEpisodeId }, 
			data: { transcript: finalTranscript } 
		});
	});

	// Continue with generation
	await step.sendEvent("forward-generation", {
		name: generationMode === "multi" ? "user.episode.generate.multi.requested" : "user.episode.generate.requested",
		data: { userEpisodeId, voiceA, voiceB },
	});

	await step.run("write-final-report", async () => {
		const report = `# Transcription Saga Report (Chunked)\n- job: ${jobId}\n- provider: gemini\n- chunks: ${chunkResults.length}\n- transcriptChars: ${finalTranscript.length}\n- videoDuration: ${videoDuration}s\n`;
		await writeEpisodeDebugReport(userEpisodeId, report);
	});

	await step.sendEvent("finalize-success", {
		name: Events.Finalized,
		data: { jobId, userEpisodeId, status: "succeeded", provider: "gemini" },
	});

	return { ok: true, jobId };
}
