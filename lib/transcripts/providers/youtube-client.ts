import type { TranscriptProvider, TranscriptRequest, TranscriptResponse } from "../types"

export const YouTubeClientProvider: TranscriptProvider = {
	name: "youtube-client",
	canHandle(request) {
		return /youtu(be\.be|be\.com)/i.test(request.url)
	},
	async getTranscript(_request: TranscriptRequest): Promise<TranscriptResponse> {
		return {
			success: false,
			error: "Client-side YouTube captions should be attempted in browser context",
			provider: this.name,
		}
	},
}