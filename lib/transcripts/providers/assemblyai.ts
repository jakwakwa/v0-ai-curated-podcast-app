import type { TranscriptProvider, TranscriptRequest, TranscriptResponse } from "../types"

interface AssemblyAITranscript {
	id: string
	status: "queued" | "processing" | "completed" | "error" | string
	text?: string
	error?: string
}

const ASSEMBLY_BASE_URL = "https://api.assemblyai.com/v2"

async function startAssemblyJob(audioUrl: string, apiKey: string, languageCode?: string): Promise<string> {
	const res = await fetch(`${ASSEMBLY_BASE_URL}/transcript`, {
		method: "POST",
		headers: {
			Authorization: apiKey,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			audio_url: audioUrl,
			language_code: languageCode ?? undefined,
			speaker_labels: false,
			punctuate: true,
			format_text: true,
		}),
	})
	if (!res.ok) {
		const text = await res.text()
		throw new Error(`AssemblyAI job start failed: ${text}`)
	}
	const data = (await res.json()) as AssemblyAITranscript
	return data.id
}


async function getAssemblyJob(id: string, apiKey: string): Promise<AssemblyAITranscript> {
	const res = await fetch(`${ASSEMBLY_BASE_URL}/transcript/${id}`, {
		headers: { Authorization: apiKey },
	})
	if (!res.ok) {
		const text = await res.text()
		throw new Error(`AssemblyAI job fetch failed: ${text}`)
	}
	return (await res.json()) as AssemblyAITranscript
}

function isYouTube(url: string): boolean {
	return /youtu(be\.be|be\.com)/i.test(url)
}

function isAudioUrl(url: string): boolean {
	return /\.(mp3|m4a|wav|aac|flac|webm|mp4)(\?|$)/i.test(url) || url.includes("googlevideo.com")
}

export const AssemblyAIProvider: TranscriptProvider = {
	name: "assemblyai",
	canHandle(request) {
		return Boolean(request.allowPaid) && 
			   (isYouTube(request.url) || isAudioUrl(request.url)) && 
			   Boolean(process.env.ASSEMBLYAI_API_KEY)
	},
	async getTranscript(request: TranscriptRequest): Promise<TranscriptResponse> {
		const apiKey = process.env.ASSEMBLYAI_API_KEY
		if (!apiKey) return { success: false, error: "AssemblyAI API key not configured", provider: this.name }
		try {
			const jobId = await startAssemblyJob(request.url, apiKey, request.lang)
			const timeoutMs = 20000
			const start = Date.now()
			while (Date.now() - start < timeoutMs) {
				const job = await getAssemblyJob(jobId, apiKey)
				if (job.status === "completed" && job.text) {
					return { success: true, transcript: job.text, provider: this.name, meta: { jobId } }
				}
				if (job.status === "error") {
					return { success: false, error: job.error || "AssemblyAI job failed", provider: this.name, meta: { jobId } }
				}
				await new Promise(r => setTimeout(r, 1500))
			}
			return { success: false, error: "AssemblyAI job in progress; retry later", provider: this.name }
		} catch (error) {
			return { success: false, error: error instanceof Error ? error.message : "AssemblyAI error", provider: this.name }
		}
	},
}
