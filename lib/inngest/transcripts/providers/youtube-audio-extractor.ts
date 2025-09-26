import type { TranscriptProvider, TranscriptResponse } from "../types";
// This provider resolves a streamable audio URL from YouTube (resolver only); it does NOT download or store audio.

export const YouTubeStreamResolverProvider: TranscriptProvider = {
	name: "youtube-stream-resolver",
	canHandle() {
		// Always included in chain; resolver only
		return true;
	},
	async getTranscript(): Promise<TranscriptResponse> {
		try {
			// Resolver is a placeholder here; it signals orchestrator to continue or act on resolved stream URLs.
			return {
				success: false,
				error: "YouTube stream resolution placeholder; rely on captions or Gemini",
				provider: "youtube-stream-resolver",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Stream resolution failed",
				provider: "youtube-stream-resolver",
			};
		}
	},
};
