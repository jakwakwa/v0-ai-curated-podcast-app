import type { TranscriptProvider, TranscriptRequest, TranscriptResponse } from "../types";

export const YouTubeCaptionsProvider: TranscriptProvider = {
	name: "youtube-captions",
	canHandle(request) {
		// Always allow server-side caption fetching for YouTube URLs (no flags).
		return /youtu(\.be|be\.com)/i.test(request.url);
	},
	async getTranscript(_request: TranscriptRequest): Promise<TranscriptResponse> {
		// Transcripts disabled globally; fast-fail so orchestrator moves on.
		return { success: false, error: "TRANSCRIPTS_DISABLED", provider: this.name };
	},
};
