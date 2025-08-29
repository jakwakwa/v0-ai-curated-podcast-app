import type { TranscriptProvider, TranscriptRequest, TranscriptResponse } from "../types"
import { incrementPaidServiceUsage } from "@/lib/usage/service-usage"

interface AssemblyAiStartResponse {
  id: string
  status?: string
}

interface AssemblyAiStatusResponse {
  id: string
  status: string
  text?: string
  error?: string
}

function looksLikeUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

async function startAssemblyAiJob(audioUrl: string, apiKey: string): Promise<string> {
  incrementPaidServiceUsage("assemblyai")
  const res = await fetch("https://api.assemblyai.com/v2/transcript", {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ audio_url: audioUrl }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`AssemblyAI job start failed: ${text}`)
  }
  const data = (await res.json()) as AssemblyAiStartResponse
  return data.id
}

async function getAssemblyAiStatus(jobId: string, apiKey: string): Promise<AssemblyAiStatusResponse> {
  const res = await fetch(`https://api.assemblyai.com/v2/transcript/${jobId}`, {
    headers: { Authorization: apiKey },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`AssemblyAI status failed: ${text}`)
  }
  return (await res.json()) as AssemblyAiStatusResponse
}

export const AssemblyAiProvider: TranscriptProvider = {
  name: "assemblyai",
  canHandle(request) {
    // Paid provider enabled only when allowPaid is true and URL is valid
    if (!request.allowPaid) return false
    return looksLikeUrl(request.url)
  },
  async getTranscript(request: TranscriptRequest): Promise<TranscriptResponse> {
    const apiKey = process.env.ASSEMBLYAI_API_KEY
    if (!apiKey) return { success: false, error: "AssemblyAI API key not configured", provider: this.name }
    try {
      const jobId = await startAssemblyAiJob(request.url, apiKey)
      // Short polling (webhooks preferred in production)
      const timeoutMs = 20000
      const start = Date.now()
      while (Date.now() - start < timeoutMs) {
        const status = await getAssemblyAiStatus(jobId, apiKey)
        if (status.status === "completed") {
          const transcript = typeof status.text === "string" ? status.text : undefined
          if (transcript && transcript.trim().length > 0) {
            return { success: true, transcript, provider: this.name, meta: { jobId } }
          }
          return { success: false, error: "AssemblyAI returned empty transcript", provider: this.name, meta: { jobId } }
        }
        if (status.status === "error") {
          return { success: false, error: status.error || "AssemblyAI job failed", provider: this.name, meta: { jobId } }
        }
        await new Promise(r => setTimeout(r, 1500))
      }
      return { success: false, error: "AssemblyAI job in progress; retry later", provider: this.name }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "AssemblyAI error", provider: this.name }
    }
  },
}

