import { GeminiVideoProvider } from "./providers/gemini";
import { GrokSearchProvider } from "./providers/grok-search";
import { ListenNotesProvider } from "./providers/listen-notes";
import { PodcastRssProvider } from "./providers/podcast";
import { YouTubeCaptionsProvider } from "./providers/youtube";
import { YouTubeStreamResolverProvider } from "./providers/youtube-audio-extractor";
import { YouTubeClientProvider } from "./providers/youtube-client";
import type { OrchestratorResult, TranscriptProvider, TranscriptRequest, TranscriptResponse, TranscriptSourceKind } from "./types";

const ENABLE_LISTEN_NOTES = process.env.ENABLE_LISTEN_NOTES === "true";

export function detectKindFromUrl(url: string): TranscriptSourceKind {
	if (/youtu(be\.be|be\.com)/i.test(url)) return "youtube";
	if (/(rss|feed|podcast|anchor|spotify|apple)\./i.test(url) || /\.rss(\b|$)/i.test(url)) return "podcast";
	return "unknown";
}

function getProviderChain(kind: TranscriptSourceKind): TranscriptProvider[] {
	if (kind === "youtube") {
		// Order (Gemini-first for direct transcription):
		// 1. Gemini Video (direct transcription from URL)
		// 2. YouTube client captions
		// 3. Server-side captions
		// 4. Stream resolver
		// 5. OpenAI text fallback (extract visible text from HTML pages as last resort)
		const providers: TranscriptProvider[] = [GeminiVideoProvider, YouTubeClientProvider, YouTubeCaptionsProvider, YouTubeStreamResolverProvider];

		// Append Grok discovery before OpenAI fallback if explicitly enabled
		if (process.env.ENABLE_GROK === "true") {
			providers.push(GrokSearchProvider);
		}

		// Try to append OpenAI fallback provider if present
		try {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const oa = require("./providers/openai");
			if (oa?.OpenAITextFallbackProvider) providers.push(oa.OpenAITextFallbackProvider as TranscriptProvider);
		} catch {
			// ignore
		}

		return providers;
	}
	if (kind === "podcast") {
		return [PodcastRssProvider, ...(ENABLE_LISTEN_NOTES ? ([ListenNotesProvider] as const) : [])];
	}
	return [PodcastRssProvider, ...(ENABLE_LISTEN_NOTES ? ([ListenNotesProvider] as const) : [])];
}

export async function getTranscriptOrchestrated(initialRequest: TranscriptRequest): Promise<OrchestratorResult> {
	let request = { ...initialRequest };
	let kind = request.kind ?? detectKindFromUrl(request.url);
	let providers = getProviderChain(kind);

	const attempts: OrchestratorResult["attempts"] = [];

	for (const provider of providers) {
		try {
			console.debug(`[orchestrator] trying provider`, { provider: provider.name, url: request.url });
			const applicable = await provider.canHandle(request);
			console.debug(`[orchestrator] provider.canHandle result`, { provider: provider.name, url: request.url, applicable });
			if (!applicable) continue;
			const result: TranscriptResponse = await provider.getTranscript(request);
			console.debug(`[orchestrator] provider.getTranscript result`, { provider: provider.name, url: request.url, result });
			attempts.push({ provider: provider.name, success: result.success, error: result.success ? undefined : result.error });
			if (result.success) {
				return { ...result, attempts };
			}
			const nextUrl = (result as { meta?: { nextUrl?: string } }).meta?.nextUrl;
			if (nextUrl) {
				request = { ...request, url: nextUrl };
				kind = detectKindFromUrl(nextUrl);
				providers = getProviderChain(kind);
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
