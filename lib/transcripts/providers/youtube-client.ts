import type { TranscriptProvider, TranscriptRequest, TranscriptResponse } from "../types"

export const YouTubeClientProvider: TranscriptProvider = {
	name: "youtube-client",
	canHandle(request) {
		return /youtu(be\.be|be\.com)/i.test(request.url)
	},
	async getTranscript(_request: TranscriptRequest): Promise<TranscriptResponse> {
		// This provider coordinates client-side extraction
		// It returns a special response that tells the frontend to extract captions
		return {
			success: false,
			error: "Client-side YouTube captions extraction required",
			provider: this.name,
			meta: {
				requiresClientExtraction: true,
				extractionMethod: "browser-captions",
				instructions: "Use browser-based YouTube caption extraction to avoid server-side blocking"
			}
		}
	},
}