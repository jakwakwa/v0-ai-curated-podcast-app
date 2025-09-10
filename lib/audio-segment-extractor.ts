/**
 * Audio segment extraction utilities for chunking long videos
 * Uses ffmpeg to extract specific time segments from video URLs
 */

import { spawn } from "child_process";
import { unlink } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { promisify } from "util";

const unlinkAsync = promisify(unlink);

export interface AudioSegment {
	buffer: Buffer;
	mimeType: string;
	duration: number;
}

/**
 * Extract a specific audio segment from a video URL using ffmpeg
 * @param videoUrl - The source video URL (YouTube, etc.)
 * @param startTime - Start time in seconds
 * @param duration - Duration in seconds
 * @returns Audio segment as buffer with metadata
 */
export async function extractAudioSegment(videoUrl: string, startTime: number, duration: number): Promise<AudioSegment> {
	const tempFile = join(tmpdir(), `audio-segment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.wav`);

	try {
		// Use ffmpeg to extract the audio segment
		await new Promise<void>((resolve, reject) => {
			const ffmpeg = spawn(
				"ffmpeg",
				[
					"-i",
					videoUrl,
					"-ss",
					startTime.toString(),
					"-t",
					duration.toString(),
					"-acodec",
					"pcm_s16le", // 16-bit PCM
					"-ar",
					"16000", // 16kHz sample rate (good for speech)
					"-ac",
					"1", // Mono
					"-f",
					"wav",
					"-y", // Overwrite output file
					tempFile,
				],
				{
					stdio: ["ignore", "pipe", "pipe"],
				}
			);

			let stderr = "";

			ffmpeg.stderr?.on("data", data => {
				stderr += data.toString();
			});

			ffmpeg.on("close", code => {
				if (code === 0) {
					resolve();
				} else {
					reject(new Error(`ffmpeg failed with code ${code}: ${stderr}`));
				}
			});

			ffmpeg.on("error", error => {
				reject(new Error(`ffmpeg spawn error: ${error.message}`));
			});
		});

		// Read the extracted audio file
		const fs = await import("fs");
		const buffer = await fs.promises.readFile(tempFile);

		// Clean up temp file
		await unlinkAsync(tempFile);

		return {
			buffer,
			mimeType: "audio/wav",
			duration,
		};
	} catch (error) {
		// Clean up temp file on error
		try {
			await unlinkAsync(tempFile);
		} catch {}

		throw new Error(`Failed to extract audio segment: ${error instanceof Error ? error.message : "Unknown error"}`);
	}
}

/**
 * Extract audio segment and return as base64 string for API compatibility
 */
export async function extractAudioSegmentAsBase64(videoUrl: string, startTime: number, duration: number): Promise<{ data: string; mimeType: string; duration: number }> {
	const segment = await extractAudioSegment(videoUrl, startTime, duration);

	return {
		data: segment.buffer.toString("base64"),
		mimeType: segment.mimeType,
		duration: segment.duration,
	};
}

/**
 * Check if ffmpeg is available on the system
 */
export async function checkFFmpegAvailability(): Promise<boolean> {
	return new Promise(resolve => {
		const ffmpeg = spawn("ffmpeg", ["-version"], { stdio: "ignore" });

		ffmpeg.on("close", code => {
			resolve(code === 0);
		});

		ffmpeg.on("error", () => {
			resolve(false);
		});
	});
}
