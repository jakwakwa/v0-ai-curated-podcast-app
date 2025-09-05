import type { TranscriptProvider, TranscriptRequest, TranscriptResponse } from "../types"

interface YouTubeAudioInfo {
	audioUrl: string
	title: string
	duration: number
}

interface AudioFormat {
	mimeType?: string
	url?: string
}

// Consolidate this into a shared utility if used elsewhere
function extractVideoId(url: string): string | null {
	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
		/^([a-zA-Z0-9_-]{11})$/,
	]
	for (const pattern of patterns) {
		const match = url.match(pattern)
		if (match) return match[1]
	}
	return null
}

async function fetchFromYouTubeAPI(videoId: string): Promise<YouTubeAudioInfo | null> {
	// IMPORTANT: This key is hardcoded and could be invalidated.
	// It's highly recommended to use a more stable, official library or a dedicated, maintained microservice for this.
	const YOUTUBE_API_KEY = process.env.YOUTUBE_PLAYER_API_KEY || "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"
	const response = await fetch(`https://www.youtube.com/youtubei/v1/player?key=${YOUTUBE_API_KEY}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
			Referer: "https://www.youtube.com/",
		},
		body: JSON.stringify({
			context: { client: { clientName: "WEB", clientVersion: "2.20240101.00.00" } },
			videoId: videoId,
		}),
	})

	if (!response.ok) {
		console.error(`YouTube API failed with status ${response.status}: ${await response.text()}`)
		return null
	}

	const data = await response.json()
	const streamingData = data?.streamingData
	const videoDetails = data?.videoDetails

	if (streamingData?.adaptiveFormats) {
		const audioFormats = streamingData.adaptiveFormats.filter(
			(format: AudioFormat) => format.mimeType?.includes("audio") && format.url
		)

		if (audioFormats.length > 0) {
			const preferredFormat =
				audioFormats.find(
					(format: AudioFormat) =>
						format.mimeType?.includes("audio/webm") || format.mimeType?.includes("audio/mp4")
				) || audioFormats[0]

			return {
				audioUrl: preferredFormat.url!,
				title: videoDetails?.title || "Unknown Title",
				duration: parseInt(videoDetails?.lengthSeconds || "0", 10),
			}
		}
	}
	return null
}

async function fetchFromRapidAPI(videoUrl: string): Promise<YouTubeAudioInfo | null> {
	const rapidApiKey = process.env.RAPIDAPI_KEY
	if (!rapidApiKey) return null

	const response = await fetch(`https://youtube-video-info1.p.rapidapi.com/youtube_video_info?url=${encodeURIComponent(videoUrl)}`, {
		headers: {
			"X-RapidAPI-Key": rapidApiKey,
			"X-RapidAPI-Host": "youtube-video-info1.p.rapidapi.com",
		},
	})

	if (!response.ok) {
		console.error(`RapidAPI fallback failed with status ${response.status}: ${await response.text()}`)
		return null
	}

	const data = await response.json()
	if (data.audio_url) {
		return {
			audioUrl: data.audio_url,
			title: data.title || "Unknown Title",
			duration: data.duration || 0,
		}
	}
	return null
}

/**
 * Extracts a direct, streamable audio URL from a YouTube video.
 * Note: These URLs are often temporary and may not be accessible from third-party servers.
 */
async function extractYouTubeAudioUrl(videoUrl: string): Promise<YouTubeAudioInfo> {
	const videoId = extractVideoId(videoUrl)
	if (!videoId) {
		throw new Error("Invalid or unparseable YouTube URL")
	}

	try {
		const apiResult = await fetchFromYouTubeAPI(videoId)
		if (apiResult) return apiResult
	} catch (error) {
		console.warn("YouTube Player API method failed:", error)
	}

	try {
		const rapidApiResult = await fetchFromRapidAPI(videoUrl)
		if (rapidApiResult) return rapidApiResult
	} catch (error) {
		console.warn("RapidAPI fallback failed:", error)
	}

	throw new Error("Unable to extract audio URL from YouTube video after trying all methods.")
}

export const YouTubeAudioExtractorProvider: TranscriptProvider = {
	name: "youtube-audio-extractor",
	canHandle(request) {
		return Boolean(request.allowPaid) && /youtu(be\.be|be\.com)/i.test(request.url)
	},
	async getTranscript(request: TranscriptRequest): Promise<TranscriptResponse> {
		try {
			// Extract audio URL from YouTube
			const audioInfo = await extractYouTubeAudioUrl(request.url)
			
			// Return success with the extracted audio URL for downstream providers
			return {
				success: false, // Mark as false so orchestrator continues
				error: "Audio URL extracted, continue to next provider",
				provider: this.name,
				meta: { 
					nextUrl: audioInfo.audioUrl,
					title: audioInfo.title,
					duration: audioInfo.duration,
					extractedAudioUrl: true
				}
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Audio extraction failed",
				provider: this.name,
			}
		}
	},
}

// Export the function for use in other files
export { extractYouTubeAudioUrl }