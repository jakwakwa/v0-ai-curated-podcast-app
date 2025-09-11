import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { generateAdminBundleEpisodeWithGeminiTTS, generatePodcastWithGeminiTTS } from "@/lib/inngest/gemini-tts";
import { geminiVideoWorker } from "@/lib/inngest/providers/gemini-video-worker";
import { enqueueTranscriptionJob } from "@/lib/inngest/transcribe-from-metadata";
import { transcriptionCoordinator } from "@/lib/inngest/transcription-saga";
import { generateUserEpisode } from "@/lib/inngest/user-episode-generator";
import { generateUserEpisodeMulti } from "@/lib/inngest/user-episode-generator-multi";

export const maxDuration = 300; // 5 minutes for Inngest job processing

export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [
		generatePodcastWithGeminiTTS,
		generateAdminBundleEpisodeWithGeminiTTS,
		generateUserEpisode,
		generateUserEpisodeMulti,
		enqueueTranscriptionJob,
		transcriptionCoordinator,
		geminiVideoWorker,
	],
	streaming: "allow",
});
