import { z } from "zod"
import { writeEpisodeDebugLog, writeEpisodeDebugReport } from "@/lib/debug-logger"
import { prisma } from "@/lib/prisma"
import { transcribeWithGeminiFromUrl } from "@/lib/transcripts/gemini-video"
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

async function startAssemblyJob(audioUrl: string, apiKey: string, languageCode?: string): Promise<string> {
	const res = await fetch(`${ASSEMBLY_BASE_URL}/transcript`, {
		method: "POST",
		headers: { Authorization: apiKey, "Content-Type": "application/json" },
		body: JSON.stringify({ audio_url: audioUrl, language_code: languageCode ?? undefined, speaker_labels: false, punctuate: true, format_text: true }),
	})
	if (!res.ok) throw new Error(`AssemblyAI job start failed: ${await res.text()}`)
	const data = (await res.json()) as AssemblyAITranscript
	return data.id
}

async function getAssemblyJob(id: string, apiKey: string): Promise<AssemblyAITranscript> {
	const res = await fetch(`${ASSEMBLY_BASE_URL}/transcript/${id}`, { headers: { Authorization: apiKey } })
	if (!res.ok) throw new Error(`AssemblyAI job fetch failed: ${await res.text()}`)
	return (await res.json()) as AssemblyAITranscript
}

// --- Audio resolution helpers -------------------------------------------------
function isYouTubeUrl(url: string): boolean {
	return /youtu(be\.be|be\.com)/i.test(url)
}

function isDirectAudioUrl(url: string): boolean {
	return /(\.(mp3|m4a|wav|aac|flac|webm|mp4)(\?|$))/i.test(url) || (() => {
		try {
			const { hostname, protocol } = new URL(url)
			if (protocol !== "http:" && protocol !== "https:") return false
			const host = hostname.toLowerCase()
			return host === "googlevideo.com" || host.endsWith(".googlevideo.com")
		} catch {
			return false
		}
	})()
}

async function extractYouTubeAudioUrl(videoUrl: string): Promise<string | null> {
	// Attempt to derive a direct audio stream URL via YouTube player API
	const videoId = (videoUrl.match(/(?:v=|\/)([\w-]{11})/) || [])[1]
	try {
		const response = await fetch("https://www.youtube.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8", {
			method: "POST",
			headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0", Referer: "https://www.youtube.com/" },
			body: JSON.stringify({ context: { client: { clientName: "WEB", clientVersion: "2.20240101.00.00" } }, videoId }),
		})
		if (response.ok) {
			const data = await response.json()
			const formats = data?.streamingData?.adaptiveFormats || []
			const audioFormats = formats.filter((f: { mimeType?: string; url?: string }) => f?.mimeType?.includes("audio") && f?.url)
			if (audioFormats.length > 0) {
				const preferred = audioFormats.find((f: { mimeType?: string }) => f?.mimeType?.includes("audio/webm") || f?.mimeType?.includes("audio/mp4")) || audioFormats[0]
				return preferred.url as string
			}
		}
	} catch {}

	// Optional RapidAPI fallback if configured
	const rapidApiKey = process.env.RAPIDAPI_KEY
	if (rapidApiKey) {
		try {
			const resp = await fetch(`https://youtube-video-info1.p.rapidapi.com/youtube_video_info?url=${encodeURIComponent(videoUrl)}`, {
				headers: { "X-RapidAPI-Key": rapidApiKey, "X-RapidAPI-Host": "youtube-video-info1.p.rapidapi.com" },
			})
			if (resp.ok) {
				const data = await resp.json()
				if (data?.audio_url) return data.audio_url as string
			}
		} catch {}
	}

	return null
}

async function uploadToAssembly(srcUrl: string, apiKey: string): Promise<string> {
	const source = await fetch(srcUrl)
	if (!(source.ok && source.body)) throw new Error(`Failed to download source audio (${source.status})`)
	const uploaded = await fetch(`${ASSEMBLY_BASE_URL}/upload`, {
		method: "POST",
		headers: { Authorization: apiKey, "Content-Type": "application/octet-stream" },
		body: source.body as unknown as BodyInit,
		duplex: "half",
	} as RequestInit) // <-- Cast the entire options object)

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
						listenNotes: ln?.audioUrl ?? false,
						apple: ap?.audioUrl ?? false,
						youtube: yt ?? false,
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

		// 3) Start paid ASR job (prefer AssemblyAI if available)
		const assemblyKey = process.env.ASSEMBLYAI_API_KEY
		let transcriptText: string | null = null

		if (assemblyKey) {
			const jobId = await step.run("assemblyai-start", async () => {
				await writeEpisodeDebugLog(userEpisodeId, { step: "assemblyai", status: "start" })
				let resolvedUrl = audioUrl
				// If it's a YouTube page, resolve a direct audio stream first
				if (isYouTubeUrl(resolvedUrl)) {
					const extracted = await extractYouTubeAudioUrl(resolvedUrl)
					if (extracted) {
						resolvedUrl = extracted
					} else {
						throw new Error("Failed to extract audio from YouTube URL")
					}
				}
				// If not a clearly direct audio URL, proxy-upload to AssemblyAI to ensure accessibility
				let submitUrl = resolvedUrl
				if (!isDirectAudioUrl(resolvedUrl)) {
					submitUrl = await uploadToAssembly(resolvedUrl, assemblyKey)
				}
				return await startAssemblyJob(submitUrl, assemblyKey, lang)
			})

			// Poll up to ~90 minutes total, sleeping 60s between checks
			for (let i = 0; i < 90; i++) {
				const job = await step.run("assemblyai-poll", async () => {
					return await getAssemblyJob(jobId as string, assemblyKey)
				})
				if (job.status === "completed" && job.text) {
					transcriptText = job.text
					await writeEpisodeDebugLog(userEpisodeId, { step: "assemblyai", status: "success", meta: { jobId } })
					break
				}
				if (job.status === "error") {
					await writeEpisodeDebugLog(userEpisodeId, { step: "assemblyai", status: "fail", message: job.error || "AssemblyAI job failed", meta: { jobId } })
					throw new Error(job.error || "AssemblyAI job failed")
				}
				// Wait 60 seconds before next poll
				// @ts-expect-error - step.sleep is provided by Inngest runtime
				await step.sleep("60s")
			}
		}

		// If AssemblyAI not configured or no result, try Rev.ai
		if (!transcriptText && process.env.REVAI_API_KEY) {
			// Inline minimal Rev.ai flow to avoid provider coupling
			const startRev = async () => {
				const res = await fetch("https://api.rev.ai/speechtotext/v1/jobs", {
					method: "POST",
					headers: { Authorization: `Bearer ${process.env.REVAI_API_KEY}`, "Content-Type": "application/json" },
					body: JSON.stringify({ media_url: audioUrl, metadata: "auto-generated by metadata flow" }),
				})
				if (!res.ok) throw new Error(`Rev.ai job start failed: ${await res.text()}`)
				return ((await res.json()) as { id: string }).id
			}
			const getStatus = async (id: string) => {
				const res = await fetch(`https://api.rev.ai/speechtotext/v1/jobs/${id}`, { headers: { Authorization: `Bearer ${process.env.REVAI_API_KEY}` } })
				if (!res.ok) throw new Error(`Rev.ai job status failed: ${await res.text()}`)
				return (await res.json()) as { status: string }
			}
			const getTranscript = async (id: string) => {
				const res = await fetch(`https://api.rev.ai/speechtotext/v1/jobs/${id}/transcript`, { headers: { Authorization: `Bearer ${process.env.REVAI_API_KEY}` } })
				if (!res.ok) throw new Error(`Rev.ai transcript fetch failed: ${await res.text()}`)
				return await res.text()
			}

			const jobId = await step.run("revai-start", async () => {
				await writeEpisodeDebugLog(userEpisodeId, { step: "revai", status: "start" })
				return await startRev()
			})

			for (let i = 0; i < 90; i++) {
				const status = await step.run("revai-poll", async () => await getStatus(jobId as string))
				if (status.status === "transcribed" || status.status === "completed") {
					transcriptText = await step.run("revai-fetch", async () => await getTranscript(jobId as string))
					await writeEpisodeDebugLog(userEpisodeId, { step: "revai", status: "success", meta: { jobId } })
					break
				}
				if (status.status === "failed") {
					await writeEpisodeDebugLog(userEpisodeId, { step: "revai", status: "fail", message: "Rev.ai job failed", meta: { jobId } })
					throw new Error("Rev.ai job failed")
				}
				// @ts-expect-error - step.sleep is provided by Inngest runtime
				await step.sleep("60s")
			}
		}

		// 3c) Try Gemini video understanding as last resort (if enabled)
		if (!transcriptText) {
			transcriptText = await step.run("gemini-video-transcribe", async () => {
				const t = await transcribeWithGeminiFromUrl(audioUrl)
				await writeEpisodeDebugLog(userEpisodeId, { step: "gemini", status: t ? "success" : "fail" })
				return t
			})
		}

		if (!transcriptText) {
			await step.run("mark-failed-no-transcript", async () => {
				await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { status: "FAILED" } })
				await writeEpisodeDebugLog(userEpisodeId, { step: "transcription", status: "fail", message: "All providers failed" })
			})
			return { message: "Transcription not completed within window", userEpisodeId }
		}

		// 4) Store transcript
		await step.run("store-transcript", async () => {
			await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { transcript: transcriptText } })
		})

		// 5) Trigger standard generation workflow
		await step.sendEvent("user.episode.forward", {
			name: generationMode === "multi" ? "user.episode.generate.multi.requested" : "user.episode.generate.requested",
			data: { userEpisodeId, voiceA, voiceB },
		})

		await step.run("write-final-report", async () => {
			const report = `# User Episode Run Report\n\n- Episode ID: ${userEpisodeId}\n- Title: ${title}\n- Podcast: ${podcastName ?? "-"}\n- Date: ${publishedAt ?? "-"}\n\n## Transcription\nProviders attempted: AssemblyAI → Rev.ai → Gemini\n\nTranscript length: ${transcriptText?.length ?? 0} chars\n\nNext step: ${generationMode === "multi" ? "Multi-speaker generation" : "Single-speaker generation"}\n`
			await writeEpisodeDebugReport(userEpisodeId, report)
		})

		return { message: "Transcription completed and generation triggered", userEpisodeId }
	}
)

export type { MetadataPayload }
