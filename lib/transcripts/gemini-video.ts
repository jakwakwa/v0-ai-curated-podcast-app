import { GoogleGenerativeAI, type Part } from "@google/generative-ai";

const PROMPT = `Please transcribe the following audio segment accurately. Provide only the transcribed text. Do not include any additional commentary, introductory phrases like "Here is the transcription:", or summaries. The audio is a segment of a larger file, so do not add a beginning or an end.`;

const _SUPER_PROMPT = `Based on the url provided, Summarise the key moments and highlights of the podcast into a podcast style write a two-host podcast conversation. Alternate speakers naturally. Keep it around 3-5 minutes.

Requirements:
- Do not include stage directions or timestamps
- NO sound effects, music cues, or descriptive text in brackets
- NO stage directions or production notes
- ONLY include spoken dialogue that will be read aloud
- Write as if the hosts are speaking directly to each other and the audience

Output ONLY valid JSON array of objects with fields: speaker ("A" or "B") and text (string). No markdown. script of approximately 350 words (enough for about a 4-minute podcast). Include a witty introduction, smooth transitions between topics, and a concise conclusion. Make it engaging, easy to listen to, and maintain a friendly and informative tone. **The script should only contain the spoken words without: (e.g., "Host:"), sound effects, specific audio cues, structural markers (e.g., "section 1", "ad breaks"), or timing instructions (e.g., "2 minutes").** Cover most interesting themes from the summary. Always start the script as follows: "Feeling lost in the noise? This summary is brought to you by Podslice. We filter out the fluff, the filler, and the drawn-out discussions, leaving you with pure, actionable knowledge. In a world full of chatter, we help you find the insight."`;

export async function transcribeWithGeminiFromUrl(url: string, startTime?: number, duration?: number): Promise<string | null> {
	const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
	if (!apiKey) {
		console.error("[GEMINI] GOOGLE_GENERATIVE_AI_API_KEY is not set");
		return null;
	}

	try {
		const modelName = process.env.GEMINI_TRANSCRIBE_MODEL || "gemini-2.5-flash";

		const genAI = new GoogleGenerativeAI(apiKey);
		const model = genAI.getGenerativeModel({ model: modelName });

		// Always use the full YouTube URL - Gemini can handle time-based transcription natively
		const mediaPart: Part = { fileData: { fileUri: url, mimeType: "video/*" } };

		// Create time-based prompt if startTime and duration are provided
		let prompt = PROMPT;
		if (startTime !== undefined && duration !== undefined) {
			const startTimeFormatted = formatTime(startTime);
			const endTimeFormatted = formatTime(startTime + duration);
			console.log(`[GEMINI] Transcribing segment: ${startTimeFormatted} - ${endTimeFormatted}`);

			prompt = `${PROMPT}\n\nIMPORTANT: Only transcribe the portion of the video from ${startTimeFormatted} to ${endTimeFormatted}. Ignore any content before or after this time range.`;
		} else {
			console.log(`[GEMINI] Transcribing full video`);
		}

		// Let the caller control timeout; this call may legitimately take >2 minutes.
		const result = await model.generateContent([prompt, mediaPart]);
		const text = result.response.text();

		// Check if we got a valid transcription
		if (!text || text.trim().length === 0) {
			console.error("[GEMINI] Empty transcription response");
			return null;
		}

		return text;
	} catch (error) {
		console.error("[GEMINI][youtube-url] Error:", error);
		return null;
	}
}

/**
 * Format seconds into HH:MM:SS or MM:SS format
 */
function formatTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);

	if (hours > 0) {
		return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	}
	return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
