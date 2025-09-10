import { writeEpisodeDebugLog } from "@/lib/debug-logger"

export interface YouTubeAudioInfo {
	audioUrl: string
	title: string
	duration: number
}

interface AudioFormat {
	mimeType?: string
	url?: string
}

export function extractVideoId(url: string): string | null {
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
	const playerKey = process.env.YOUTUBE_PLAYER_API_KEY || process.env.YOUTUBE_API_KEY
	if (!playerKey) return null
	// ⚠️ WARNING: Using undocumented YouTube innertube API
	// This endpoint may break without notice. See docs/YOUTUBE_API_RISKS.md for details.
	const response = await fetch(`https://www.youtube.com/youtubei/v1/player?key=${playerKey}`, {
		method: "POST",
		headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0", Referer: "https://www.youtube.com/" },
		body: JSON.stringify({ context: { client: { clientName: "WEB", clientVersion: "2.20240101.00.00" } }, videoId }),
	})
	if (!response.ok) {
		// Enhanced error logging for monitoring undocumented API health
		console.error(`[YOUTUBE_INNERTUBE_API] Audio extraction failed: HTTP ${response.status}`, {
			videoId,
			endpoint: "youtubei/v1/player",
			timestamp: new Date().toISOString()
		})
		return null
	}
	const data = await response.json()
	const streamingData = data?.streamingData
	const videoDetails = data?.videoDetails
	if (streamingData?.adaptiveFormats) {
		const audioFormats = streamingData.adaptiveFormats.filter((f: AudioFormat) => f?.mimeType?.includes("audio") && f?.url)
		if (audioFormats.length > 0) {
			const preferred = audioFormats.find((f: AudioFormat) => f?.mimeType?.includes("audio/webm") || f?.mimeType?.includes("audio/mp4")) || audioFormats[0]
			return {
				audioUrl: preferred.url as string,
				title: videoDetails?.title || "Unknown",
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
		headers: { "X-RapidAPI-Key": rapidApiKey, "X-RapidAPI-Host": "youtube-video-info1.p.rapidapi.com" },
	})
	if (!response.ok) return null
	const data = await response.json()
	if (data?.audio_url) {
		return { audioUrl: data.audio_url as string, title: data.title || "Unknown", duration: data.duration || 0 }
	}
	return null
}

/**
 * Extracts a direct, streamable audio URL from a YouTube video.
 * Note: These URLs are often temporary and may not be accessible from third-party servers.
 */
export async function extractYouTubeAudioUrl(videoUrl: string, userEpisodeId?: string): Promise<YouTubeAudioInfo> {
	const videoId = extractVideoId(videoUrl)
	if (!videoId) {
		throw new Error("Invalid or unparseable YouTube URL")
	}

	try {
		const apiResult = await fetchFromYouTubeAPI(videoId)
		if (apiResult) return apiResult
	} catch (error) {
		if (userEpisodeId) {
			await writeEpisodeDebugLog(userEpisodeId, { step: "youtube-extract", status: "fail", message: String(error) })
		}
	}

	try {
		const rapidApiResult = await fetchFromRapidAPI(videoUrl)
		if (rapidApiResult) return rapidApiResult
	} catch (error) {
		if (userEpisodeId) {
			await writeEpisodeDebugLog(userEpisodeId, { step: "youtube-extract-rapid", status: "fail", message: String(error) })
		}
	}

	throw new Error("Unable to extract audio URL from YouTube video after trying all methods.")
}

