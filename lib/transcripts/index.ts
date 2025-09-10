import { AssemblyAIProvider } from "./providers/assemblyai";
import { ListenNotesProvider } from "./providers/listen-notes";
import { PodcastRssProvider } from "./providers/podcast";
import { RevAiProvider } from "./providers/revai";
import { YouTubeAudioExtractorProvider } from "./providers/youtube-audio-extractor";
import { YouTubeClientProvider } from "./providers/youtube-client";
import type { OrchestratorResult, TranscriptProvider, TranscriptRequest, TranscriptResponse, TranscriptSourceKind } from "./types";

const ENABLE_LISTEN_NOTES = process.env.ENABLE_LISTEN_NOTES === "true";

export function detectKindFromUrl(url: string): TranscriptSourceKind {
	if (/youtu(be\.be|be\.com)/i.test(url)) return "youtube";
	if (/(rss|feed|podcast|anchor|spotify|apple)\./i.test(url) || /\.rss(\b|$)/i.test(url)) return "podcast";
	return "unknown";
}

function getProviderChain(kind: TranscriptSourceKind, allowPaid: boolean | undefined): TranscriptProvider[] {
	if (kind === "youtube") {
		// Vercel-optimized order:
		// 1. Try YouTube client-side captions first (free, fast, works on Vercel)
		// 2. If paid allowed, extract audio URL and use AssemblyAI
		// 3. Fallback to Rev.ai if we have direct audio URL
		const providers: TranscriptProvider[] = [YouTubeClientProvider];

		if (allowPaid) {
			providers.push(YouTubeAudioExtractorProvider, AssemblyAIProvider, RevAiProvider);
		}

		return providers;
	}
	if (kind === "podcast") {
		return [PodcastRssProvider, ...(ENABLE_LISTEN_NOTES ? ([ListenNotesProvider] as const) : []), ...(allowPaid ? [RevAiProvider] : [])];
	}
	return [PodcastRssProvider, ...(ENABLE_LISTEN_NOTES ? ([ListenNotesProvider] as const) : []), ...(allowPaid ? [RevAiProvider] : [])];
}

export async function getTranscriptOrchestrated(initialRequest: TranscriptRequest): Promise<OrchestratorResult> {
	let request = { ...initialRequest };
	let kind = request.kind ?? detectKindFromUrl(request.url);
	let providers = getProviderChain(kind, request.allowPaid);

	const attempts: OrchestratorResult["attempts"] = [];

	for (const provider of providers) {
		try {
			const applicable = await provider.canHandle(request);
			if (!applicable) continue;
			const result: TranscriptResponse = await provider.getTranscript(request);
			attempts.push({ provider: provider.name, success: result.success, error: result.success ? undefined : result.error });
			if (result.success) {
				return { ...result, attempts };
			}
			const nextUrl = (result as { meta?: { nextUrl?: string } }).meta?.nextUrl;
			if (nextUrl) {
				request = { ...request, url: nextUrl };
				kind = detectKindFromUrl(nextUrl);
				providers = getProviderChain(kind, request.allowPaid);
			}
		} catch (error) {
			const errMsg = error instanceof Error ? error.message : "Unknown provider error";
			attempts.push({ provider: provider.name, success: false, error: errMsg });
		}
	}

	return {
		success: false,
		error: "No transcript available from any provider",
		attempts,
	};
}

export type { TranscriptRequest, TranscriptResponse } from "./types";
