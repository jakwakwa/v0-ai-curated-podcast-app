import { z } from "zod"
import { inngest } from "./client"
import { prisma } from "@/lib/prisma"
import { searchEpisodeAudioViaListenNotes, searchEpisodeAudioViaApple } from "@/lib/transcripts/search"
import { searchYouTubeByMetadata } from "@/lib/transcripts/search-youtube"
import { transcribeWithGeminiFromUrl } from "@/lib/transcripts/gemini-video"
import { writeEpisodeDebugLog, writeEpisodeDebugReport } from "@/lib/debug-logger"

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
  const res = await fetch(`${ASSEMBLY_BASE_URL}/transcripts`, {
    method: "POST",
    headers: { Authorization: apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ audio_url: audioUrl, language_code: languageCode ?? undefined, speaker_labels: false, punctuate: true, format_text: true }),
  })
  if (!res.ok) throw new Error(`AssemblyAI job start failed: ${await res.text()}`)
  const data = (await res.json()) as AssemblyAITranscript
  return data.id
}

async function getAssemblyJob(id: string, apiKey: string): Promise<AssemblyAITranscript> {
  const res = await fetch(`${ASSEMBLY_BASE_URL}/transcripts/${id}`, { headers: { Authorization: apiKey } })
  if (!res.ok) throw new Error(`AssemblyAI job fetch failed: ${await res.text()}`)
  return (await res.json()) as AssemblyAITranscript
}

export const transcribeFromMetadata = inngest.createFunction(
  { id: "transcribe-from-metadata", name: "Transcribe From Metadata", retries: 2 },
  { event: "user.episode.metadata.requested" },
  async ({ event, step }) => {
    const payload = event.data as MetadataPayload
    const { userEpisodeId, title, podcastName, publishedAt, youtubeUrl, lang, generationMode, voiceA, voiceB } = payload

    const inputSchema = z.object({ userEpisodeId: z.string().min(1), title: z.string().min(2), podcastName: z.string().optional(), publishedAt: z.string().optional(), youtubeUrl: z.string().url().optional(), lang: z.string().optional() })
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
            listenNotes: ln?.audioUrl ? true : false,
            apple: ap?.audioUrl ? true : false,
            youtube: yt ? true : false,
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
        return await startAssemblyJob(audioUrl, assemblyKey)
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
    await step.sendEvent(
      "user.episode.forward",
      { name: generationMode === "multi" ? "user.episode.generate.multi.requested" : "user.episode.generate.requested", data: { userEpisodeId, voiceA, voiceB } }
    )

    await step.run("write-final-report", async () => {
      const report = `# User Episode Run Report\n\n- Episode ID: ${userEpisodeId}\n- Title: ${title}\n- Podcast: ${podcastName ?? "-"}\n- Date: ${publishedAt ?? "-"}\n\n## Transcription\nProviders attempted: AssemblyAI → Rev.ai → Gemini\n\nTranscript length: ${transcriptText?.length ?? 0} chars\n\nNext step: ${generationMode === "multi" ? "Multi-speaker generation" : "Single-speaker generation"}\n`
      await writeEpisodeDebugReport(userEpisodeId, report)
    })

    return { message: "Transcription completed and generation triggered", userEpisodeId }
  }
)

export type { MetadataPayload }

