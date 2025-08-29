import { AssemblyAIProvider } from "./providers/assemblyai"
import { ListenNotesProvider } from "./providers/listen-notes"
import { PodcastRssProvider } from "./providers/podcast"
import { RevAiProvider } from "./providers/revai"
import { VercelYouTubeProvider } from "./providers/vercel-youtube"
import type { OrchestratorResult, TranscriptProvider, TranscriptRequest, TranscriptResponse, TranscriptSourceKind } from "./types"

const ENABLE_LISTEN_NOTES = process.env.ENABLE_LISTEN_NOTES === "true"

export function detectKindFromUrl(url: string): TranscriptSourceKind {
	if (/youtu(be\.be|be\.com)/i.test(url)) return "youtube"
	if (/(rss|feed|podcast|anchor|spotify|apple)\./i.test(url) || /\.rss(\b|$)/i.test(url)) return "podcast"
	return "unknown"
}

function getProviderChain(kind: TranscriptSourceKind, allowPaid: boolean | undefined): TranscriptProvider[] {
	if (kind === "youtube") {
		// Vercel-safe order: Client extraction first, then paid ASR for direct audio only
		return [
			VercelYouTubeProvider, // Coordinates client-side extraction
			...(allowPaid ? [AssemblyAIProvider] : []), // For direct audio URLs only
			...(allowPaid ? [RevAiProvider] : []) // For direct audio URLs only
		]
	}
	if (kind === "podcast") {
		return [PodcastRssProvider, ...(ENABLE_LISTEN_NOTES ? ([ListenNotesProvider] as const) : []), ...(allowPaid ? [RevAiProvider] : [])]
	}
	return [PodcastRssProvider, ...(ENABLE_LISTEN_NOTES ? ([ListenNotesProvider] as const) : []), ...(allowPaid ? [RevAiProvider] : [])]
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
			
			// Check if this provider requires client-side extraction
			if (result.meta?.requiresClientExtraction) {
				// Return early with instructions for client-side extraction
				return {
					success: false,
					error: result.error || "Client-side extraction required",
					attempts,
					meta: {
						requiresClientExtraction: true,
						extractionMethod: result.meta.extractionMethod,
						instructions: result.meta.instructions,
						fallback: result.meta.fallback
					}
				}
			}
			
			// Check if we should redirect to a different provider
			if (result.meta?.redirectTo) {
				// Find the provider to redirect to
				const redirectProvider = providers.find(p => p.name === result.meta?.redirectTo)
				if (redirectProvider) {
					// Skip to the redirect provider
					continue
				}
			}
			
			const nextUrl = (result as { meta?: { nextUrl?: string } }).meta?.nextUrl
			if (nextUrl) {
				request = { ...request, url: nextUrl }
				kind = detectKindFromUrl(nextUrl)
				providers = getProviderChain(kind, request.allowPaid)
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
