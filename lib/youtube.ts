import { YoutubeTranscript } from "youtube-transcript"

export async function getYouTubeVideoTitle(videoUrl: string): Promise<string> {
	try {
		const transcript = await YoutubeTranscript.fetchTranscript(videoUrl)
		// We don't need the transcript, just the title, which is fetched along with it.
		// However, the library doesn't expose a direct way to get only the title.
		// This is a workaround to get the metadata.
		// @ts-expect-error - library doesn't expose title but it's there
		const title = transcript.title
		if (typeof title === "string") {
			return title
		}
		// This is a fallback in case the internal API of the library changes.
		return "Untitled YouTube Video"
	} catch (error) {
		console.error("Failed to fetch YouTube video title:", error)
		throw new Error("Could not fetch video title from the provided YouTube URL.")
	}
}
