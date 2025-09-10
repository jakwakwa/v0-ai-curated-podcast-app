/**
 * Audio stitching utilities for combining TTS chunks
 * Uses ffmpeg to concatenate multiple audio files into a single file
 */

import { spawn } from "child_process";
import { unlink } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { promisify } from "util";

const unlinkAsync = promisify(unlink);

export interface AudioChunk {
	buffer: Buffer;
	mimeType: string;
	index: number;
}

/**
 * Stitch multiple audio chunks into a single audio file
 * @param chunks - Array of audio chunks with their index for ordering
 * @returns Combined audio buffer
 */
export async function stitchAudioChunks(chunks: AudioChunk[]): Promise<Buffer> {
	if (chunks.length === 0) {
		throw new Error("No audio chunks provided for stitching");
	}

	if (chunks.length === 1) {
		return chunks[0].buffer;
	}

	// Sort chunks by index to ensure correct order
	const sortedChunks = [...chunks].sort((a, b) => a.index - b.index);

	// Create temporary files for each chunk
	const tempFiles: string[] = [];

	try {
		// Write each chunk to a temporary file
		for (const chunk of sortedChunks) {
			const tempFile = join(tmpdir(), `audio-chunk-${chunk.index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.wav`);
			await new Promise<void>((resolve, reject) => {
				const fs = require("fs");
				fs.writeFile(tempFile, chunk.buffer, (err: any) => {
					if (err) reject(err);
					else resolve();
				});
			});
			tempFiles.push(tempFile);
		}

		// Create output file
		const outputFile = join(tmpdir(), `stitched-audio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.wav`);

		// Use ffmpeg to concatenate all files
		await new Promise<void>((resolve, reject) => {
			// Create a file list for ffmpeg
			const fileList = tempFiles.map(file => `file '${file}'`).join("\n");
			const listFile = join(tmpdir(), `filelist-${Date.now()}.txt`);

			// Write file list
			const fs = require("fs");
			fs.writeFileSync(listFile, fileList);

			const ffmpeg = spawn(
				"ffmpeg",
				[
					"-f",
					"concat",
					"-safe",
					"0",
					"-i",
					listFile,
					"-c",
					"copy",
					"-y", // Overwrite output file
					outputFile,
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
				// Clean up file list
				try {
					fs.unlinkSync(listFile);
				} catch {}

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

		// Read the stitched audio file
		const fs = await import("fs");
		const buffer = await fs.promises.readFile(outputFile);

		// Clean up all temporary files
		for (const tempFile of tempFiles) {
			try {
				await unlinkAsync(tempFile);
			} catch {}
		}
		try {
			await unlinkAsync(outputFile);
		} catch {}

		return buffer;
	} catch (error) {
		// Clean up all temporary files on error
		for (const tempFile of tempFiles) {
			try {
				await unlinkAsync(tempFile);
			} catch {}
		}

		throw new Error(`Failed to stitch audio chunks: ${error instanceof Error ? error.message : "Unknown error"}`);
	}
}

/**
 * Stitch audio chunks from GCS URLs
 * Downloads each chunk and stitches them together
 */
export async function stitchAudioChunksFromUrls(chunkUrls: string[]): Promise<Buffer> {
	const chunks: AudioChunk[] = [];

	for (let i = 0; i < chunkUrls.length; i++) {
		const url = chunkUrls[i];
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to download audio chunk ${i}: ${response.statusText}`);
		}

		const buffer = Buffer.from(await response.arrayBuffer());
		chunks.push({
			buffer,
			mimeType: "audio/wav", // Assume WAV format
			index: i,
		});
	}

	return await stitchAudioChunks(chunks);
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
