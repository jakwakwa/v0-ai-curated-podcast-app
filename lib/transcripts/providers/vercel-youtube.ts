import { shouldAvoidServerSideYouTube } from "@/lib/utils/vercel"
import type { TranscriptProvider, TranscriptRequest, TranscriptResponse } from "../types"

/**
 * Vercel-safe YouTube provider that avoids server-side YouTube scraping
 * This provider coordinates client-side caption extraction and only uses
 * paid ASR services for direct audio URLs (not YouTube page URLs)
 */
export const VercelYouTubeProvider: TranscriptProvider = {
	name: "vercel-youtube",
	canHandle(request) {
		// Only handle YouTube URLs
		return /youtu(be\.be|be\.com)/i.test(request.url)
	},
	async getTranscript(request: TranscriptRequest): Promise<TranscriptResponse> {
		// Check if we're on Vercel and should avoid server-side YouTube operations
		const isVercel = shouldAvoidServerSideYouTube()
		
		// Check if this is a direct audio URL (not a YouTube page)
		const isDirectAudio = request.url.match(/\.(mp3|wav|m4a|webm|ogg|flac)(\?|$)/i)
		
		if (isDirectAudio && request.allowPaid) {
			// For direct audio URLs, we can use paid ASR services
			// This avoids YouTube scraping entirely
			return {
				success: false,
				error: "Direct audio URL detected - use AssemblyAI or Rev.ai provider",
				provider: this.name,
				meta: {
					redirectTo: "assemblyai",
					reason: "Direct audio URLs should use dedicated ASR providers"
				}
			}
		}
		
		// For YouTube page URLs, require client-side extraction
		if (isVercel) {
			return {
				success: false,
				error: "YouTube page URLs require client-side caption extraction to avoid server-side blocking on Vercel",
				provider: this.name,
				meta: {
					requiresClientExtraction: true,
					extractionMethod: "browser-captions",
					instructions: "Extract captions in the browser using YouTube's caption API to avoid Vercel IP blocking",
					fallback: "If captions unavailable, consider downloading audio locally and re-uploading to AssemblyAI",
					environment: "vercel",
					reason: "Vercel IP addresses are blocked by YouTube's anti-bot measures"
				}
			}
		}
		
		// For non-Vercel environments, we can still try server-side (but warn)
		return {
			success: false,
			error: "YouTube page URLs require client-side caption extraction to avoid potential server-side blocking",
			provider: this.name,
			meta: {
				requiresClientExtraction: true,
				extractionMethod: "browser-captions",
				instructions: "Extract captions in the browser using YouTube's caption API to avoid potential blocking",
				fallback: "If captions unavailable, consider downloading audio locally and re-uploading",
				environment: "development",
				reason: "Server-side YouTube scraping may be blocked in production environments"
			}
		}
	},
}