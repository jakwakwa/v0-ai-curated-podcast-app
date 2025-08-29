import { transcribeYouTubeVideo } from "@/lib/custom-transcriber"
import type { TranscriptProvider, TranscriptRequest, TranscriptResponse } from "../types"

export const PaidAsrProvider: TranscriptProvider = {
	name: "paid-asr",
	canHandle(request) {
		// Allow as a fallback if explicitly allowed; disable on Vercel by default for YouTube unless opt-in
		const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true"
		const enableServerYtdl = process.env.ENABLE_SERVER_YTDL === "true"
		if (/youtu(be\.be|be\.com)/i.test(request.url)) {
			// On Vercel, avoid Whisper/ytdl unless explicitly enabled
			return Boolean(request.allowPaid) && (!isVercel || enableServerYtdl)
		}
		return Boolean(request.allowPaid)
	},
	async getTranscript(request: TranscriptRequest): Promise<TranscriptResponse> {
		try {
			// Temporary: if it's a YouTube URL and we have Whisper available, use it
			if (/youtu(be\.be|be\.com)/i.test(request.url)) {
				const result = await transcribeYouTubeVideo(request.url)
				if (result.success && result.transcript) {
					return { success: true, transcript: result.transcript, provider: this.name, meta: { audioSize: result.audioSize } }
				}
				return { success: false, error: result.error || "ASR failed", provider: this.name }
			}
			return { success: false, error: "ASR provider not configured for this source", provider: this.name }
		} catch (error) {
			return { success: false, error: error instanceof Error ? error.message : "ASR error", provider: this.name }
		}
	},
}
