// lib/inngest/providers/gemini-video-worker.ts

import { writeEpisodeDebugLog } from "@/lib/debug-logger"
import { inngest } from "@/lib/inngest/client"
import { transcribeWithGeminiFromUrl } from "@/lib/transcripts/gemini-video"
import { classifyError, ProviderStartedSchema } from "../utils/results"

export const geminiVideoWorker = inngest.createFunction(
	{ id: "provider-gemini-video", name: "Provider: Gemini Video", retries: 0 },
	{ event: "transcription.provider.gemini.start" },
	async ({ event, step }) => {
		const { jobId, userEpisodeId, srcUrl } = ProviderStartedSchema.parse(event.data)
		await step.run("log-start", async () => {
			await writeEpisodeDebugLog(userEpisodeId, { step: "gemini", status: "start", meta: { jobId } })
		})
		try {
			const transcript = await step.run("run", async () => await transcribeWithGeminiFromUrl(srcUrl))
			if (transcript) {
				await step.sendEvent("succeeded", {
					name: "transcription.succeeded",
					data: { jobId, userEpisodeId, provider: "gemini", transcript, meta: {} },
				})
			} else {
				await step.sendEvent("failed", {
					name: "transcription.failed",
					data: { jobId, userEpisodeId, provider: "gemini", errorType: "unknown", errorMessage: "Gemini returned empty transcript" },
				})
			}
		} catch (e) {
			const { errorType, errorMessage } = classifyError(e)
			await step.sendEvent("failed", {
				name: "transcription.failed",
				data: { jobId, userEpisodeId, provider: "gemini", errorType, errorMessage },
			})
		}
	}
)
