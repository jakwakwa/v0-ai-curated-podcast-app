import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { getTranscriptOrchestrated } from "@/lib/transcripts"

const transcribeSchema = z.object({
	url: z.string().url(),
	validate: z.boolean().optional(),
})

export const runtime = "nodejs"

export async function POST(request: Request) {
	try {
		const { userId } = await auth()
		if (!userId) {
			return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
		}

		const json = await request.json()
		const parsed = transcribeSchema.safeParse(json)

		if (!parsed.success) {
			return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 })
		}

		const { url } = parsed.data

		// Use the orchestrator to determine the best approach
		const result = await getTranscriptOrchestrated({ url, allowPaid: true })

		if (result.success) {
			return NextResponse.json({
				transcript: result.transcript,
				provider: result.provider,
				success: true,
			})
		}

		// Check if client-side extraction is required
		if (result.meta?.requiresClientExtraction) {
			return NextResponse.json({
				success: false,
				error: result.error || "Client-side extraction required",
				requiresClientExtraction: true,
				extractionMethod: result.meta.extractionMethod,
				instructions: result.meta.instructions,
				fallback: result.meta.fallback,
				attempts: result.attempts,
			}, { status: 200 }) // 200 because this is expected behavior, not an error
		}

		// Handle other failures
		const message = result.error || "Transcription failed"
		if (/confirm you're not a bot|bot/i.test(message)) {
			return NextResponse.json({
				success: false,
				error: "YouTube blocked automated access for this video (anti-bot). Use the browser-based caption extraction instead.",
				requiresClientExtraction: true,
				extractionMethod: "browser-captions",
				instructions: "Extract captions in the browser using YouTube's caption API to avoid server-side blocking",
			}, { status: 200 })
		}

		return NextResponse.json({
			success: false,
			error: message,
			attempts: result.attempts,
		}, { status: 500 })
	} catch (error) {
		console.error("[YOUTUBE_TRANSCRIBE_POST]", error)
		if (error instanceof Error) {
			return NextResponse.json({ success: false, error: error.message }, { status: 500 })
		}
		return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 })
	}
}
