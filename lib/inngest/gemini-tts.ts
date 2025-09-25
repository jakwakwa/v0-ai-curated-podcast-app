import { ensureBucketName, getStorageUploader, uploadToGCS } from "@/lib/gcs";
import { prisma } from "@/lib/prisma";
import { getTranscriptOrchestrated } from "@/lib/transcripts";
import { type GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { randomUUID } from "node:crypto";
import { inngest } from "./client";

let genAI: GoogleGenerativeAI;

function getGenAIClient(): GoogleGenerativeAI {
	if (!genAI) {
		const geminiApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
		if (!geminiApiKey) {
			throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set.");
		}
		genAI = new GoogleGenerativeAI(geminiApiKey);
	}
	return genAI;
}

function getGenerativeModel(modelName: string): GenerativeModel {
	const client = getGenAIClient();
	return client.getGenerativeModel({ model: modelName });
}

async function generateAudioWithGeminiTTS(script: string): Promise<Buffer> {
	const model = getGenerativeModel(process.env.GEMINI_TTS_MODEL || "gemini-1.5-flash-latest");

	const result = await model.generateContent(`Please read aloud the following in a podcast interview style:\n\n${script}`);

	const audioPart = result.response.candidates?.[0]?.content.parts.find((part): part is { inlineData: { data: string; mimeType: string } } => "inlineData" in part);

	if (!audioPart) {
		throw new Error("No audio content found");
	}

	return Buffer.from(audioPart.inlineData.data, "base64");
}

export const generatePodcastWithGeminiTTS = inngest.createFunction({ id: "generate-podcast-with-gemini-tts" }, { event: "podcast.generate.with.gemini" }, async ({ event, step }) => {
	const { userEpisodeId } = event.data;

	const userEpisode = await step.run("fetch-user-episode", async () => {
		return prisma.userEpisode.findUnique({
			where: { episode_id: userEpisodeId },
			include: { user: true },
		});
	});

	if (!userEpisode?.user) {
		throw new Error("UserEpisode or User not found");
	}

	const { youtube_url: sourceUrl } = userEpisode;
	if (!sourceUrl) {
		throw new Error("Source URL is missing");
	}

	const transcriptResult = await step.run("get-transcript-orchestrated", async () => {
		return getTranscriptOrchestrated({ url: sourceUrl });
	});

	if (!transcriptResult.success) {
		throw new Error(`Failed to get transcript: ${transcriptResult.error || "Unknown error"}`);
	}

	const aggregatedContent = transcriptResult.transcript;

	const summary = await step.run("summarize-content", async () => {
		const model = getGenerativeModel(process.env.GEMINI_GENAI_MODEL || "gemini-1.5-flash-latest");
		const result = await model.generateContent(
			`Summarize the following content for a podcast episode, focusing on all key themes and interesting points. Provide a comprehensive overview, suitable for developing into a 2-minute podcast script. Ensure sufficient detail for expansion.\n\n${aggregatedContent}`
		);
		return result.response.text();
	});

	const script = await step.run("generate-script", async () => {
		const model = getGenerativeModel(process.env.GEMINI_GENAI_MODEL || "gemini-1.5-flash-latest");
		const result = await model.generateContent(
			`Based on the following summary, write a podcast style script of approximately 300 words (enough for about a 2-minute podcast). Include a witty introduction, smooth transitions between topics, and a concise conclusion. Make it engaging, easy to listen to, and maintain a friendly and informative tone. **The script should only contain the spoken words without: (e.g., "Host:"), sound effects, specific audio cues, structural markers (e.g., "section 1", "ad breaks"), or timing instructions (e.g., "2 minutes").** Cover most interesting themes from the summary.\n\nSummary: ${summary}`
		);
		return result.response.text();
	});

	const audioBufferResult = await step.run("generate-audio", async () => {
		return generateAudioWithGeminiTTS(script);
	});

	const audioUrl = await step.run("upload-audio-to-gcs", async () => {
		const storage = getStorageUploader();
		const bucketName = ensureBucketName();
		const fileName = `user-episodes/${userEpisode.user_id}/${randomUUID()}.mp3`;
		// Inngest serializes step outputs, so we need to re-create the buffer
		const audioBuffer = Buffer.from(
			(
				audioBufferResult as unknown as {
					type: "Buffer";
					data: number[];
				}
			).data
		);
		await uploadToGCS(storage, bucketName, fileName, audioBuffer, {
			contentType: "audio/mpeg",
		});
		return `gs://${bucketName}/${fileName}`;
	});

	await step.run("update-user-episode", async () => {
		return prisma.userEpisode.update({
			where: { episode_id: userEpisodeId },
			data: {
				episode_title: userEpisode.episode_title || "Generated Episode",
				summary,
				transcript: aggregatedContent,
				gcs_audio_url: audioUrl,
				status: "COMPLETED",
			},
		});
	});

	return { success: true, userEpisodeId };
});

export const generateAdminBundleEpisodeWithGeminiTTS = inngest.createFunction(
	{ id: "generate-admin-bundle-episode-with-gemini-tts" },
	{ event: "admin.bundle.episode.generate" },
	async ({ event }) => {
		// Placeholder implementation
		console.log("Generating admin bundle episode:", event.data);
		return { success: true };
	}
);
