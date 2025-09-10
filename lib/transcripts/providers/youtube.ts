import type { TranscriptProvider, TranscriptRequest, TranscriptResponse } from "../types"
import { getYouTubeTranscriptText } from "@/lib/youtube-safe"

export const YouTubeCaptionsProvider: TranscriptProvider = {
	name: "youtube-captions",
	canHandle(request) {
		// Disabled on Vercel by default due to anti-bot; guard with env flag
		const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true"
		const enableServerYtdl = process.env.ENABLE_SERVER_YTDL === "true"
		return /youtu(be\.be|be\.com)/i.test(request.url) && (!isVercel || enableServerYtdl);
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