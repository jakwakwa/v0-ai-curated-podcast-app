import { GoogleGenerativeAI, type Part } from "@google/generative-ai";
import { spawn } from "node:child_process";

// Point fluent-ffmpeg to the installed binary

const PROMPT = `Please transcribe the following audio segment accurately. Provide only the transcribed text. Do not include any additional commentary, introductory phrases like "Here is the transcription:", or summaries. The audio is a segment of a larger file, so do not add a beginning or an end.`;

const _SUPER_PROMPT = `Based on the url provided, Summarise the key moments and highlights of the podcast into a podcast style write a two-host podcast conversation. Alternate speakers naturally. Keep it around 3-5 minutes.

Requirements:
- Do not include stage directions or timestamps
- NO sound effects, music cues, or descriptive text in brackets
- NO stage directions or production notes
- ONLY include spoken dialogue that will be read aloud
- Write as if the hosts are speaking directly to each other and the audience

Output ONLY valid JSON array of objects with fields: speaker ("A" or "B") and text (string). No markdown. script of approximately 350 words (enough for about a 4-minute podcast). Include a witty introduction, smooth transitions between topics, and a concise conclusion. Make it engaging, easy to listen to, and maintain a friendly and informative tone. **The script should only contain the spoken words without: (e.g., "Host:"), sound effects, specific audio cues, structural markers (e.g., "section 1", "ad breaks"), or timing instructions (e.g., "2 minutes").** Cover most interesting themes from the summary. Always start the script as follows: "Feeling lost in the noise? This summary is brought to you by Podslice. We filter out the fluff, the filler, and the drawn-out discussions, leaving you with pure, actionable knowledge. In a world full of chatter, we help you find the insight."`;

export async function transcribeWithGeminiFromUrl(
	url: string, 
	startTime?: number, 
	duration?: number
): Promise<string | null> {
	const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
	if (!apiKey) {
		throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set.");
	}

	try {
		const modelName = process.env.GEMINI_TRANSCRIBE_MODEL || "gemini-2.5-flash";

		const genAI = new GoogleGenerativeAI(apiKey);
		const model = genAI.getGenerativeModel({ model: modelName });

		let mediaPart: Part;

		// If we have startTime and duration, we need to stream the video segment
		if (startTime !== undefined && duration !== undefined) {
			console.log(`[GEMINI] Processing video chunk: ${startTime}s-${startTime + duration}s`);
			
			// Get video stream from YouTube and process the segment
			const videoBuffer = await getVideoSegmentBuffer(url, startTime, duration);
			
			// Convert buffer to base64 for Gemini API
			const base64Data = videoBuffer.toString('base64');
			mediaPart = { 
				inlineData: { 
					data: base64Data, 
					mimeType: "video/mp4" 
				} 
			};
		} else {
			// Original behavior for non-chunked videos
			mediaPart = { fileData: { fileUri: url, mimeType: "video/*" } };
		}

		// Let the caller control timeout; this call may legitimately take >2 minutes.
		const result = await model.generateContent([PROMPT, mediaPart]);

		return result.response.text();
	} catch (error) {
		console.error("[GEMINI][youtube-url] Error:", error);
		throw error;
	}
}

/**
 * Get a video segment as a buffer using ytdl-core and ffmpeg
 */
async function getVideoSegmentBuffer(url: string, startTime: number, duration: number): Promise<Buffer> {
	try {
		// Import ytdl-core dynamically
		const ytdl = (await import('@distube/ytdl-core')).default ?? (await import('@distube/ytdl-core'));
		
		// Extract video ID from URL
		const { extractVideoId } = await import('@/lib/transcripts/utils/youtube-audio');
		const videoId = extractVideoId(url);
		if (!videoId) {
			throw new Error('Invalid YouTube URL - could not extract video ID');
		}

		const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
		
		// Get video stream from ytdl-core
		const videoStream = ytdl(youtubeUrl, {
			quality: 'highestaudio',
			filter: 'audioonly'
		});

		// Use ffmpeg to extract the segment
		const ffmpegArgs = [
			'-i', 'pipe:0',  // Input from stdin
			'-ss', startTime.toString(),  // Start time
			'-t', duration.toString(),    // Duration
			'-c:a', 'aac',   // Audio codec
			'-f', 'mp4',     // Output format
			'-movflags', 'frag_keyframe+empty_moov', // Make it streamable
			'pipe:1'         // Output to stdout
		];

		return new Promise((resolve, reject) => {
			const ffmpeg = spawn('ffmpeg', ffmpegArgs);
			const chunks: Buffer[] = [];

			// Pipe ytdl stream to ffmpeg
			videoStream.pipe(ffmpeg.stdin);

			// Collect output chunks
			ffmpeg.stdout.on('data', (chunk) => {
				chunks.push(chunk);
			});

			// Handle errors
			ffmpeg.stderr.on('data', (data) => {
				console.error(`[FFMPEG] Error: ${data.toString()}`);
			});

			ffmpeg.on('close', (code) => {
				if (code === 0) {
					resolve(Buffer.concat(chunks));
				} else {
					reject(new Error(`FFmpeg process exited with code ${code}`));
				}
			});

			ffmpeg.on('error', (error) => {
				reject(error);
			});

			// Handle ytdl stream errors
			videoStream.on('error', (error) => {
				reject(error);
			});
		});
		
	} catch (error) {
		console.error('[GEMINI] Error processing video segment:', error);
		throw error;
	}
}
