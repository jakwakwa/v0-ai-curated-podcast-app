import { writeEpisodeDebugLog, writeEpisodeDebugReport } from "@/lib/debug-logger"
import { ensureBucketName, storeUrlInGCS } from "@/lib/gcs"
import { inngest } from "@/lib/inngest/client"
import { prisma } from "@/lib/prisma"
import { preflightProbe } from "./utils/preflight"
import { ProviderSucceededSchema, TranscriptionRequestedSchema } from "./utils/results"

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

		// Download-once: store source audio in GCS for non-Gemini providers; Gemini needs the original YouTube URL
		const permanentUrl = await step.run("download-and-store-audio", async () => {
			const _bucket = ensureBucketName()
			const objectName = `transcripts/${userEpisodeId}/source-audio`
			const stored = await storeUrlInGCS(srcUrl, objectName)
			return stored
		})
		await writeEpisodeDebugLog(userEpisodeId, { step: "storage", status: "success", message: "Stored source audio", meta: { url: permanentUrl } })

		// Kick off primary provider (Gemini first)
		await step.sendEvent("start-gemini", {
			name: Events.ProviderStart.Gemini,
			// Important: Gemini must receive the original source URL (e.g., YouTube), not the GCS mirror
			data: { jobId, userEpisodeId, srcUrl, provider: "gemini", lang },
		})

		// Wait for success; if timeout or failure without success, trigger fallbacks
		const firstWindow = Number(process.env.PROVIDER_A_WINDOW_SECONDS || 55)
		const successEvent = await step.waitForEvent("wait-gemini", {
			event: Events.Succeeded,
			timeout: `${firstWindow}s`,
			if: `event.data.jobId == "${jobId}"`,
		})

		let successEvent2: typeof successEvent | null = null
		if (!successEvent) {
			// Start fallbacks (AssemblyAI and RevAi in parallel)
			await step.sendEvent("start-assemblyai", {
				name: Events.ProviderStart.AssemblyAI,
				data: { jobId, userEpisodeId, srcUrl: permanentUrl, provider: "assemblyai", lang },
			})
			await step.sendEvent("start-revai", {
				name: Events.ProviderStart.RevAi,
				data: { jobId, userEpisodeId, srcUrl: permanentUrl, provider: "revai", lang },
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
