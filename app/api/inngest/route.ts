import { serve } from "inngest/next"
import { inngest } from "@/inngest/client"
import { generateAdminBundleEpisodeWithGeminiTTS, generatePodcastWithGeminiTTS } from "@/inngest/gemini-tts"
import { generateUserEpisode } from "@/inngest/user-episode-generator"
import { generateUserEpisodeMulti } from "@/inngest/user-episode-generator-multi"

export const maxDuration = 300 // 5 minutes for Inngest job processing

export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [generatePodcastWithGeminiTTS, generateAdminBundleEpisodeWithGeminiTTS, generateUserEpisode, generateUserEpisodeMulti],
})
