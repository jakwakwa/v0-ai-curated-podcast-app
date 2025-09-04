// lib/inngest/providers/revai-worker.ts

import { writeEpisodeDebugLog } from "@/lib/debug-logger"
import { inngest } from "@/lib/inngest/client"
import { classifyError, ProviderStartedSchema } from "../utils/results"

export const revAiWorker = inngest.createFunction({ id: "provider-revai", name: "Provider: Rev.ai", retries: 0 }, { event: "transcription.provider.revai.start" }, async ({ event, step }) => {
	const { jobId, userEpisodeId, srcUrl } = ProviderStartedSchema.parse(event.data)
	const key = process.env.REVAI_API_KEY
	if (!key) return

	await step.run("log-start", async () => {
		await writeEpisodeDebugLog(userEpisodeId, { step: "revai", status: "start", meta: { jobId } })
	})

	try {
		const startRes = await step.run("start", async () => {
			const res = await fetch("https://api.rev.ai/speechtotext/v1/jobs", {
				method: "POST",
				headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
				body: JSON.stringify({ media_url: srcUrl, metadata: "saga" }),
			})
			if (!res.ok) throw new Error(await res.text())
			return (await res.json()) as { id: string }
		})
		const jobIdRev = startRes.id
		for (let i = 0; i < 8; i++) {
			const status = await step.run("poll", async () => {
				const res = await fetch(`https://api.rev.ai/speechtotext/v1/jobs/${jobIdRev}`, {
					headers: { Authorization: `Bearer ${key}` },
				})
				if (!res.ok) throw new Error(await res.text())
				return (await res.json()) as { status: string }
			})
			if (status.status === "transcribed" || status.status === "completed") {
				const transcript = await step.run("fetch", async () => {
					const res = await fetch(`https://api.rev.ai/speechtotext/v1/jobs/${jobIdRev}/transcript`, {
						headers: { Authorization: `Bearer ${key}` },
					})
					if (!res.ok) throw new Error(await res.text())
					return await res.text()
				})
				await step.sendEvent("succeeded", {
					name: "transcription.succeeded",
					data: { jobId, userEpisodeId, provider: "revai", transcript, meta: { jobIdRev } },
				})
				return
			}
			// @ts-expect-error runtime provided
			await step.sleep("15s")
		}
		await step.sendEvent("failed", {
			name: "transcription.failed",
			data: { jobId, userEpisodeId, provider: "revai", errorType: "timeout", errorMessage: "Rev.ai timed out" },
		})
	} catch (e) {
		const { errorType, errorMessage } = classifyError(e)
		await step.sendEvent("failed", {
			name: "transcription.failed",
			data: { jobId, userEpisodeId, provider: "revai", errorType, errorMessage },
		})
	}
})
