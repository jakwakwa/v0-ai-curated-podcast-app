import { writeEpisodeDebugLog, writeEpisodeDebugReport } from "@/lib/debug-logger";
import { ensureBucketName, storeUrlInGCS } from "@/lib/gcs";
import { inngest } from "@/lib/inngest/client";
import { prisma } from "@/lib/prisma";
import { calculateVideoChunks, getVideoDurationInSeconds } from "@/lib/video-metadata";
import { preflightProbe } from "./utils/preflight";
import { ProviderSucceededSchema, TranscriptionRequestedSchema } from "./utils/results";

const Events = {
	JobRequested: "transcription.job.requested",
	ProviderStart: {
		AssemblyAI: "transcription.provider.assemblyai.start",
		RevAi: "transcription.provider.revai.start",
		Gemini: "transcription.provider.gemini.start",
	},
	Succeeded: "transcription.succeeded",
	Failed: "transcription.failed",
	Finalized: "transcription.finalized",
} as const;

export const transcriptionCoordinator = inngest.createFunction(
	{ id: "transcription-coordinator", name: "Transcription Coordinator", retries: 0 },
	{ event: Events.JobRequested },
	async ({ event, step }) => {
		const input = TranscriptionRequestedSchema.parse(event.data);
		const { jobId, userEpisodeId, srcUrl, lang, generationMode, voiceA, voiceB } = input;

		const _startedAt = Date.now();

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

		// Download-once: store source audio in GCS for non-Gemini providers; Gemini needs the original YouTube URL
		const permanentUrl = await step.run("download-and-store-audio", async () => {
			const _bucket = ensureBucketName();
			const objectName = `transcripts/${userEpisodeId}/source-audio`;
			const stored = await storeUrlInGCS(srcUrl, objectName);
			return stored;
		});
		await writeEpisodeDebugLog(userEpisodeId, { step: "storage", status: "success", message: "Stored source audio", meta: { url: permanentUrl } });

		// Get video duration and calculate chunks for Fan-Out/Fan-In pattern
		const totalDuration = await step.run("get-video-duration", async () => {
			return await getVideoDurationInSeconds(srcUrl);
		});
		await writeEpisodeDebugLog(userEpisodeId, { step: "duration", status: "success", message: `Video duration: ${totalDuration}s` });

		// Calculate chunking parameters
		const CHUNK_DURATION_SECONDS = 30 * 60; // 30 minutes per chunk
		const chunkingParams = calculateVideoChunks(totalDuration, CHUNK_DURATION_SECONDS);

		await writeEpisodeDebugLog(userEpisodeId, {
			step: "chunking",
			status: "info",
			message: `Video will be processed in ${chunkingParams.chunkCount} chunks of ${chunkingParams.chunkDuration}s each`,
		});

		// Fan-Out: Create chunk jobs and send events for each chunk
		const chunkJobs = chunkingParams.chunks.map(chunk => ({
			name: Events.ProviderStart.Gemini,
			data: {
				jobId,
				userEpisodeId,
				srcUrl,
				provider: "gemini",
				lang,
				chunk: chunk.index,
				totalChunks: chunkingParams.chunkCount,
				startTime: chunk.startTime,
				duration: chunk.duration,
			},
		}));

		await step.sendEvent("start-gemini-chunks", chunkJobs);

		// Fan-In: Wait for ALL chunks to complete
		// Note: Inngest doesn't support count parameter, so we'll collect events in a loop
		const successEvents: Array<{ data?: any }> = [];
		const startTime = Date.now();
		const timeoutMs = 60 * 60 * 1000; // 1 hour timeout
		
		while (successEvents.length < chunkingParams.chunkCount && (Date.now() - startTime) < timeoutMs) {
			const event = await step.waitForEvent(`wait-for-chunk-${successEvents.length}`, {
				event: Events.Succeeded,
				timeout: "30s", // 30 second timeout per event
				if: `event.data.jobId == "${jobId}"`,
			});
			
			if (event) {
				successEvents.push(event);
				await writeEpisodeDebugLog(userEpisodeId, { 
					step: "chunk-collection", 
					status: "info", 
					message: `Collected chunk ${successEvents.length}/${chunkingParams.chunkCount}` 
				});
			}
		}

		if (!successEvents || successEvents.length < chunkingParams.chunkCount) {
			await step.run("mark-failed-incomplete-chunks", async () => {
				await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { status: "FAILED" } });
				await writeEpisodeDebugLog(userEpisodeId, {
					step: "transcription",
					status: "fail",
					message: `Only ${successEvents?.length || 0}/${chunkingParams.chunkCount} chunks completed successfully`,
				});
			});

			await step.sendEvent("finalize-failed", {
				name: Events.Finalized,
				data: { jobId, userEpisodeId, status: "failed" },
			});
			return { ok: false, jobId };
		}

		// Stitch transcripts together in correct order
		const transcriptText = await step.run("stitch-transcripts", async () => {
			// Sort success events by chunk index to maintain correct order
			const sortedPayloads = successEvents.map(e => ProviderSucceededSchema.parse(e.data)).sort((a, b) => (a.meta?.chunk ?? 0) - (b.meta?.chunk ?? 0));

			// Join all transcript chunks with spaces
			const fullTranscript = sortedPayloads.map(p => p.transcript).join(" ");

			await writeEpisodeDebugLog(userEpisodeId, {
				step: "stitching",
				status: "success",
				message: `Stitched ${sortedPayloads.length} chunks into ${fullTranscript.length} character transcript`,
			});

			return fullTranscript;
		});

		await step.run("store-transcript", async () => {
			await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { transcript: transcriptText } });
		});

		await step.sendEvent("forward-generation", {
			name: generationMode === "multi" ? "user.episode.generate.multi.requested" : "user.episode.generate.requested",
			data: { userEpisodeId, voiceA, voiceB },
		});

		await step.run("write-final-report", async () => {
			const report = `# Transcription Saga Report (Chunked)
- job: ${jobId}
- provider: gemini (chunked)
- totalChunks: ${chunkingParams.chunkCount}
- chunkDuration: ${chunkingParams.chunkDuration}s
- totalDuration: ${totalDuration}s
- transcriptChars: ${transcriptText.length}
- processingMode: Fan-Out/Fan-In chunking
`;
			await writeEpisodeDebugReport(userEpisodeId, report);
		});

		await step.sendEvent("finalize-success", {
			name: Events.Finalized,
			data: { jobId, userEpisodeId, status: "succeeded", provider: "gemini-chunked" },
		});

		return { ok: true, jobId };
	}
);
