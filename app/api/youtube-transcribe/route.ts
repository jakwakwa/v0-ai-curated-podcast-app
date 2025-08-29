import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { transcribeYouTubeVideo, validateVideoForTranscription } from "@/lib/custom-transcriber"

const transcribeSchema = z.object({
	url: z.string().url(),
	validate: z.boolean().optional(),
})

export const runtime = "nodejs"

export async function POST(request: Request) {
	try {
		const { userId } = await auth()
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		// Gate server-side YouTube extraction on Vercel by default
		const ENABLE_SERVER_YTDL = process.env.ENABLE_SERVER_YTDL === "true"
		const IS_VERCEL = process.env.VERCEL === "1" || process.env.VERCEL === "true"

		const json = await request.json()
		const parsed = transcribeSchema.safeParse(json)

		if (!parsed.success) {
			return new NextResponse(parsed.error.message, { status: 400 })
		}

		const { url, validate } = parsed.data

		// If server-side extraction is disabled in this environment, return early
		if (IS_VERCEL && !ENABLE_SERVER_YTDL) {
			return NextResponse.json(
				{
					success: false,
					error:
						"Server-side YouTube extraction is disabled in this environment. Use browser captions (client) or enable paid transcription.",
				},
				{ status: 429 }
			)
		}

		// If validation requested, just check if video is suitable (may use ytdl under the hood)
		if (validate) {
			const validation = await validateVideoForTranscription(url)
			return NextResponse.json(validation)
		}

		// Perform actual transcription
		const result = await transcribeYouTubeVideo(url)

		if (!result.success) {
			const message = result.error || "Transcription failed"
			if (/confirm you’re not a bot|confirm you're not a bot|bot/i.test(message)) {
				// Return a clearer message for YouTube anti-bot/consent walls
				return NextResponse.json(
					{
						success: false,
						error: "YouTube blocked automated access for this video (anti-bot). Use client captions or the paid transcription option.",
					},
					{ status: 429 }
				)
			}
			return new NextResponse(message.includes("too large") ? "Audio exceeded size limits. We tried compressing; try a shorter clip or enable paid fallback." : message, { status: 500 })
		}

		return NextResponse.json({
			transcript: result.transcript,
			audioSize: result.audioSize,
			success: true,
		})
	} catch (error) {
		console.error("[YOUTUBE_TRANSCRIBE_POST]", error)
		if (error instanceof Error) {
			return new NextResponse(error.message, { status: 500 })
		}
		return new NextResponse("Internal Error", { status: 500 })
	}
}
