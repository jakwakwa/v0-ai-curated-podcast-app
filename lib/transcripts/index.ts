import type { OrchestratorResult, TranscriptProvider, TranscriptRequest, TranscriptResponse, TranscriptSourceKind } from "./types"
import { PodcastRssProvider } from "./providers/podcast"
import { RevAiProvider } from "./providers/revai"
import { AssemblyAiProvider } from "./providers/assemblyai"

const ENABLE_LISTEN_NOTES = process.env.ENABLE_LISTEN_NOTES === "true"

export function detectKindFromUrl(url: string): TranscriptSourceKind {
	if (/youtu(be\.be|be\.com)/i.test(url)) return "youtube"
	if (/(rss|feed|podcast|anchor|spotify|apple)\./i.test(url) || /\.rss(\b|$)/i.test(url)) return "podcast"
	return "unknown"
}

function isVercelLike(): boolean {
	// Prefer disabling ytdl-like providers on Vercel
	return Boolean(process.env.VERCEL || process.env.NEXT_RUNTIME || process.env.VERCEL_REGION)
}

function getProviderChain(kind: TranscriptSourceKind, allowPaid: boolean | undefined): TranscriptProvider[] {
	const providers: TranscriptProvider[] = []
	if (kind === "youtube") {
		// In Vercel, prefer AssemblyAI which accepts public URLs (including YouTube)
		if (allowPaid) providers.push(AssemblyAiProvider)
		// If we can resolve to direct audio first (not YouTube), Rev.ai can work
		if (allowPaid) providers.push(RevAiProvider)
		return providers
	}
	if (kind === "podcast") {
		providers.push(PodcastRssProvider)
		if (allowPaid) providers.push(RevAiProvider)
		return providers
	}
	// Unknown: try podcast heuristics then paid
	providers.push(PodcastRssProvider)
	if (allowPaid) providers.push(RevAiProvider, AssemblyAiProvider)
	return providers
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

