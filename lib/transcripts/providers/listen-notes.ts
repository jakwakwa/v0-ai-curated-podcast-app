import { isListenNotesAllowed, recordListenNotesCall } from "@/lib/usage/listen-notes-quota"
import { incrementPaidServiceUsage } from "@/lib/usage/service-usage"
import type { TranscriptProvider, TranscriptRequest, TranscriptResponse } from "../types"

function isDirectAudioUrl(url: string): boolean {
	return /(\.mp3|\.m4a|\.wav|\.aac|\.flac)(\b|$)/i.test(url)
}

function isYouTube(url: string): boolean {
	return /youtu(be\.be|be\.com)/i.test(url)
}

async function resolveAudioViaListenNotes(url: string, apiKey: string): Promise<string | null> {
	const endpoint = new URL("https://listen-api.listennotes.com/api/v2/search")
	endpoint.searchParams.set("q", url)
	endpoint.searchParams.set("type", "episode")
	endpoint.searchParams.set("only_in", "title,description")
	endpoint.searchParams.set("sort_by_date", "0")
	endpoint.searchParams.set("offset", "0")
	endpoint.searchParams.set("len_min", "0")
	endpoint.searchParams.set("len_max", "36000")

	// Record usage before calling to prevent race increments on rapid retries
	recordListenNotesCall()
	incrementPaidServiceUsage("listen-notes")

	const res = await fetch(endpoint.toString(), {
		headers: { "X-ListenAPI-Key": apiKey },
	})
	if (!res.ok) return null
	const data = (await res.json()) as unknown
	type ListenNotesSearch = { results?: Array<{ audio?: unknown }> }
	const safe = data as ListenNotesSearch
	const results: Array<{ audio?: unknown }> = Array.isArray(safe?.results) ? safe.results : []
	for (const r of results) {
		const audio: string | undefined = typeof r?.audio === "string" ? r.audio : undefined
		if (audio && isDirectAudioUrl(audio)) return audio
	}
	return null
}

export const ListenNotesProvider: TranscriptProvider = {
	name: "listen-notes",
	canHandle(request) {
		if (isYouTube(request.url)) return false
		if (isDirectAudioUrl(request.url)) return false
		if (!process.env.LISTEN_NOTES_API_KEY) return false
		return isListenNotesAllowed()
	},
	async getTranscript(request: TranscriptRequest): Promise<TranscriptResponse> {
		const apiKey = process.env.LISTEN_NOTES_API_KEY
		if (!apiKey) return { success: false, error: "Listen Notes API key not configured", provider: this.name }
		try {
			const audioUrl = await resolveAudioViaListenNotes(request.url, apiKey)
			if (audioUrl) {
				return { success: false, error: "Resolved audio via Listen Notes", provider: this.name, meta: { nextUrl: audioUrl } }
			}
			return { success: false, error: "Could not resolve audio via Listen Notes", provider: this.name }
		} catch (error) {
			return { success: false, error: error instanceof Error ? error.message : "Listen Notes error", provider: this.name }
		}
	},
}
