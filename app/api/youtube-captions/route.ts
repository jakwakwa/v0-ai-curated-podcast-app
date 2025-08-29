import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { z } from "zod"

const captionsSchema = z.object({
	url: z.string().url(),
	videoId: z.string().optional(),
})

export const runtime = "edge"

export async function POST(request: Request) {
	try {
		const { userId } = await auth()
		if (!userId) {
			return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
		}

		const json = await request.json()
		const parsed = captionsSchema.safeParse(json)

		if (!parsed.success) {
			return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 })
		}

		const { url, videoId } = parsed.data

		// Extract video ID if not provided
		const extractedVideoId = videoId || extractVideoIdFromUrl(url)
		if (!extractedVideoId) {
			return NextResponse.json({ success: false, error: "Invalid YouTube URL" }, { status: 400 })
		}

		// Return instructions for client-side extraction
		return NextResponse.json({
			success: true,
			videoId: extractedVideoId,
			extractionMethod: "client-side",
			instructions: {
				step1: "Use the browser's YouTube caption API to extract captions",
				step2: "Call extractYouTubeTranscript() from lib/client-youtube-transcript.ts",
				step3: "If captions unavailable, consider downloading audio locally and re-uploading",
				apiEndpoint: "https://www.youtube.com/youtubei/v1/player",
				fallback: "Manual transcript input or local audio upload"
			},
			clientFunction: "extractYouTubeTranscript",
			fallbackOptions: [
				"Use browser-based caption extraction",
				"Download audio locally and upload to AssemblyAI",
				"Manual transcript input",
				"Use a different video with available captions"
			]
		})
	} catch (error) {
		console.error("[YOUTUBE_CAPTIONS_POST]", error)
		return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 })
	}
}

function extractVideoIdFromUrl(url: string): string | null {
	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
		/^([a-zA-Z0-9_-]{11})$/
	]

	for (const pattern of patterns) {
		const match = url.match(pattern)
		if (match) return match[1]
	}

	return null
}