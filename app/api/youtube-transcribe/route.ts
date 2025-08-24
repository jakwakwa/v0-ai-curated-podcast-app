import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { transcribeYouTubeVideo, validateVideoForTranscription } from "@/lib/custom-transcriber"

const transcribeSchema = z.object({
	url: z.string().url(),
	validate: z.boolean().optional(),
})

export async function POST(request: Request) {
	try {
		const { userId } = await auth()
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const json = await request.json()
		const parsed = transcribeSchema.safeParse(json)

		if (!parsed.success) {
			return new NextResponse(parsed.error.message, { status: 400 })
		}

		const { url, validate } = parsed.data

		// If validation requested, just check if video is suitable
		if (validate) {
			const validation = await validateVideoForTranscription(url)
			return NextResponse.json(validation)
		}

		// Perform actual transcription
		const result = await transcribeYouTubeVideo(url)

		if (!result.success) {
			return new NextResponse(result.error || "Transcription failed", { status: 500 })
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
