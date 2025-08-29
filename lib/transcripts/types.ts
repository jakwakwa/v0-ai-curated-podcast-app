export type TranscriptSourceKind = "youtube" | "podcast" | "unknown"

export interface TranscriptRequest {
	url: string
	kind?: TranscriptSourceKind
	lang?: string
	allowPaid?: boolean
}

export type ProviderName =
	| "youtube-captions"
	| "youtube-client"
	| "podcast-rss"
	| "listen-notes"
	| "revai"
	| "paid-asr"
	| "assemblyai"

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
	meta?: Record<string, unknown>
}

export type TranscriptResponse = TranscriptResponseSuccess | TranscriptResponseFailure

export interface TranscriptProvider {
	name: ProviderName
	canHandle(request: TranscriptRequest): Promise<boolean> | boolean
	getTranscript(request: TranscriptRequest): Promise<TranscriptResponse>
}

export type OrchestratorResult = (TranscriptResponse & {
	attempts: Array<{ provider: ProviderName; success: boolean; error?: string }>
})

