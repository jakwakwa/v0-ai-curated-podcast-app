// YouTube Data API only – all scraping (ytdl/innertube/html) removed per policy.

/**
 * Parses an ISO 8601 duration string (e.g., "PT2M34S") into seconds.
 * The YouTube API returns duration in this format.
 * @param duration The ISO 8601 duration string.
 * @returns The total duration in seconds.
 */
function parseISO8601Duration(duration: string): number {
	const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
	const matches = duration.match(regex);

	if (!matches) {
		return 0;
	}

	const hours = parseInt(matches[1] || "0", 10);
	const minutes = parseInt(matches[2] || "0", 10);
	const seconds = parseInt(matches[3] || "0", 10);

	return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Fetches video title and duration using the YouTube Data API v3.
 * This function is designed to be called from the server-side to protect the API key.
 * @param videoUrl The URL of the YouTube video.
 * @returns An object with title and duration, or null if not found.
 */
export async function getYouTubeVideoDetails(videoUrl: string): Promise<{ title: string; duration: number } | null> {
	const apiKey = process.env.YOUTUBE_API_KEY;
	if (!apiKey) {
		console.error("YouTube API key is not configured. Please set the YOUTUBE_API_KEY environment variable.");
		throw new Error("YouTube API key is not configured.");
	}

	const videoId = extractYouTubeVideoId(videoUrl);
	if (!videoId) {
		return null;
	}

	const endpoint = new URL("https://www.googleapis.com/youtube/v3/videos");
	endpoint.searchParams.set("id", videoId);
	endpoint.searchParams.set("key", apiKey);
	// Requesting 'snippet' for title and 'contentDetails' for duration.
	endpoint.searchParams.set("part", "snippet,contentDetails");

	try {
		const res = await fetch(endpoint.toString(), { next: { revalidate: 3600 } }); // Cache for 1 hour
		if (!res.ok) {
			const errorData = await res.json();
			console.error("YouTube API Error:", errorData.error.message);
			throw new Error("Failed to fetch data from YouTube API. Check if the API key is valid and has quota.");
		}

		const data = await res.json();
		const item = data.items?.[0];

		if (!item) {
			return null;
		}

		const title = item.snippet?.title || "Untitled Video";
		const durationString = item.contentDetails?.duration || "PT0S";
		const duration = parseISO8601Duration(durationString);

		return { title, duration };
	} catch (error) {
		console.error("[YOUTUBE_API_FETCH_ERROR]", error);
		return null; // Return null to handle errors gracefully on the client
	}
}

/**
 * Extracts the 11-character video ID from various YouTube URL formats.
 * @param urlOrId The YouTube URL or a video ID.
 * @returns The video ID string, or null if not found.
 */
export function extractYouTubeVideoId(urlOrId: string): string | null {
	// If already a plausible 11-char ID, return as-is
	if (/^[\w-]{11}$/.test(urlOrId)) return urlOrId;

	// Regex for various YouTube URL formats
	const urlMatch = urlOrId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.*?&v=))([\w-]{11})/);
	return urlMatch ? urlMatch[1] : null;
}

// Transcripts removed: Use Gemini-based transcription pipeline instead.
export type YouTubeTranscriptItem = never;

export async function getYouTubeTranscriptText(): Promise<string> {
	throw new Error("TRANSCRIPTS_DISABLED: Server-side caption scraping removed. Use Gemini transcription pipeline.");
}

export async function getYouTubeTranscriptSegments(): Promise<YouTubeTranscriptItem[]> {
	throw new Error("TRANSCRIPTS_DISABLED");
}

// Convenience helper: duration only (seconds) via Data API
export async function getYouTubeVideoDurationSeconds(videoUrlOrId: string): Promise<number | null> {
	const apiKey = process.env.YOUTUBE_API_KEY;
	if (!apiKey) return null;
	const videoId = extractYouTubeVideoId(videoUrlOrId);
	if (!videoId) return null;
	const endpoint = new URL("https://www.googleapis.com/youtube/v3/videos");
	endpoint.searchParams.set("id", videoId);
	endpoint.searchParams.set("key", apiKey);
	endpoint.searchParams.set("part", "contentDetails");
	try {
		const res = await fetch(endpoint.toString(), { next: { revalidate: 3600 } });
		if (!res.ok) return null;
		const data = await res.json();
		const iso = data.items?.[0]?.contentDetails?.duration as string | undefined;
		if (!iso) return null;
		return parseISO8601Duration(iso);
	} catch {
		return null;
	}
}
