import { GoogleGenerativeAI, type Part } from "@google/generative-ai";
import { getYouTubeVideoDurationSeconds } from "@/lib/youtube-safe";

// Point fluent-ffmpeg to the installed binary

const PROMPT = `Please transcribe the following video accurately. Provide only the transcribed text. Do not include any additional commentary, introductory phrases like "Here is the transcription:", or summaries.`;

const PROMPT_SEGMENT_PREFIX = `You will be given a YouTube video. Transcribe ONLY the segment between the following timestamps. Return plain transcript text without any extra words or headings.`;

const _SUPER_PROMPT = `Based on the url provided, Summarise the key moments and highlights of the podcast into a podcast style write a two-host podcast conversation. Alternate speakers naturally. Keep it around 3-5 minutes.

Requirements:
- Do not include stage directions or timestamps
- NO sound effects, music cues, or descriptive text in brackets
- NO stage directions or production notes
- ONLY include spoken dialogue that will be read aloud
- Write as if the hosts are speaking directly to each other and the audience

Output ONLY valid JSON array of objects with fields: speaker ("A" or "B") and text (string). No markdown. script of approximately 350 words (enough for about a 4-minute podcast). Include a witty introduction, smooth transitions between topics, and a concise conclusion. Make it engaging, easy to listen to, and maintain a friendly and informative tone. **The script should only contain the spoken words without: (e.g., "Host:"), sound effects, specific audio cues, structural markers (e.g., "section 1", "ad breaks"), or timing instructions (e.g., "2 minutes").** Cover most interesting themes from the summary. Always start the script as follows: "Feeling lost in the noise? This summary is brought to you by Podslice. We filter out the fluff, the filler, and the drawn-out discussions, leaving you with pure, actionable knowledge. In a world full of chatter, we help you find the insight."`;

export async function transcribeWithGeminiFromUrl(url: string): Promise<string | null> {
	const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
	if (!apiKey) {
		throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set.");
	}

	try {
		const modelName = process.env.GEMINI_TRANSCRIBE_MODEL || "gemini-2.5-flash";

		const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });

        const mediaPart: Part = { fileData: { fileUri: url, mimeType: "video/*" } };

		// Let the caller control timeout; this call may legitimately take >2 minutes.
        // Place the text instruction after the media input as per best practices
        const result = await model.generateContent([mediaPart, PROMPT]);

		return result.response.text();
	} catch (error) {
		console.error("[GEMINI][youtube-url] Error:", error);
		throw error;
	}
}

function pad2(n: number): string {
    return String(Math.floor(n)).padStart(2, "0");
}

function formatTimestamp(seconds: number): string {
    const s = Math.max(0, Math.floor(seconds));
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return hrs > 0 ? `${pad2(hrs)}:${pad2(mins)}:${pad2(secs)}` : `${pad2(mins)}:${pad2(secs)}`;
}

async function transcribeSegment(model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>, url: string, startSec: number, endSec: number): Promise<string> {
    const startTs = formatTimestamp(startSec);
    const endTs = formatTimestamp(endSec);
    const mediaPart: Part = { fileData: { fileUri: url, mimeType: "video/*" } };
    const segmentInstruction = `${PROMPT_SEGMENT_PREFIX}\nStart: ${startTs}\nEnd: ${endTs}`;
    const result = await model.generateContent([mediaPart, segmentInstruction]);
    return result.response.text();
}

export interface ChunkOptions {
    chunkSeconds?: number; // default 1800 (30 min)
    overlapSeconds?: number; // default 0
}

export async function transcribeWithGeminiFromUrlChunked(url: string, options?: ChunkOptions): Promise<string | null> {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
        throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set.");
    }

    const modelName = process.env.GEMINI_TRANSCRIBE_MODEL || "gemini-2.5-flash";
    const chunkSeconds = Math.max(60, options?.chunkSeconds ?? 1800);
    const overlapSeconds = Math.max(0, options?.overlapSeconds ?? 0);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    let durationSeconds = await getYouTubeVideoDurationSeconds(url);
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
        chunks.push({ start: Math.max(0, start - (chunks.length > 0 ? overlapSeconds : 0)), end });
        start = end;
    }

    const transcripts: string[] = [];
    for (const c of chunks) {
        // Execute sequentially to avoid heavy concurrent video fetches
        const t = await transcribeSegment(model, url, c.start, c.end);
        const clean = t?.trim();
        if (clean) transcripts.push(clean);
    }

    if (transcripts.length === 0) return null;
    return transcripts.join("\n\n");
}
