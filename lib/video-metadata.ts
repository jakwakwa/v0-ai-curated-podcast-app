/**
 * Video metadata utilities for chunking long videos
 * Provides duration extraction and chunking logic for Fan-Out/Fan-In pattern
 */

import { extractVideoId } from "@/lib/transcripts/utils/youtube-audio";

export interface VideoMetadata {
	duration: number; // in seconds
	title: string;
	videoId: string;
}

/**
 * Get video duration from YouTube URL without downloading the entire file
 * Uses YouTube's internal API to get metadata
 */
export async function getVideoDurationInSeconds(videoUrl: string): Promise<number> {
	const videoId = extractVideoId(videoUrl);
	if (!videoId) {
		throw new Error("Invalid YouTube URL");
	}

	try {
		// Use YouTube's internal API to get video metadata
		const response = await fetch("https://www.youtube.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
				Referer: "https://www.youtube.com/",
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
		});

		if (!response.ok) {
			throw new Error(`YouTube API request failed: ${response.status}`);
		}

		const data = await response.json();
		const videoDetails = data?.videoDetails;

		if (!videoDetails?.lengthSeconds) {
			throw new Error("Could not extract duration from video metadata");
		}

		const duration = parseInt(videoDetails.lengthSeconds, 10);
		if (Number.isNaN(duration) || duration <= 0) {
			throw new Error("Invalid duration extracted from video");
		}

		return duration;
	} catch (error) {
		console.error("Failed to get video duration:", error);
		throw new Error(`Failed to get video duration: ${error instanceof Error ? error.message : "Unknown error"}`);
	}
}

/**
 * Get full video metadata including duration and title
 */
export async function getVideoMetadata(videoUrl: string): Promise<VideoMetadata> {
	const videoId = extractVideoId(videoUrl);
	if (!videoId) {
		throw new Error("Invalid YouTube URL");
	}

	try {
		const response = await fetch("https://www.youtube.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
				Referer: "https://www.youtube.com/",
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
		});

		if (!response.ok) {
			throw new Error(`YouTube API request failed: ${response.status}`);
		}

		const data = await response.json();
		const videoDetails = data?.videoDetails;

		if (!videoDetails?.lengthSeconds) {
			throw new Error("Could not extract video metadata");
		}

		const duration = parseInt(videoDetails.lengthSeconds, 10);
		if (Number.isNaN(duration) || duration <= 0) {
			throw new Error("Invalid duration extracted from video");
		}

		return {
			duration,
			title: videoDetails.title || "Unknown Video",
			videoId,
		};
	} catch (error) {
		console.error("Failed to get video metadata:", error);
		throw new Error(`Failed to get video metadata: ${error instanceof Error ? error.message : "Unknown error"}`);
	}
}

/**
 * Calculate chunking parameters for a video
 */
export interface ChunkingParams {
	chunkCount: number;
	chunkDuration: number; // in seconds
	chunks: Array<{
		index: number;
		startTime: number;
		duration: number;
	}>;
}

/**
 * Calculate how to chunk a video for processing
 */
export function calculateVideoChunks(totalDurationSeconds: number, maxChunkDurationSeconds = 30 * 60): ChunkingParams {
	// Default to 30-minute chunks, but allow override
	const chunkDuration = Math.min(maxChunkDurationSeconds, totalDurationSeconds);
	const chunkCount = Math.ceil(totalDurationSeconds / chunkDuration);

	const chunks = Array.from({ length: chunkCount }, (_, i) => {
		const startTime = i * chunkDuration;
		// For the last chunk, use remaining duration
		const duration = i === chunkCount - 1 ? totalDurationSeconds - startTime : chunkDuration;

		return {
			index: i,
			startTime,
			duration,
		};
	});

	return {
		chunkCount,
		chunkDuration,
		chunks,
	};
}
