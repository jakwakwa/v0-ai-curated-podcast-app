import type { TranscriptProvider, TranscriptRequest, TranscriptResponse } from "../types"

interface YouTubeAudioInfo {
	audioUrl: string
	title: string
	duration: number
}

/**
 * Extract audio URL from YouTube using a third-party service
 * This provider extracts the audio URL and passes it to other providers like AssemblyAI
 */
async function extractYouTubeAudioUrl(videoUrl: string): Promise<YouTubeAudioInfo> {
	const videoId = extractVideoId(videoUrl)
	if (!videoId) {
		throw new Error("Invalid YouTube URL")
	}

	// Try multiple methods to get audio URL

	// Method 1: Use YouTube's own API to get stream info
	try {
		const response = await fetch("https://www.youtube.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
				"Referer": "https://www.youtube.com/",
			},
			body: JSON.stringify({
				context: {
					client: {
						clientName: "WEB",
						clientVersion: "2.20240101.00.00",
					},
				},
				videoId: videoId,
			}),
		})

		if (response.ok) {
			const data = await response.json()
			const streamingData = data?.streamingData
			const videoDetails = data?.videoDetails

			if (streamingData?.adaptiveFormats) {
				interface AudioFormat {
					mimeType?: string
					url?: string
				}
				
				// Find the best audio-only format
				const audioFormats = streamingData.adaptiveFormats.filter((format: AudioFormat) => 
					format.mimeType?.includes("audio") && format.url
				)

				if (audioFormats.length > 0) {
					// Prefer webm or mp4 audio formats
					const preferredFormat = audioFormats.find((format: AudioFormat) => 
						format.mimeType?.includes("audio/webm") || format.mimeType?.includes("audio/mp4")
					) || audioFormats[0]

					return {
						audioUrl: preferredFormat.url,
						title: videoDetails?.title || "Unknown",
						duration: parseInt(videoDetails?.lengthSeconds || "0"),
					}
				}
			}
		}
	} catch (error) {
		console.warn("YouTube API method failed:", error)
	}

	// Method 2: Use a fallback service if available
	const rapidApiKey = process.env.RAPIDAPI_KEY
	if (rapidApiKey) {
		try {
			const response = await fetch(`https://youtube-video-info1.p.rapidapi.com/youtube_video_info?url=${encodeURIComponent(videoUrl)}`, {
				headers: {
					"X-RapidAPI-Key": rapidApiKey,
					"X-RapidAPI-Host": "youtube-video-info1.p.rapidapi.com",
				},
			})

			if (response.ok) {
				const data = await response.json()
				if (data.audio_url) {
					return {
						audioUrl: data.audio_url,
						title: data.title || "Unknown",
						duration: data.duration || 0,
					}
				}
			}
		} catch (error) {
			console.warn("RapidAPI fallback failed:", error)
		}
	}

	throw new Error("Unable to extract audio URL from YouTube video")
}

function extractVideoId(url: string): string | null {
	const patterns = [/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/, /^([a-zA-Z0-9_-]{11})$/]
	for (const pattern of patterns) {
		const match = url.match(pattern)
		if (match) return match[1]
	}
	return null
}

export const YouTubeAudioExtractorProvider: TranscriptProvider = {
	name: "youtube-audio-extractor",
	canHandle(request) {
		return Boolean(request.allowPaid) && /youtu(be\.be|be\.com)/i.test(request.url);
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