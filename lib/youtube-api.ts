import { google } from "googleapis";
import { z } from "zod";
import { getYouTubeAPIKey } from "./env";

// Get YouTube API key from centralized env helper
const YOUTUBE_API_KEY = getYouTubeAPIKey();

// YouTube Data API v3 client
const youtube = google.youtube({
	version: "v3",
	auth: YOUTUBE_API_KEY,
});

// Zod schemas for API responses
const VideoDetailsSchema = z.object({
	id: z.string(),
	snippet: z
		.object({
			title: z.string(),
			description: z.string().optional(),
			publishedAt: z.string(),
			channelTitle: z.string(),
		})
		.optional(),
	contentDetails: z
		.object({
			duration: z.string(), // ISO 8601 duration format (PT4M13S)
		})
		.optional(),
	statistics: z
		.object({
			viewCount: z.string().optional(),
			likeCount: z.string().optional(),
		})
		.optional(),
});

const VideoListResponseSchema = z.object({
	items: z.array(VideoDetailsSchema),
});

/**
 * Extract YouTube video ID from URL or return as-is if already an ID
 */
export function extractYouTubeVideoId(urlOrId: string): string | null {
	// If already a plausible 11-char ID, return as-is
	if (/^[\w-]{11}$/.test(urlOrId)) return urlOrId;

	const urlMatch = urlOrId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.*?&v=))([\w-]{11})/);
	return urlMatch ? urlMatch[1] : null;
}

/**
 * Get video details using YouTube Data API v3
 */
export async function getYouTubeVideoDetails(videoId: string) {
	try {
		const response = await youtube.videos.list({
			part: ["snippet", "contentDetails", "statistics"],
			id: [videoId],
		});

		const parsed = VideoListResponseSchema.safeParse(response.data);
		if (!parsed.success) {
			throw new Error("Invalid YouTube API response format");
		}

		if (parsed.data.items.length === 0) {
			throw new Error("Video not found");
		}

		return parsed.data.items[0];
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`YouTube API error: ${error.message}`);
		}
		throw new Error("Failed to fetch video details from YouTube API");
	}
}

/**
 * Get video duration in seconds from ISO 8601 duration format
 */
export function parseYouTubeDuration(duration: string): number {
	const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
	if (!match) return 0;

	const hours = parseInt(match[1] || "0");
	const minutes = parseInt(match[2] || "0");
	const seconds = parseInt(match[3] || "0");

	return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Get video duration in seconds using YouTube Data API v3
 */
export async function getYouTubeVideoDuration(videoId: string): Promise<number> {
	const videoDetails = await getYouTubeVideoDetails(videoId);

	if (!videoDetails.contentDetails?.duration) {
		throw new Error("Video duration not available");
	}

	return parseYouTubeDuration(videoDetails.contentDetails.duration);
}

/**
 * Get video title using YouTube Data API v3
 */
export async function getYouTubeVideoTitle(videoId: string): Promise<string> {
	const videoDetails = await getYouTubeVideoDetails(videoId);

	if (!videoDetails.snippet?.title) {
		throw new Error("Video title not available");
	}

	return videoDetails.snippet.title;
}

/**
 * Check if YouTube Data API is properly configured
 */
export function isYouTubeAPIConfigured(): boolean {
	return Boolean(YOUTUBE_API_KEY && YOUTUBE_API_KEY.trim().length > 0);
}
