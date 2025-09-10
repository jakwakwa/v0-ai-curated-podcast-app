import { GoogleGenerativeAI, type Part } from "@google/generative-ai";
import { withTimeout } from "../utils";

// Point fluent-ffmpeg to the installed binary

const PROMPT = `Please transcribe the following audio segment accurately. Provide only the transcribed text. Do not include any additional commentary, introductory phrases like "Here is the transcription:", or summaries. The audio is a segment of a larger file, so do not add a beginning or an end.`;

/**
 * Converts a local file buffer into the format required for a Gemini API call.
 */
function _bufferToGenerativePart(buffer: Buffer, mimeType: string): Part {
	return {
		inlineData: {
			data: buffer.toString("base64"),
			mimeType,
		},
	};
}

/**
 * Uses ffprobe (part of ffmpeg) to get the duration of an audio file in seconds.
 */
// function _getAudioDuration(filePath: string): Promise<number> {
// 	return new Promise((resolve, reject) => {
// 		ffmpeg.ffprobe(filePath, (err, metadata) => {
// 			if (err) {
// 				return reject(new Error(`ffprobe failed: ${err.message}`))
// 			}
// 			resolve(metadata.format.duration || 0)
// 		})
// 	})
// }

/**
 * Uses ffmpeg to extract a segment from a larger audio file and returns it as a buffer.
 */
// function _createAudioChunk(inputPath: string, outputPath: string, startTime: number, duration: number): Promise<Buffer> {
// 	return new Promise((resolve, reject) => {
// 		ffmpeg(inputPath)
// 			.setStartTime(startTime)
// 			.setDuration(duration)
// 			.toFormat("mp3") // Standardise to mp3 for smaller size and API compatibility
// 			.on("error", err => reject(new Error(`ffmpeg processing failed: ${err.message}`)))
// 			.on("end", () => {
// 				fs.readFile(outputPath).then(resolve).catch(reject)
// 			})
// 			.save(outputPath)
// 	})
// }

/**
 * Transcribes a media URL using Gemini by breaking it into manageable chunks.
 */
export async function transcribeWithGeminiFromUrl(url: string): Promise<string | null> {
	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) {
		throw new Error("GEMINI_API_KEY is not set.");
	}

	try {
		const genAI = new GoogleGenerativeAI(apiKey);
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

		const mediaPart: Part = { fileData: { fileUri: url, mimeType: "video/*" } };

		// Add timeout wrapper around the API call
		const result = await withTimeout(
			model.generateContent([PROMPT, mediaPart]),
			50000, // 50 seconds - leave buffer for other operations
			"Gemini API call timed out"
		);

		return result.response.text();
	} catch (error) {
		console.error("[GEMINI][youtube-url] Error:", error);
		throw error;
	}
}
