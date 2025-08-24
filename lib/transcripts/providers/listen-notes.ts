import type { TranscriptProvider, TranscriptRequest, TranscriptResponse } from "../types"

export const ListenNotesProvider: TranscriptProvider = {
	name: "listen-notes",
	canHandle(_request) {
		return true // Discovery provider can attempt for podcast-like URLs when others fail
	},
	async getTranscript(_request: TranscriptRequest): Promise<TranscriptResponse> {
		return { success: false, error: "Listen Notes transcript lookup not yet implemented", provider: this.name }
	},
}