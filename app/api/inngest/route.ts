import { serve } from "inngest/next"
import { inngest } from "../../../inngest/client"
import { generatePodcastWithGeminiTTS, generateAdminBundleEpisodeWithGeminiTTS } from "../../../inngest/gemini-tts"

export const maxDuration = 300 // 5 minutes for Inngest job processing

export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [generatePodcastWithGeminiTTS, generateAdminBundleEpisodeWithGeminiTTS],
})
