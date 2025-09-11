// lib/inngest/providers/gemini-video-worker.ts

import { writeEpisodeDebugLog } from "@/lib/debug-logger";
import { inngest } from "@/lib/inngest/client";
import { transcribeWithGeminiFromUrl } from "@/lib/transcripts/gemini-video";
import { withTimeout } from "@/lib/utils";
import { classifyError, ProviderStartedSchema } from "../utils/results";

export const geminiVideoWorker = inngest.createFunction(
	{ id: "provider-gemini-video", name: "Provider: Gemini Video", retries: 0 },
	{ event: "transcription.provider.gemini.start" },
	async ({ event, step }) => {
		const { jobId, userEpisodeId, srcUrl } = ProviderStartedSchema.parse(event.data);

		// Add preflight check for video duration/size
		const _videoInfo = await step.run("check-video-info", async () => {
			try {
				const { extractVideoId } = await import("@/lib/transcripts/utils/youtube-audio");
				const id = extractVideoId(srcUrl);
				if (!id) return undefined;

				// Only when allowed in this env; else skip duration gating
				const enableServerYtdl = process.env.ENABLE_SERVER_YTDL === "true";
				if (!enableServerYtdl) return undefined;

				const ytdl = (await import("@distube/ytdl-core")).default ?? (await import("@distube/ytdl-core"));
				const info = await (ytdl as any).getInfo(`https://www.youtube.com/watch?v=${id}`);
				const lengthSeconds = Number(info?.videoDetails?.lengthSeconds || 0);
				return { durationSec: lengthSeconds || undefined };
			} catch {
				return undefined;
			}
		});

		await step.run("log-start", async () => {
			await writeEpisodeDebugLog(userEpisodeId, { step: "gemini", status: "start", meta: { jobId } });
		});

		try {
			const timeoutMs = Number(process.env.GEMINI_TRANSCRIBE_TIMEOUT_MS || 260000); // < 300s Next limit
			const transcript = await step.run("run", async () => await withTimeout(transcribeWithGeminiFromUrl(srcUrl), timeoutMs, "Gemini transcription timed out"));
			if (transcript) {
				await step.sendEvent("succeeded", {
					name: "transcription.succeeded",
					data: { jobId, userEpisodeId, provider: "gemini", transcript, meta: {} },
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
