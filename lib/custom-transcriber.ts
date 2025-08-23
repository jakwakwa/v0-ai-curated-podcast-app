/**
 * Custom transcriber using audio extraction + OpenAI Whisper
 */

import { randomUUID } from "node:crypto"
import type { ReadStream } from "node:fs"
import { createReadStream } from "node:fs"
import { unlink, writeFile } from "node:fs/promises"
import { join } from "node:path"
import type { Readable } from "node:stream"
import ytdl from "@distube/ytdl-core"
import OpenAI from "openai"

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

export interface TranscriptionResult {
	success: boolean
	transcript?: string
	duration?: number
	error?: string
	audioSize?: number
}

/**
 * Extract audio stream from YouTube video
 */
async function extractAudioFromYouTube(videoUrl: string): Promise<{ stream: Readable; contentLength?: number }> {
	try {
		console.log("Extracting audio from YouTube video:", videoUrl)

		// Get video info
		const info = await ytdl.getInfo(videoUrl)

		// Find the best audio-only format
		const audioFormats = ytdl.filterFormats(info.formats, "audioonly")

		if (audioFormats.length === 0) {
			throw new Error("No audio formats available for this video")
		}

		// Prefer formats in order: webm, mp4 (m4a typically uses mp4 container)
		const preferredFormat = audioFormats.find(format => format.container === "webm" || format.container === "mp4") || audioFormats[0]

		console.log(`Selected audio format: ${preferredFormat.container} (${preferredFormat.audioBitrate}kbps)`)

		// Create audio stream
		const audioStream = ytdl(videoUrl, {
			format: preferredFormat,
			quality: "highestaudio",
		})

		return {
			stream: audioStream,
			contentLength: preferredFormat.contentLength ? parseInt(preferredFormat.contentLength) : undefined,
		}
	} catch (error) {
		console.error("Error extracting audio from YouTube:", error)
		throw new Error(`Failed to extract audio: ${error instanceof Error ? error.message : "Unknown error"}`)
	}
}

/**
 * Save stream to temporary file
 */
async function saveStreamToFile(stream: Readable, filename: string): Promise<{ filePath: string; size: number }> {
	const tempDir = process.env.TEMP_DIR || "/tmp"
	const filePath = join(tempDir, filename)

	const chunks: Buffer[] = []

	return new Promise((resolve, reject) => {
		stream.on("data", chunk => {
			chunks.push(chunk)
		})

		stream.on("end", async () => {
			try {
				const buffer = Buffer.concat(chunks)
				await writeFile(filePath, buffer)
				resolve({ filePath, size: buffer.length })
			} catch (error) {
				reject(error)
			}
		})

		stream.on("error", reject)
	})
}

/**
 * Transcribe audio file using OpenAI Whisper
 */
async function transcribeWithWhisper(filePath: string): Promise<string> {
	try {
		console.log("Transcribing audio with OpenAI Whisper...")

		// Create a readable stream from the file
		const fileStream = createReadStream(filePath)

		const transcription = await openai.audio.transcriptions.create({
			file: fileStream as ReadStream & { name?: string }, // Type ReadStream for OpenAI SDK
			model: "whisper-1",
			language: "en", // Can be made configurable
			response_format: "text",
			temperature: 0.2,
		})

		return transcription as string
	} catch (error) {
		console.error("Error transcribing with Whisper:", error)
		throw new Error(`Transcription failed: ${error instanceof Error ? error.message : "Unknown error"}`)
	}
}

/**
 * Main transcription function
 */
export async function transcribeYouTubeVideo(videoUrl: string): Promise<TranscriptionResult> {
	let tempFilePath: string | null = null

	try {
		// Validate OpenAI API key
		if (!process.env.OPENAI_API_KEY) {
			return {
				success: false,
				error: "OpenAI API key not configured",
			}
		}

		console.log("Starting custom transcription for:", videoUrl)

		// Step 1: Extract audio from YouTube
		const { stream } = await extractAudioFromYouTube(videoUrl)

		// Step 2: Save audio to temporary file
		const filename = `audio_${randomUUID()}.webm`
		const { filePath, size } = await saveStreamToFile(stream, filename)
		tempFilePath = filePath

		console.log(`Audio saved: ${size} bytes`)

		// Check file size limit (OpenAI Whisper has 25MB limit)
		const maxSize = 25 * 1024 * 1024 // 25MB
		if (size > maxSize) {
			throw new Error(`Audio file too large: ${(size / 1024 / 1024).toFixed(1)}MB (max 25MB)`)
		}

		// Step 3: Transcribe with Whisper
		const transcript = await transcribeWithWhisper(filePath)

		console.log(`Transcription completed: ${transcript.length} characters`)

		return {
			success: true,
			transcript,
			audioSize: size,
		}
	} catch (error) {
		console.error("Custom transcription failed:", error)
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown transcription error",
		}
	} finally {
		// Clean up temporary file
		if (tempFilePath) {
			try {
				await unlink(tempFilePath)
				console.log("Temporary audio file cleaned up")
			} catch (error) {
				console.warn("Failed to clean up temporary file:", error)
			}
		}
	}
}

/**
 * Alternative using stream processing (for larger files)
 */
export async function transcribeYouTubeVideoStream(videoUrl: string): Promise<TranscriptionResult> {
	try {
		console.log("Starting stream-based transcription for:", videoUrl)

		// Get video info first to check duration
		const info = await ytdl.getInfo(videoUrl)
		const duration = parseInt(info.videoDetails.lengthSeconds)

		// Check duration limit (let's say 30 minutes max for cost control)
		const maxDuration = 30 * 60 // 30 minutes
		if (duration > maxDuration) {
			return {
				success: false,
				error: `Video too long: ${Math.round(duration / 60)} minutes (max 30 minutes)`,
			}
		}

		// For now, fall back to file-based approach
		// In the future, we could implement chunked processing for very long videos
		return await transcribeYouTubeVideo(videoUrl)
	} catch (error) {
		console.error("Stream transcription failed:", error)
		return {
			success: false,
			error: error instanceof Error ? error.message : "Stream transcription error",
		}
	}
}

/**
 * Estimate transcription cost
 */
export function estimateTranscriptionCost(durationSeconds: number): number {
	// OpenAI Whisper pricing: $0.006 per minute
	const pricePerMinute = 0.006
	const minutes = durationSeconds / 60
	return minutes * pricePerMinute
}

/**
 * Check if video is suitable for transcription
 */
export async function validateVideoForTranscription(videoUrl: string): Promise<{
	valid: boolean
	duration?: number
	estimatedCost?: number
	error?: string
}> {
	try {
		const info = await ytdl.getInfo(videoUrl)
		const duration = parseInt(info.videoDetails.lengthSeconds)
		const estimatedCost = estimateTranscriptionCost(duration)

		// Check various limits
		if (duration > 30 * 60) {
			// 30 minutes
			return {
				valid: false,
				duration,
				estimatedCost,
				error: "Video exceeds 30-minute limit",
			}
		}

		if (estimatedCost > 1.0) {
			// $1 limit
			return {
				valid: false,
				duration,
				estimatedCost,
				error: `Estimated cost too high: $${estimatedCost.toFixed(3)}`,
			}
		}

		return {
			valid: true,
			duration,
			estimatedCost,
		}
	} catch (error) {
		return {
			valid: false,
			error: error instanceof Error ? error.message : "Validation error",
		}
	}
}
