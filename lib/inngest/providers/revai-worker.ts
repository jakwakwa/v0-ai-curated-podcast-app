// lib/inngest/providers/revai-worker.ts

import { writeEpisodeDebugLog } from "@/lib/debug-logger"
import { inngest } from "@/lib/inngest/client"
import { classifyError, ProviderStartedSchema } from "../utils/results"

async function uploadToRevAi(srcUrl: string, apiKey: string): Promise<string> {
	// 1. Fetch the source audio stream from the (potentially temporary) URL
	const sourceResponse = await fetch(srcUrl, { headers: { "User-Agent": "Mozilla/5.0" } })
	if (!(sourceResponse.ok && sourceResponse.body)) {
		const errorText = await sourceResponse.text()
		throw new Error(`Failed to download source audio from URL. Status: ${sourceResponse.status}. Body: ${errorText.slice(0, 500)}`)
	}

	// 2. Get the content type or default to audio
	const contentType = sourceResponse.headers.get("content-type") || "audio/mpeg"

	// 3. Create FormData and append the stream
	const formData = new FormData()
	// Convert ReadableStream to Blob for FormData
	const arrayBuffer = await sourceResponse.arrayBuffer()
	const blob = new Blob([arrayBuffer], { type: contentType })

	formData.append("media", blob, "audio.mp3")
	formData.append("options", JSON.stringify({ metadata: "saga" }))

	const uploadedResponse = await fetch("https://api.rev.ai/speechtotext/v1/jobs", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
		},
		body: formData,
	})

	if (!uploadedResponse.ok) {
		const errorText = await uploadedResponse.text()
		throw new Error(`Rev.ai upload failed. Status: ${uploadedResponse.status}. Body: ${errorText.slice(0, 500)}`)
	}

	const json = (await uploadedResponse.json()) as { id?: string }
	if (!json.id) {
		throw new Error("Rev.ai upload succeeded but did not return a job id.")
	}
	return json.id
}

async function pollRevAiJob(jobId: string, apiKey: string): Promise<{ status: string; id: string }> {
	const res = await fetch(`https://api.rev.ai/speechtotext/v1/jobs/${jobId}`, {
		headers: { Authorization: `Bearer ${apiKey}` },
	})
	if (!res.ok) {
		const errorText = await res.text()
		throw new Error(`Rev.ai job poll failed. Status: ${res.status}. Body: ${errorText.slice(0, 500)}`)
	}
	return (await res.json()) as { status: string; id: string }
}

async function getRevAiTranscript(jobId: string, apiKey: string): Promise<string> {
	const res = await fetch(`https://api.rev.ai/speechtotext/v1/jobs/${jobId}/transcript`, {
		headers: { Authorization: `Bearer ${apiKey}` },
	})
	if (!res.ok) {
		const errorText = await res.text()
		throw new Error(`Rev.ai transcript fetch failed. Status: ${res.status}. Body: ${errorText.slice(0, 500)}`)
	}
	return await res.text()
}

export const revAiWorker = inngest.createFunction({ id: "provider-revai", name: "Provider: Rev.ai", retries: 0 }, { event: "transcription.provider.revai.start" }, async ({ event, step }) => {
	const { jobId, userEpisodeId, srcUrl } = ProviderStartedSchema.parse(event.data)
	const key = process.env.REVAI_API_KEY
	if (!key) {
		console.error("Rev.ai API key is not configured.")
		return
	}

	await step.run("log-start", async () => {
		await writeEpisodeDebugLog(userEpisodeId, { step: "revai", status: "start", meta: { jobId } })
	})

	try {
		// ALWAYS upload the file. Do not pass the srcUrl directly.
		const jobIdRev = await step.run("upload-and-start", async () => await uploadToRevAi(srcUrl, key))

		const maxPolls = 8
		for (let i = 0; i < maxPolls; i++) {
			const status = await step.run(`poll-${i + 1}`, async () => await pollRevAiJob(jobIdRev, key))

			if (status.status === "transcribed" || status.status === "completed") {
				const transcript = await step.run("fetch-transcript", async () => await getRevAiTranscript(jobIdRev, key))
				await step.sendEvent("succeeded", {
					name: "transcription.succeeded",
					data: { jobId, userEpisodeId, provider: "revai", transcript, meta: { jobIdRev } },
				})
				return
			}

			if (status.status === "failed") {
				throw new Error("Rev.ai job failed")
			}

			if (i < maxPolls - 1) {
				await step.sleep(`poll-wait-${i + 1}`, "15s")
			}
		}

		// If loop finishes without returning, it's a timeout
		await step.sendEvent("failed-timeout", {
			name: "transcription.failed",
			data: { jobId, userEpisodeId, provider: "revai", errorType: "timeout", errorMessage: "Rev.ai timed out" },
		})
	} catch (e) {
		const { errorType, errorMessage } = classifyError(e)
		await step.sendEvent("failed-error", {
			name: "transcription.failed",
			data: { jobId, userEpisodeId, provider: "revai", errorType, errorMessage },
		})
	}
})
