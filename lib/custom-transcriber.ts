/**
 * Custom transcriber using audio extraction + OpenAI Whisper
 */

import { randomUUID } from "node:crypto"
import type { ReadStream } from "node:fs"
import { createReadStream } from "node:fs"
import { mkdtemp, readFile, unlink, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import type { Readable } from "node:stream"
import ytdl from "@distube/ytdl-core"
import ffmpegStatic from "ffmpeg-static"
import ffmpeg from "fluent-ffmpeg"
import OpenAI from "openai"

ffmpeg.setFfmpegPath(ffmpegStatic as unknown as string)

let _openaiClient: OpenAI | null = null
function getOpenAIClient(): OpenAI {
	const apiKey = process.env.OPENAI_API_KEY
	if (!_openaiClient) {
		if (!apiKey) {
			throw new Error("OpenAI API key not configured")
		}
		_openaiClient = new OpenAI({ apiKey })
	}
	return _openaiClient
}

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
		// Block on Vercel unless explicitly enabled
		const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true"
		const enableServerYtdl = process.env.ENABLE_SERVER_YTDL === "true"
		if (isVercel && !enableServerYtdl) {
			throw new Error("Sign in to confirm you’re not a bot")
		}
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

		const openai = getOpenAIClient()
		const transcription = await openai.audio.transcriptions.create({
			file: fileStream as ReadStream & { name?: string },
			model: "whisper-1",
			language: "en",
			response_format: "text",
			temperature: 0.2,
		})

		return transcription as unknown as string
	} catch (error) {
		console.error("Error transcribing with Whisper:", error)
		throw new Error(`Transcription failed: ${error instanceof Error ? error.message : "Unknown error"}`)
	}
}

async function compressAudioToMono16k(inputPath: string): Promise<{ outputPath: string; size: number }> {
	const outputPath = inputPath.replace(/\.(webm|mp4|m4a|mp3|wav|aac|flac)$/i, "_compressed.mp3")
	await new Promise<void>((resolve, reject) => {
		ffmpeg(inputPath)
			.audioChannels(1)
			.audioFrequency(16000)
			.audioCodec("libmp3lame")
			.audioBitrate("64k")
			.on("end", () => resolve())
			.on("error", (err: unknown) => reject(err))
			.save(outputPath)
	})
	const buf = await readFile(outputPath)
	return { outputPath, size: buf.length }
}

async function splitAudioIfNeeded(inputPath: string, maxBytes: number): Promise<string[]> {
	const statBuf = await readFile(inputPath)
	if (statBuf.length <= maxBytes) return [inputPath]
	// Rough duration probe then split by duration proportionally
	const probe = await new Promise<{ durationSec: number }>((resolve, reject) => {
		ffmpeg.ffprobe(inputPath, (err: unknown, data: { format?: { duration?: number | string } }) => {
			if (err) return reject(err)
			const raw = data?.format?.duration
			const durationSec = typeof raw === "string" ? parseFloat(raw) : typeof raw === "number" ? raw : 0
			resolve({ durationSec })
		})
	})
	const parts: string[] = []
	const numChunks = Math.ceil(statBuf.length / maxBytes)
	const chunkDur = probe.durationSec > 0 ? probe.durationSec / numChunks : 600
	const tempDir = await mkdtemp(join(tmpdir(), "yt-chunks-"))
	for (let i = 0; i < numChunks; i++) {
		const out = join(tempDir, `chunk_${i}.mp3`)
		await new Promise<void>((resolve, reject) => {
			ffmpeg(inputPath)
				.seekInput(i * chunkDur)
				.duration(chunkDur)
				.audioChannels(1)
				.audioFrequency(16000)
				.audioCodec("libmp3lame")
				.audioBitrate("64k")
				.on("end", () => resolve())
				.on("error", (err: unknown) => reject(err))
				.save(out)
		})
		parts.push(out)
	}
	return parts
}

/**
 * Main transcription function
 */
export async function transcribeYouTubeVideo(videoUrl: string): Promise<TranscriptionResult> {
	let tempFilePath: string | null = null
	let tempCompressedPath: string | null = null

	try {
		// Validate OpenAI API key
		if (!process.env.OPENAI_API_KEY) {
			return {
				success: false,
				error: "OpenAI API key not configured",
			}
		}

		console.log("Starting custom transcription for:", videoUrl)

		// Step 1: Extract audio from YouTube (may be gated by environment)
		const { stream } = await extractAudioFromYouTube(videoUrl)

		// Step 2: Save audio to temporary file
		const filename = `audio_${randomUUID()}.webm`
		const { filePath, size } = await saveStreamToFile(stream, filename)
		tempFilePath = filePath

		console.log(`Audio saved: ${size} bytes`)

		// Step 3: Compress to fit under 25MB if needed
		const maxSize = 25 * 1024 * 1024
		let toTranscribe = filePath
		let workingSize = size
		if (size > maxSize) {
			const compressed = await compressAudioToMono16k(filePath)
			tempCompressedPath = compressed.outputPath
			workingSize = compressed.size
			toTranscribe = tempCompressedPath
			console.log(`Compressed audio size: ${workingSize} bytes`)
		}

		if (workingSize > maxSize) {
			// Optional: chunk and transcribe sequentially
			const chunks = await splitAudioIfNeeded(toTranscribe, maxSize)
			let fullText = ""
			for (const chunkPath of chunks) {
				const part = await transcribeWithWhisper(chunkPath)
				fullText += (fullText ? "\n" : "") + part
			}
			return { success: true, transcript: fullText, audioSize: workingSize }
		}

		// Step 4: Transcribe with Whisper
		const transcript = await transcribeWithWhisper(toTranscribe)

		console.log(`Transcription completed: ${transcript.length} characters`)

		return {
			success: true,
			transcript,
			audioSize: workingSize,
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
		if (tempCompressedPath) {
			try {
				await unlink(tempCompressedPath)
			} catch {}
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
