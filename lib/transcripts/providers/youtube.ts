import { getYouTubeTranscriptText } from "@/lib/youtube";
import type { TranscriptProvider, TranscriptRequest, TranscriptResponse } from "../types";

export const YouTubeCaptionsProvider: TranscriptProvider = {
	name: "youtube-captions",
	canHandle(request) {
		// Always allow server-side caption fetching for YouTube URLs (no flags).
		return /youtu(\.be|be\.com)/i.test(request.url);
	},
	async getTranscript(request: TranscriptRequest): Promise<TranscriptResponse> {
		try {
			const transcript = await getYouTubeTranscriptText(request.url, request.lang);
			return { success: true, transcript, provider: this.name };
		} catch (error) {
			return { success: false, error: error instanceof Error ? error.message : "YouTube captions failed", provider: this.name };
		}
	},
};
