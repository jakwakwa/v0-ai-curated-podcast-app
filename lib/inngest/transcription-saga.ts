import { writeEpisodeDebugLog, writeEpisodeDebugReport } from "@/lib/debug-logger"
import { inngest } from "@/lib/inngest/client"
import { prisma } from "@/lib/prisma"
import { preflightProbe } from "./utils/preflight"
import { ProviderSucceededSchema, TranscriptionRequestedSchema } from "./utils/results"

// YouTube audio extraction helper
async function extractYouTubeAudioUrl(videoUrl: string): Promise<string | null> {
	const videoId = (videoUrl.match(/(?:v=|\/)([\w-]{11})/) || [])[1]
	if (!videoId) return null

	const youtubeApiKey = process.env.YOUTUBE_API_KEY
	if (!youtubeApiKey) {
		console.warn("YouTube API key not available for audio extraction")
		return null
	}

	try {
		const response = await fetch(`https://www.youtube.com/youtubei/v1/player?key=${youtubeApiKey}`, {
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
	} catch (error) {
		console.warn("YouTube API extraction failed:", error)
	}

	return null
}

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
} as const

export const transcriptionCoordinator = inngest.createFunction(
	{ id: "transcription-coordinator", name: "Transcription Coordinator", retries: 0 },
	{ event: Events.JobRequested },
	async ({ event, step }) => {
		const input = TranscriptionRequestedSchema.parse(event.data)
		const { jobId, userEpisodeId, srcUrl, lang, generationMode, voiceA, voiceB } = input

		const startedAt = Date.now()

		await step.run("mark-processing", async () => {
			await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { status: "PROCESSING", youtube_url: srcUrl } })
			await writeEpisodeDebugLog(userEpisodeId, { step: "status", status: "start", message: "PROCESSING" })
		})

		const probe = await step.run("preflight-probe", async () => await preflightProbe(srcUrl))
		await writeEpisodeDebugLog(userEpisodeId, {
			step: "preflight",
			status: probe.ok ? "success" : "fail",
			meta: probe.ok ? probe.value : probe,
		})

		// Extract audio URL from YouTube if needed
		let processedSrcUrl = srcUrl
		const isYouTube = /youtu(be\.be|be\.com)/i.test(srcUrl)
		if (isYouTube) {
			processedSrcUrl = await step.run("extract-youtube-audio", async () => {
				const extracted = await extractYouTubeAudioUrl(srcUrl)
				if (extracted) {
					await writeEpisodeDebugLog(userEpisodeId, {
						step: "youtube-extract",
						status: "success",
						message: "Extracted audio URL from YouTube",
						meta: { original: srcUrl, extracted }
					})
					return extracted
				} else {
					await writeEpisodeDebugLog(userEpisodeId, {
						step: "youtube-extract",
						status: "fail",
						message: "Failed to extract audio URL from YouTube, using original URL",
						meta: { original: srcUrl }
					})
					return srcUrl
				}
			})
		}

		// Kick off primary provider with processed URL
		await step.sendEvent("start-assemblyai", {
			name: Events.ProviderStart.AssemblyAI,
			data: { jobId, userEpisodeId, srcUrl: processedSrcUrl, provider: "assemblyai", lang },
		})

		// Wait for success; if timeout or failure without success, trigger fallbacks
		const firstWindow = Number(process.env.PROVIDER_A_WINDOW_SECONDS || 55)
		const successEvent = await step.waitForEvent("wait-aai", {
			event: Events.Succeeded,
			timeout: `${firstWindow}s`,
			if: `event.data.jobId == "${jobId}"`,
		})

		let successEvent2: typeof successEvent | null = null
		if (!successEvent) {
			// Start fallbacks (in parallel) with processed URL
			await step.sendEvent("start-revai", {
				name: Events.ProviderStart.RevAi,
				data: { jobId, userEpisodeId, srcUrl: processedSrcUrl, provider: "revai", lang },
			})
			await step.sendEvent("start-gemini", {
				name: Events.ProviderStart.Gemini,
				data: { jobId, userEpisodeId, srcUrl: processedSrcUrl, provider: "gemini", lang },
			})

			// Wait for anyone to succeed within total budget without exceeding route max
			const totalWindow = Number(process.env.PROVIDER_TOTAL_WINDOW_SECONDS || 240)
			const elapsedSec = Math.floor((Date.now() - startedAt) / 1000)
			const remaining = Math.max(0, totalWindow - elapsedSec)
			if (remaining > 0) {
				successEvent2 = await step.waitForEvent("wait-fallbacks", {
					event: Events.Succeeded,
					timeout: `${remaining}s`,
					if: `event.data.jobId == "${jobId}"`,
				})
			}
			if (!successEvent2) {
				await step.run("mark-failed", async () => {
					await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { status: "FAILED" } })
					await writeEpisodeDebugLog(userEpisodeId, { step: "transcription", status: "fail", message: "All providers failed or timed out" })
				})
				await step.sendEvent("finalize-failed", {
					name: Events.Finalized,
					data: { jobId, userEpisodeId, status: "failed" },
				})
				return { ok: false, jobId }
			}
		}

		// Read the winning success (either successEvent or successEvent2)
		const winning = successEvent ?? successEvent2
		if (!winning) {
			await step.run("mark-failed-missing-winner", async () => {
				await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { status: "FAILED" } })
				await writeEpisodeDebugLog(userEpisodeId, { step: "transcription", status: "fail", message: "No success event captured" })
			})
			await step.sendEvent("finalize-failed-no-winner", { name: Events.Finalized, data: { jobId, userEpisodeId, status: "failed" } })
			return { ok: false, jobId }
		}
		const successPayload = ProviderSucceededSchema.parse(winning.data)
		const transcriptText = successPayload.transcript

		await step.run("store-transcript", async () => {
			await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { transcript: transcriptText } })
		})

		await step.sendEvent("forward-generation", {
			name: generationMode === "multi" ? "user.episode.generate.multi.requested" : "user.episode.generate.requested",
			data: { userEpisodeId, voiceA, voiceB },
		})

		await step.run("write-final-report", async () => {
			const report = `# Transcription Saga Report\n- job: ${jobId}\n- provider: ${successPayload.provider}\n- transcriptChars: ${transcriptText.length}\n`
			await writeEpisodeDebugReport(userEpisodeId, report)
		})

		await step.sendEvent("finalize-success", {
			name: Events.Finalized,
			data: { jobId, userEpisodeId, status: "succeeded", provider: successPayload.provider },
		})

		return { ok: true, jobId }
	}
)
