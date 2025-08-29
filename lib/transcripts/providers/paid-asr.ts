import type { TranscriptProvider, TranscriptRequest, TranscriptResponse } from "../types"

export const PaidAsrProvider: TranscriptProvider = {
	name: "paid-asr",
	canHandle(_request) {
		// Disable this provider in favor of the new orchestrated approach
		// This provider was causing the ytdl-core issues on Vercel
		return false
	},
	async getTranscript(_request: TranscriptRequest): Promise<TranscriptResponse> {
		return { 
			success: false, 
			error: "PaidAsrProvider disabled in favor of orchestrated transcript providers", 
			provider: this.name 
		}
	},
}
