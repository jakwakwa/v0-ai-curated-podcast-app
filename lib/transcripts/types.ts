export type TranscriptSourceKind = "youtube" | "podcast" | "unknown"

export interface TranscriptRequest {
	url: string
	// Optional explicit kind if caller already knows
	kind?: TranscriptSourceKind
	// Preferred language code, e.g., "en"
	lang?: string
	// Whether to allow paid providers
	allowPaid?: boolean
}

export interface TranscriptResponseSuccess {
	success: true
	transcript: string
	provider: ProviderName
	meta?: Record<string, unknown>
}

export interface TranscriptResponseFailure {
	success: false
	error: string
	provider?: ProviderName
	meta?: {
		requiresClientExtraction?: boolean
		extractionMethod?: string
		instructions?: string
		fallback?: string
		redirectTo?: string
		reason?: string
		environment?: string
		[key: string]: unknown
	}
}

export type TranscriptResponse = TranscriptResponseSuccess | TranscriptResponseFailure

export type ProviderName = "youtube-captions" | "youtube-client" | "vercel-youtube" | "podcast-rss" | "listen-notes" | "revai" | "paid-asr" | "assemblyai"

export interface TranscriptProvider {
	name: ProviderName
	// Quick check if the provider is applicable for this request
	canHandle(request: TranscriptRequest): Promise<boolean> | boolean
	// Attempt to fetch/generate a transcript
	getTranscript(request: TranscriptRequest): Promise<TranscriptResponse>
}

export type OrchestratorResult = TranscriptResponse & {
	attempts: Array<{ provider: ProviderName; success: boolean; error?: string }>
	meta?: {
		requiresClientExtraction?: boolean
		extractionMethod?: string
		instructions?: string
		fallback?: string
		redirectTo?: string
		reason?: string
		environment?: string
		[key: string]: unknown
	}
}

export interface YouTubeProviderOptions {
	// If true, prefer client-side caption extraction strategy first
	preferClient?: boolean
}

export interface PaidAsrOptions {
	provider: "revai" | "assemblyai" | "whisper"
	apiKey?: string
}
