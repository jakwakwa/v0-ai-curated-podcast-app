/**
 * @file Centralized configuration for video processing based on environment.
 * This file dynamically calculates and provides settings for timeouts,
 * video duration limits, and other processing parameters.
 */

// Define the structure for our processing configuration
interface ProcessingConfig {
	// The maximum allowed duration of an input video in seconds.
	maxVideoDurationSeconds: number;
	// The maximum allowed duration of an input video in minutes (for client-side display).
	maxVideoDurationMinutes: number;
	// The total time window in seconds for the entire transcription saga to complete.
	providerTotalWindowSeconds: number;
	// The duration of each video chunk in seconds for transcription.
	chunkDurationSeconds: number;
	// The timeout in milliseconds for a single chunk's transcription API call.
	geminiTranscriptionTimeoutMs: number;
	// The target length in minutes for the final generated audio episode.
	episodeTargetMinutes: number;
}

// Configuration for a Vercel "Hobby" (Free) plan with a ~5-minute function timeout.
const HOBBY_PLAN_CONFIG: ProcessingConfig = {
	maxVideoDurationSeconds: 60 * 60, // 60 minutes
	maxVideoDurationMinutes: 60,
	providerTotalWindowSeconds: 270, // 4.5 minutes to stay safely within the 5-min limit
	chunkDurationSeconds: 300, // 5-minute chunks
	geminiTranscriptionTimeoutMs: 120000, // 2 minutes per chunk
	episodeTargetMinutes: 5,
};

// Configuration for a Vercel "Pro" plan with a ~15-minute function timeout.
const PRO_PLAN_CONFIG: ProcessingConfig = {
	maxVideoDurationSeconds: 60 * 60, // 60 minutes
	maxVideoDurationMinutes: 60,
	providerTotalWindowSeconds: 840, // 14 minutes to stay safely within the 15-min limit
	chunkDurationSeconds: 300, // 5-minute chunks
	geminiTranscriptionTimeoutMs: 240000, // 4 minutes per chunk
	episodeTargetMinutes: 5,
};

// Unlimited configuration for local development or powerful backend servers.
const UNLIMITED_CONFIG: ProcessingConfig = {
	maxVideoDurationSeconds: 4 * 60 * 60, // 4 hours
	maxVideoDurationMinutes: 240,
	providerTotalWindowSeconds: 3600, // 1 hour
	chunkDurationSeconds: 600, // 10-minute chunks
	geminiTranscriptionTimeoutMs: 300000, // 5 minutes per chunk
	episodeTargetMinutes: 10,
};

/**
 * Gets the processing configuration based on the VERCEL_PLAN_LIMIT environment variable.
 * This ensures that the application's processing limits and timeouts are
 * dynamically adjusted to the capabilities of the hosting environment.
 *
 * @returns {ProcessingConfig} The appropriate processing configuration object.
 */
export function getProcessingConfig(): ProcessingConfig {
	const plan = process.env.VERCEL_PLAN_LIMIT?.toUpperCase();
	switch (plan) {
		case "HOBBY":
			console.log("Using HOBBY plan processing configuration.");
			return HOBBY_PLAN_CONFIG;
		case "PRO":
			console.log("Using PRO plan processing configuration.");
			return PRO_PLAN_CONFIG;
		default:
			console.log("Using UNLIMITED (local/default) processing configuration.");
			return UNLIMITED_CONFIG;
	}
}
