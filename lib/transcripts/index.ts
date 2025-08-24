import type { OrchestratorResult, TranscriptProvider, TranscriptRequest, TranscriptResponse, TranscriptSourceKind } from "./types"
import { YouTubeCaptionsProvider } from "./providers/youtube"
import { YouTubeClientProvider } from "./providers/youtube-client"
import { PodcastRssProvider } from "./providers/podcast"
import { ListenNotesProvider } from "./providers/listen-notes"
import { PaidAsrProvider } from "./providers/paid-asr"
import { RevAiProvider } from "./providers/revai"

export function detectKindFromUrl(url: string): TranscriptSourceKind {
	if (/youtu(be\.be|be\.com)/i.test(url)) return "youtube"
	if (/(rss|feed|podcast|anchor|spotify|apple)\./i.test(url) || /\.rss(\b|$)/i.test(url)) return "podcast"
	return "unknown"
}

function getProviderChain(kind: TranscriptSourceKind, allowPaid: boolean | undefined): TranscriptProvider[] {
	if (kind === "youtube") {
		return [YouTubeCaptionsProvider, YouTubeClientProvider, ...(allowPaid ? [PaidAsrProvider] : [])]
	}
	if (kind === "podcast") {
		return [PodcastRssProvider, ListenNotesProvider, ...(allowPaid ? [RevAiProvider] : [])]
	}
	return [YouTubeCaptionsProvider, PodcastRssProvider, ListenNotesProvider, ...(allowPaid ? [RevAiProvider, PaidAsrProvider] : [])]
}

export async function getTranscriptOrchestrated(initialRequest: TranscriptRequest): Promise<OrchestratorResult> {
	let request = { ...initialRequest }
	let kind = request.kind ?? detectKindFromUrl(request.url)
	let providers = getProviderChain(kind, request.allowPaid)

	const attempts: OrchestratorResult["attempts"] = []

	for (const provider of providers) {
		try {
			const applicable = await provider.canHandle(request)
			if (!applicable) continue
			const result: TranscriptResponse = await provider.getTranscript(request)
			attempts.push({ provider: provider.name, success: result.success, error: result.success ? undefined : result.error })
			if (result.success) {
				return { ...result, attempts }
			}
			// If provider hinted a nextUrl (e.g., RSS -> enclosure audio), switch request and refresh chain
			const nextUrl = (result as any)?.meta?.nextUrl as string | undefined
			if (nextUrl) {
				request = { ...request, url: nextUrl }
				kind = detectKindFromUrl(nextUrl)
				providers = getProviderChain(kind, request.allowPaid)
				// Continue with updated providers list
			}
		} catch (error) {
			const errMsg = error instanceof Error ? error.message : "Unknown provider error"
			attempts.push({ provider: provider.name, success: false, error: errMsg })
		}
	}

	return {
		success: false,
		error: "No transcript available from any provider",
		attempts,
	}
}

export type { TranscriptRequest, TranscriptResponse } from "./types"