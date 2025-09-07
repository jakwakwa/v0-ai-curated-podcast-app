import { extractAudioDuration } from "@/lib/audio-metadata"
import { getStorageUploader } from "@/lib/gcs"
import { prisma } from "@/lib/prisma"

/**
 * Extract duration from existing audio files stored in GCS
 */
export async function extractDurationFromGCSFile(gcsUrl: string): Promise<number | null> {
	try {
		// Parse GCS URL to get bucket and file path
		const url = new URL(gcsUrl.replace("gs://", "gs://"))
		const bucketName = url.hostname
		const filePath = url.pathname.substring(1) // Remove leading slash

		console.log(`Downloading audio file from GCS: ${bucketName}/${filePath}`)

		const uploader = getStorageUploader()
		const file = uploader.bucket(bucketName).file(filePath)

		// Check if file exists
		const [exists] = await file.exists()
		if (!exists) {
			console.warn(`File does not exist: ${gcsUrl}`)
			return null
		}

		// Download file content
		const [buffer] = await file.download()

		// Extract duration using our existing audio metadata library
		const duration = extractAudioDuration(buffer, "audio/wav")

		console.log(`Extracted duration for ${filePath}: ${duration ? `${duration}s` : "unknown"}`)
		return duration
	} catch (error) {
		console.error(`Failed to extract duration from ${gcsUrl}:`, error)
		return null
	}
}

/**
 * Update duration for all UserEpisodes that have missing duration_seconds
 */
export async function updateMissingUserEpisodeDurations(): Promise<{ updated: number; failed: number }> {
	const episodesWithoutDuration = await prisma.userEpisode.findMany({
		where: {
			gcs_audio_url: { not: null },
			duration_seconds: null,
			status: "COMPLETED",
		},
		select: {
			episode_id: true,
			gcs_audio_url: true,
			episode_title: true,
		},
	})

	console.log(`Found ${episodesWithoutDuration.length} user episodes without duration`)

	let updated = 0
	let failed = 0

	for (const episode of episodesWithoutDuration) {
		if (!episode.gcs_audio_url) continue

		console.log(`Processing episode: ${episode.episode_title}`)

		const duration = await extractDurationFromGCSFile(episode.gcs_audio_url)

		if (duration !== null && duration > 0) {
			await prisma.userEpisode.update({
				where: { episode_id: episode.episode_id },
				data: { duration_seconds: duration },
			})
			updated++
			console.log(`✅ Updated duration for "${episode.episode_title}": ${duration}s`)
		} else {
			failed++
			console.log(`❌ Failed to extract duration for "${episode.episode_title}"`)
		}
	}

	return { updated, failed }
}

/**
 * Update duration for all Episodes that have missing duration_seconds
 */
export async function updateMissingEpisodeDurations(): Promise<{ updated: number; failed: number }> {
	const episodesWithoutDuration = await prisma.episode.findMany({
		where: {
			duration_seconds: null,
		},
		select: {
			episode_id: true,
			audio_url: true,
			title: true,
		},
		take: 50, // Limit to avoid timeout, can run multiple times
	})

	console.log(`Found ${episodesWithoutDuration.length} regular episodes without duration`)

	let updated = 0
	let failed = 0

	for (const episode of episodesWithoutDuration) {
		console.log(`Processing episode: ${episode.title}`)

		// For regular episodes, we can only extract duration if they're stored in our GCS
		// Skip external URLs that don't start with gs://
		if (!episode.audio_url.startsWith("gs://")) {
			console.log(`⏭️ Skipping external URL: ${episode.audio_url}`)
			failed++
			continue
		}

		const duration = await extractDurationFromGCSFile(episode.audio_url)

		if (duration !== null && duration > 0) {
			await prisma.episode.update({
				where: { episode_id: episode.episode_id },
				data: { duration_seconds: duration },
			})
			updated++
			console.log(`✅ Updated duration for "${episode.title}": ${duration}s`)
		} else {
			failed++
			console.log(`❌ Failed to extract duration for "${episode.title}"`)
		}
	}

	return { updated, failed }
}
