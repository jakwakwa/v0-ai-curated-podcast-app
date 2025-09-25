import { getYouTubeVideoDurationSeconds } from "@/lib/youtube-safe";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, type Part } from "@google/generative-ai";

// --- Gemini API Configuration ---

const generationConfig = {
	temperature: 0.2,
	topK: 32,
	topP: 1,
	maxOutputTokens: 8192,
};

const safetySettings = [
	{
		category: HarmCategory.HARM_CATEGORY_HARASSMENT,
		threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
		threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
		threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
		threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
	},
];

const _PROMPT = `Please transcribe the following video accurately. Provide only the transcribed text. Do not include any additional commentary, introductory phrases like "Here is the transcription:", or summaries.`;

// --- Type Definitions ---

type TranscriptionOptions = {
	startOffset?: string;
	endOffset?: string;
};

export interface ChunkOptions {
	chunkSeconds?: number; // default 1800 (30 min)
	overlapSeconds?: number; // default 0
}

// --- Helper Functions ---

function pad2(n: number): string {
	return String(Math.floor(n)).padStart(2, "0");
}

function _formatTimestamp(seconds: number): string {
	const s = Math.max(0, Math.floor(seconds));
	const hrs = Math.floor(s / 3600);
	const mins = Math.floor((s % 3600) / 60);
	const secs = s % 60;
	return hrs > 0 ? `${pad2(hrs)}:${pad2(mins)}:${pad2(secs)}` : `${pad2(mins)}:${pad2(secs)}`;
}

// --- Transcription Functions ---

/**
 * Transcribes a video from a YouTube URL using the Gemini API.
 * It can transcribe the full video or a specific segment if offsets are provided.
 * This function is called by the Inngest worker for each individual chunk.
 * @param url The YouTube video URL.
 * @param options Optional start and end offsets for video clipping (e.g., "0s", "300s").
 * @returns The transcribed text as a string.
 */
export async function transcribeWithGeminiFromUrl(url: string, options?: TranscriptionOptions): Promise<string> {
	const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
	if (!apiKey) {
		throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set.");
	}

	try {
		const modelName = process.env.GEMINI_TRANSCRIBE_MODEL || "gemini-1.5-flash";
		const genAI = new GoogleGenerativeAI(apiKey);
		const model = genAI.getGenerativeModel({ model: modelName });

		const videoPart: Part = {
			fileData: {
				mimeType: "video/mp4",
				fileUri: url,
				...(options?.startOffset && { startOffset: options.startOffset }),
				...(options?.endOffset && { endOffset: options.endOffset }),
			},
		};

		const parts = [{ text: "Transcribe the audio from this video clip." }, videoPart];

		const result = await model.generateContent({
			contents: [{ role: "user", parts }],
			generationConfig,
			safetySettings,
		});

		const response = result.response;
		const transcription = response.text();

		if (!transcription) {
			console.warn(`Gemini returned an empty transcript for URL: ${url} and options: ${JSON.stringify(options)}`);
			return "";
		}

		return transcription.trim();
	} catch (error) {
		console.error(`Error transcribing with Gemini for URL: ${url}`, error);
		throw new Error(`Gemini API request failed: ${error instanceof Error ? error.message : "Unknown error"}`);
	}
}

/**
 * NOTE: This function provides an alternative, self-contained chunking mechanism.
 * The primary, recommended approach is the Inngest worker (`gemini-video-worker.ts`)
 * which provides better observability and parallelization.
 */
export async function transcribeWithGeminiFromUrlChunked(url: string, options?: ChunkOptions): Promise<string | null> {
	const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
	if (!apiKey) {
		throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set.");
	}

	const _modelName = process.env.GEMINI_TRANSCRIBE_MODEL || "gemini-1.5-flash";
	const chunkSeconds = Math.max(60, options?.chunkSeconds ?? 1800);
	const overlapSeconds = Math.max(0, options?.overlapSeconds ?? 0);

	const durationSeconds = await getYouTubeVideoDurationSeconds(url);
	if (!durationSeconds || durationSeconds <= 0) {
		// Fallback to single-call transcription if duration cannot be determined
		return await transcribeWithGeminiFromUrl(url);
	}

	if (durationSeconds <= chunkSeconds) {
		return await transcribeWithGeminiFromUrl(url);
	}

	const chunks: Array<{ start: number; end: number }> = [];
	let start = 0;
	while (start < durationSeconds) {
		const end = Math.min(durationSeconds, start + chunkSeconds);
		chunks.push({
			start: Math.max(0, start - (chunks.length > 0 ? overlapSeconds : 0)),
			end,
		});
		start = end;
	}

	const transcripts: string[] = [];
	for (const c of chunks) {
		// Execute sequentially to avoid heavy concurrent video fetches
		const t = await transcribeWithGeminiFromUrl(url, {
			startOffset: `${c.start}s`,
			endOffset: `${c.end}s`,
		});
		const clean = t?.trim();
		if (clean) transcripts.push(clean);
	}

	if (transcripts.length === 0) return null;
	return transcripts.join("\n\n");
}
