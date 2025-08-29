/**
 * Vercel-safe transcriber that avoids ytdl-core server-side scraping
 * Uses the transcript orchestrator with Vercel-optimized providers
 */

import { getTranscriptOrchestrated } from "./transcripts"
import type { TranscriptRequest } from "./transcripts/types"

export interface TranscriptionResult {
	success: boolean
	transcript?: string
	duration?: number
	error?: string
	audioSize?: number
	provider?: string
	meta?: Record<string, unknown>
}

/**
 * Check if we're running on Vercel
 */
function isVercelEnvironment(): boolean {
	return process.env.VERCEL === "1" || process.env.NODE_ENV === "production"
}

/**
 * Transcribe YouTube video using Vercel-safe methods
 */
export async function transcribeYouTubeVideoSafe(videoUrl: string): Promise<TranscriptionResult> {
	try {
		console.log("Starting Vercel-safe transcription for:", videoUrl)

		// Use the orchestrator with allowPaid=true to enable all providers
		const request: TranscriptRequest = {
			url: videoUrl,
			allowPaid: true, // Enable paid providers for better reliability
			kind: "youtube"
		}

		const result = await getTranscriptOrchestrated(request)

		if (result.success) {
			return {
				success: true,
				transcript: result.transcript,
				provider: result.provider,
				meta: result.meta || {}
			}
		}

		// If orchestrator failed, provide helpful error message
		const lastAttempt = result.attempts?.[result.attempts.length - 1]
		const errorMessage = lastAttempt?.error || result.error || "All transcription providers failed"

		return {
			success: false,
			error: errorMessage,
			meta: { attempts: result.attempts }
		}
	} catch (error) {
		console.error("Vercel-safe transcription failed:", error)
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown transcription error"
		}
	}
}

/**
 * Validate video for transcription (Vercel-safe)
 */
export async function validateVideoForTranscriptionSafe(videoUrl: string): Promise<{
	valid: boolean
	duration?: number
	estimatedCost?: number
	error?: string
}> {
	try {
		// For Vercel environment, we'll be more permissive since we're using captions first
		if (!/youtu(be\.be|be\.com)/i.test(videoUrl)) {
			return {
				valid: false,
				error: "Invalid YouTube URL"
			}
		}

		// In Vercel environment, we prioritize captions which are free
		// So we can be more lenient with validation
		return {
			valid: true,
			estimatedCost: 0, // Captions are free
			duration: 0 // We don't need duration for captions
		}
	} catch (error) {
		return {
			valid: false,
			error: error instanceof Error ? error.message : "Validation error"
		}
	}
}

/**
 * Legacy function for backward compatibility - now redirects to safe version
 */
export async function transcribeYouTubeVideo(videoUrl: string): Promise<TranscriptionResult> {
	if (isVercelEnvironment()) {
		console.log("Using Vercel-safe transcription method")
		return transcribeYouTubeVideoSafe(videoUrl)
	}

	// In development, we can still use the original method as fallback
	// but only if explicitly enabled
	if (process.env.ALLOW_YTDL_LOCAL === "true") {
		console.log("Using local ytdl-core (development only)")
		try {
			const { transcribeYouTubeVideo: originalTranscribe } = await import("./custom-transcriber")
			return originalTranscribe(videoUrl)
		} catch (error) {
			console.warn("Local ytdl-core failed, falling back to safe method:", error)
			return transcribeYouTubeVideoSafe(videoUrl)
		}
	}

	// Default to safe method
	return transcribeYouTubeVideoSafe(videoUrl)
}

/**
 * Legacy function for backward compatibility
 */
export async function validateVideoForTranscription(videoUrl: string): Promise<{
	valid: boolean
	duration?: number
	estimatedCost?: number
	error?: string
}> {
	return validateVideoForTranscriptionSafe(videoUrl)
}

/**
 * Estimate transcription cost (updated for new providers)
 */
export function estimateTranscriptionCost(durationSeconds: number): number {
	// With captions-first approach, most transcriptions are free
	// Only estimate cost if we need to use paid providers
	if (durationSeconds === 0) return 0
	
	// AssemblyAI pricing: $0.00065 per minute
	const pricePerMinute = 0.00065
	const minutes = durationSeconds / 60
	return minutes * pricePerMinute
}