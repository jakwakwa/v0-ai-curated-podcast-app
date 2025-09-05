// lib/inngest/providers/assemblyai-worker.ts

import { writeEpisodeDebugLog } from "@/lib/debug-logger"
import { inngest } from "@/lib/inngest/client"
import { classifyError, ProviderStartedSchema } from "../utils/results"

const ASSEMBLY_BASE_URL = "https://api.assemblyai.com/v2"

async function uploadToAssembly(srcUrl: string, apiKey: string): Promise<string> {
	// 1. Fetch the source audio stream from the (potentially temporary) URL
	const sourceResponse = await fetch(srcUrl, { headers: { "User-Agent": "Mozilla/5.0" } })
	if (!(sourceResponse.ok && sourceResponse.body)) {
		const errorText = await sourceResponse.text()
		throw new Error(
			`Failed to download source audio from URL. Status: ${sourceResponse.status}. Body: ${errorText.slice(0, 500)}`
		)
	}

	// 2. Stream the response body directly to AssemblyAI's upload endpoint
	const uploadedResponse = await fetch(`${ASSEMBLY_BASE_URL}/upload`, {
		method: "POST",
		headers: {
			Authorization: apiKey,
			"Content-Type": "application/octet-stream",
		},
		// @ts-expect-error Node.js fetch streaming request bodies require duplex property
		duplex: "half",
		body: sourceResponse.body,
	})

	if (!uploadedResponse.ok) {
		const errorText = await uploadedResponse.text()
		throw new Error(`AssemblyAI upload failed. Status: ${uploadedResponse.status}. Body: ${errorText.slice(0, 500)}`)
	}

	const json = (await uploadedResponse.json()) as { upload_url?: string }
	if (!json.upload_url) {
		throw new Error("AssemblyAI upload succeeded but did not return an upload_url.")
	}
	return json.upload_url
}

async function startJob(audioUrl: string, apiKey: string, languageCode?: string): Promise<string> {
	const res = await fetch(`${ASSEMBLY_BASE_URL}/transcript`, {
		method: "POST",
		headers: { Authorization: apiKey, "Content-Type": "application/json" },
		body: JSON.stringify({ audio_url: audioUrl, language_code: languageCode ?? undefined, speaker_labels: false, punctuate: true, format_text: true }),
	})
	if (!res.ok) {
		const errorText = await res.text()
		throw new Error(`AssemblyAI job start failed. Status: ${res.status}. Body: ${errorText.slice(0, 500)}`)
	}
	const data = (await res.json()) as { id: string }
	return data.id
}

async function pollJob(id: string, apiKey: string): Promise<{ status: string; text?: string; error?: string }> {
	const res = await fetch(`${ASSEMBLY_BASE_URL}/transcript/${id}`, { headers: { Authorization: apiKey } })
	if (!res.ok) {
		const errorText = await res.text()
		throw new Error(`AssemblyAI job poll failed. Status: ${res.status}. Body: ${errorText.slice(0, 500)}`)
	}
	return (await res.json()) as { status: string; text?: string; error?: string }
}

export const assemblyAiWorker = inngest.createFunction(
	{ id: "provider-assemblyai", name: "Provider: AssemblyAI", retries: 0 },
	{ event: "transcription.provider.assemblyai.start" },
	async ({ event, step }) => {
		const { jobId, userEpisodeId, srcUrl, lang } = ProviderStartedSchema.parse(event.data)
		const apiKey = process.env.ASSEMBLYAI_API_KEY
		if (!apiKey) {
			console.error("AssemblyAI API key is not configured.")
			return
		}

		await step.run("log-start", async () => {
			await writeEpisodeDebugLog(userEpisodeId, { step: "assemblyai", status: "start", meta: { jobId } })
		})

		try {
			// ALWAYS upload the file. Do not pass the srcUrl directly.
			// This is the most critical change.
			const uploadedUrl = await step.run("upload-and-proxy", async () => await uploadToAssembly(srcUrl, apiKey))

			const transcriptionJobId = await step.run("start-job", async () => await startJob(uploadedUrl, apiKey, lang))

			const maxPolls = 8
			for (let i = 0; i < maxPolls; i++) {
				const res = await step.run(`poll-${i + 1}`, async () => await pollJob(transcriptionJobId, apiKey))

				if (res.status === "completed" && res.text) {
					await step.sendEvent("succeeded", {
						name: "transcription.succeeded",
						data: { jobId, userEpisodeId, provider: "assemblyai", transcript: res.text, meta: { job: transcriptionJobId } },
					})
					return // Success
				}

				if (res.status === "error") {
					throw new Error(res.error || "AssemblyAI job failed without a specific error message.")
				}
				
				if(i < maxPolls - 1) {
					await step.sleep(`poll-wait-${i + 1}`, "15s")
				}
			}

			// If loop finishes without returning, it's a timeout
			await step.sendEvent("failed-timeout", {
				name: "transcription.failed",
				data: { jobId, userEpisodeId, provider: "assemblyai", errorType: "timeout", errorMessage: "AssemblyAI job timed out after polling." },
			})
		} catch (e) {
			const { errorType, errorMessage } = classifyError(e)
			await step.sendEvent("failed-error", {
				name: "transcription.failed",
				data: { jobId, userEpisodeId, provider: "assemblyai", errorType, errorMessage },
			})
		}
	}
)
