import { z } from "zod"
import { writeEpisodeDebugLog } from "@/lib/debug-logger"
import { prisma } from "@/lib/prisma"
import { searchEpisodeAudioViaApple, searchEpisodeAudioViaListenNotes } from "@/lib/transcripts/search"
import { searchYouTubeByMetadata } from "@/lib/transcripts/search-youtube"
import { inngest } from "./client"

type MetadataPayload = {
	userEpisodeId: string
	title: string
	podcastName?: string
	publishedAt?: string
	youtubeUrl?: string
	lang?: string
	generationMode?: "single" | "multi"
	voiceA?: string
	voiceB?: string
}

interface AssemblyAITranscript {
	id: string
	status: "queued" | "processing" | "completed" | "error" | string
	text?: string
	error?: string
}

const ASSEMBLY_BASE_URL = "https://api.assemblyai.com/v2"

async function _startAssemblyJob(audioUrl: string, apiKey: string, languageCode?: string): Promise<string> {
	const res = await fetch(`${ASSEMBLY_BASE_URL}/transcript`, {
		method: "POST",
		headers: { Authorization: apiKey, "Content-Type": "application/json" },
		body: JSON.stringify({ audio_url: audioUrl, language_code: languageCode ?? undefined, speaker_labels: false, punctuate: true, format_text: true }),
	})
	if (!res.ok) throw new Error(`AssemblyAI job start failed: ${await res.text()}`)
	const data = (await res.json()) as AssemblyAITranscript
	return data.id
}

async function _getAssemblyJob(id: string, apiKey: string): Promise<AssemblyAITranscript> {
	const res = await fetch(`${ASSEMBLY_BASE_URL}/transcript/${id}`, { headers: { Authorization: apiKey } })
	if (!res.ok) throw new Error(`AssemblyAI job fetch failed: ${await res.text()}`)
	return (await res.json()) as AssemblyAITranscript
}

// --- Audio resolution helpers -------------------------------------------------
function _isYouTubeUrl(url: string): boolean {
	return /youtu(be\.be|be\.com)/i.test(url);
}

function _isDirectAudioUrl(url: string): boolean {
	return (/(\.(mp3|m4a|wav|aac|flac|webm|mp4)(\?|$))/i.test(url) || (() => {
        try {
            const { hostname, protocol } = new URL(url)
            if (protocol !== "http:" && protocol !== "https:") return false
            const host = hostname.toLowerCase()
            return host === "googlevideo.com" || host.endsWith(".googlevideo.com")
        } catch {
            return false
        }
    })());
}

// NOTE: duplicate YouTube extraction removed; use shared util if needed elsewhere

async function _uploadToAssembly(srcUrl: string, apiKey: string): Promise<string> {
	const source = await fetch(srcUrl, { headers: { "User-Agent": "Mozilla/5.0" } })
	if (!(source.ok && source.body)) throw new Error(`Failed to download source audio (${source.status})`)
	const bodyStream = source.body
	if (!bodyStream) throw new Error("Missing response body stream")
	const uploaded = await fetch(`${ASSEMBLY_BASE_URL}/upload`, {
		method: "POST",
		headers: { Authorization: apiKey, "Content-Type": "application/octet-stream" },
		// @ts-expect-error Node.js fetch streaming request bodies require duplex property
		duplex: "half",
		body: bodyStream,
	})

	if (!uploaded.ok) throw new Error(`AssemblyAI upload failed: ${await uploaded.text()}`)
	const json = (await uploaded.json()) as { upload_url?: string }
	if (!json.upload_url) throw new Error("AssemblyAI upload succeeded without upload_url")
	return json.upload_url
}

export const transcribeFromMetadata = inngest.createFunction(
	{ id: "transcribe-from-metadata", name: "Transcribe From Metadata", retries: 2 },
	{ event: "user.episode.metadata.requested" },
	async ({ event, step }) => {
		const payload = event.data as MetadataPayload
		const { userEpisodeId, title, podcastName, publishedAt, youtubeUrl, lang, generationMode, voiceA, voiceB } = payload

		const inputSchema = z.object({
			userEpisodeId: z.string().min(1),
			title: z.string().min(2),
			podcastName: z.string().optional(),
			publishedAt: z.string().optional(),
			youtubeUrl: z.string().url().optional(),
			lang: z.string().optional(),
		})
		const parsed = inputSchema.safeParse({ userEpisodeId, title, podcastName, publishedAt, youtubeUrl, lang })
		if (!parsed.success) throw new Error(parsed.error.message)

		// 1) Mark processing
		await step.run("mark-processing", async () => {
			await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { status: "PROCESSING" } })
			await writeEpisodeDebugLog(userEpisodeId, { step: "status", status: "start", message: "PROCESSING" })
		})

		// 2) Search audio/video via Provider Pool with retry window (honor user-provided YouTube URL if present)
		const resolutionWindowMinutes = Number(process.env.RESOLUTION_WINDOW_MINUTES || 60)
		const intervalSeconds = Number(process.env.RESOLUTION_SWEEP_INTERVAL_SECONDS || 180) // 3 minutes
		const maxSweeps = Math.max(1, Math.ceil((resolutionWindowMinutes * 60) / intervalSeconds))

		let audioUrl: string | null = null
		if (youtubeUrl) {
			await writeEpisodeDebugLog(userEpisodeId, { step: "resolve-audio", status: "info", message: "user provided YouTube URL", meta: { youtubeUrl } })
			audioUrl = youtubeUrl
		}
		for (let attempt = 1; attempt <= maxSweeps; attempt++) {
			if (audioUrl) break
			audioUrl = await step.run(`search-audio-sweep-${attempt}`, async () => {
				const [ln, ap, yt] = await Promise.all([
					searchEpisodeAudioViaListenNotes({ title, podcastName, publishedAt }),
					searchEpisodeAudioViaApple({ title, podcastName, publishedAt }),
					searchYouTubeByMetadata({ title, podcastName, publishedAt, dateBufferDays: 14 }),
				])
				const winner = ln?.audioUrl || ap?.audioUrl || yt || null
				await writeEpisodeDebugLog(userEpisodeId, {
					step: "resolve-audio",
					status: winner ? "success" : "info",
					message: winner ? `resolved on attempt ${attempt}` : `no result on attempt ${attempt}`,
					meta: {
						attempt,
						maxSweeps,
						youtube: Boolean(yt),
						listenNotes: ln?.audioUrl ?? false,
						apple: ap?.audioUrl ?? false,
						winner,
					},
				})
				return winner
			})
			if (audioUrl) break
			if (attempt < maxSweeps) {
				// @ts-expect-error - step.sleep is provided by Inngest runtime
				await step.sleep(`${intervalSeconds}s`)
			}
		}

		if (!audioUrl) {
			await step.run("mark-failed-no-audio", async () => {
				await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { status: "FAILED" } })
				await writeEpisodeDebugLog(userEpisodeId, { step: "resolve-audio", status: "fail", message: "No audio found" })
			})
			return { message: "No audio found for metadata", userEpisodeId }
		}

		// Store the resolved url (direct audio or YouTube) for traceability
		await step.run("store-audio-url", async () => {
			await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { youtube_url: audioUrl } })
			await writeEpisodeDebugLog(userEpisodeId, { step: "resolve-audio", status: "success", meta: { audioUrl } })
		})

		// 3) Dispatch event-driven saga and let it orchestrate providers and fallbacks
		const jobId = `ue-${userEpisodeId}-${Date.now()}`
		await step.sendEvent("start-saga", {
			name: "transcription.job.requested",
			data: { jobId, userEpisodeId, srcUrl: audioUrl, lang, generationMode, voiceA, voiceB },
		})

		await writeEpisodeDebugLog(userEpisodeId, { step: "saga", status: "info", meta: { jobId, state: "queued" } })
		return { message: "Transcription saga dispatched", userEpisodeId, jobId }
	}
)

export type { MetadataPayload }
