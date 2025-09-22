import { XMLParser } from "fast-xml-parser";

// ytdl-core is no longer used for metadata, only for transcripts

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

// --- Transcript functions using ytdl-core remain as they serve a different purpose ---

export type YouTubeTranscriptItem = { text: string; duration: number; offset: number };

export async function getYouTubeTranscriptSegments(videoUrlOrId: string, lang?: string): Promise<YouTubeTranscriptItem[]> {
	const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";
	const enableServerYtdl = process.env.ENABLE_SERVER_YTDL === "true";
	if (isVercel && !enableServerYtdl) {
		throw new Error("Server-side YouTube caption fetching disabled in this environment");
	}
	return await getYouTubeTranscriptSegmentsViaYtdl(videoUrlOrId, lang);
}

export async function getYouTubeTranscriptText(videoUrlOrId: string, lang?: string): Promise<string> {
	const segments = await getYouTubeTranscriptSegments(videoUrlOrId, lang);
	return segments.map(s => s.text).join(" ");
}

async function parseTranscriptXML(xmlData: string): Promise<YouTubeTranscriptItem[]> {
	if (!xmlData || xmlData.trim().length === 0) {
		throw new Error("Empty caption data received");
	}

	if (!(xmlData.includes("<transcript>") || xmlData.includes("<text"))) {
		throw new Error("Invalid caption format - not XML");
	}

	const parser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: "",
	});

	const parsed = parser.parse(xmlData);
	const texts = parsed.transcript?.text || [];

	if (!Array.isArray(texts)) {
		throw new Error("Invalid caption format");
	}

	return texts.map((item: { "#text"?: string; dur?: string; start?: string } | string, index: number) => {
		const xmlItem = item as { "#text"?: string; dur?: string; start?: string } | string;
		return {
			text: typeof xmlItem === "string" ? xmlItem : xmlItem["#text"] || "",
			duration: typeof xmlItem === "object" && xmlItem.dur ? parseFloat(xmlItem.dur) : 1,
			offset: typeof xmlItem === "object" && xmlItem.start ? parseFloat(xmlItem.start) : index,
		};
	}) as YouTubeTranscriptItem[];
}

async function getYouTubeTranscriptSegmentsViaYtdl(videoUrlOrId: string, lang?: string): Promise<YouTubeTranscriptItem[]> {
	try {
		let ytdlModule: unknown;
		try {
			ytdlModule = (await import("@distube/ytdl-core")).default ?? (await import("@distube/ytdl-core"));
		} catch {
			throw new Error("Server-side ytdl-core is not available in this environment");
		}

		const videoUrl = videoUrlOrId.startsWith("http") ? videoUrlOrId : `https://www.youtube.com/watch?v=${videoUrlOrId}`;
		const ytdlClient = ytdlModule as { getInfo: (url: string) => Promise<unknown> };
		const info = await ytdlClient.getInfo(videoUrl);

		const playerResponse: unknown = (info as unknown as { player_response?: unknown }).player_response;
		const captions: Array<{ languageCode?: string; kind?: string; baseUrl?: string; name?: { simpleText?: string } }> | undefined = (
			playerResponse as { captions?: { playerCaptionsTracklistRenderer?: { captionTracks?: Array<{ languageCode?: string; kind?: string; baseUrl?: string; name?: { simpleText?: string } }> } } }
		)?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
		if (!captions || captions.length === 0) {
			throw new Error("No captions available for this video");
		}

		let selectedCaption = captions.find(c => c.languageCode === (lang || "en") && c.kind === "asr");
		if (!selectedCaption) selectedCaption = captions.find(c => c.languageCode === (lang || "en"));
		if (!selectedCaption) selectedCaption = captions.find(c => c.kind === "asr");
		if (!selectedCaption) selectedCaption = captions[0];
		if (!selectedCaption?.baseUrl) throw new Error("No suitable caption track found");

		const res = await fetch(selectedCaption.baseUrl);
		if (!res.ok) throw new Error(`Failed to fetch captions: ${res.statusText}`);

		const xmlData = await res.text();
		return await parseTranscriptXML(xmlData);
	} catch (error) {
		console.error(`ytdl-core transcript extraction failed:`, error);
		throw new Error(error instanceof Error ? error.message : "An unknown error occurred during transcript extraction.");
	}
}
