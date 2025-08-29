import type { TranscriptProvider, TranscriptRequest, TranscriptResponse } from "../types"
import { getYouTubeTranscriptText } from "@/lib/youtube"

export const YouTubeCaptionsProvider: TranscriptProvider = {
	name: "youtube-captions",
	canHandle(request) {
		return /youtu(be\.be|be\.com)/i.test(request.url)
	},
	async getTranscript(request: TranscriptRequest): Promise<TranscriptResponse> {
		try {
			const transcript = await getYouTubeTranscriptText(request.url, request.lang)
			return { success: true, transcript, provider: this.name }
		} catch (error) {
			return { success: false, error: error instanceof Error ? error.message : "YouTube captions failed", provider: this.name }
		}
	},
}