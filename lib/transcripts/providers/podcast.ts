import type { TranscriptProvider, TranscriptRequest, TranscriptResponse } from "../types"

function isLikelyPodcastUrl(url: string): boolean {
	return /(rss|feed|podcast|anchor|spotify|apple)\./i.test(url) || /\.rss(\b|$)/i.test(url)
}

export const PodcastRssProvider: TranscriptProvider = {
	name: "podcast-rss",
	canHandle(request) {
		return isLikelyPodcastUrl(request.url)
	},
	async getTranscript(_request: TranscriptRequest): Promise<TranscriptResponse> {
		return { success: false, error: "Podcast RSS transcript lookup not yet implemented", provider: this.name }
	},
}