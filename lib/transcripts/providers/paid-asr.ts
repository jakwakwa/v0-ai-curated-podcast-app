import type { TranscriptProvider, TranscriptRequest, TranscriptResponse } from "../types"
import { transcribeYouTubeVideo } from "@/lib/custom-transcriber"

export const PaidAsrProvider: TranscriptProvider = {
	name: "paid-asr",
	canHandle(request) {
		// Allow as a fallback if explicitly allowed
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
				return { success: false, error: result.error || "ASR failed" , provider: this.name }
			}
			return { success: false, error: "ASR provider not configured for this source", provider: this.name }
		} catch (error) {
			return { success: false, error: error instanceof Error ? error.message : "ASR error", provider: this.name }
		}
	},
}