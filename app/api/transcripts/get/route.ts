import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { getTranscriptOrchestrated } from "@/lib/transcripts"
import type { TranscriptSourceKind } from "@/lib/transcripts/types"

export const runtime = "nodejs"

const querySchema = z.object({
	url: z.string().url(),
	lang: z.string().optional(),
	allowPaid: z.coerce.boolean().optional(),
	kind: z.enum(["youtube", "podcast", "unknown"]).optional(),
})

export async function GET(request: Request): Promise<Response> {
	try {
		const { userId } = await auth()
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const { searchParams } = new URL(request.url)
		const parsed = querySchema.safeParse({
			url: searchParams.get("url"),
			lang: searchParams.get("lang") ?? undefined,
			allowPaid: searchParams.get("allowPaid") ?? undefined,
			kind: (searchParams.get("kind") as TranscriptSourceKind | null) ?? undefined,
		})

		if (!parsed.success) {
			return new NextResponse(parsed.error.message, { status: 400 })
		}

		const result = await getTranscriptOrchestrated({
			url: parsed.data.url,
			lang: parsed.data.lang,
			allowPaid: parsed.data.allowPaid ?? true,
			kind: parsed.data.kind,
		})

		if (result.success) {
			return NextResponse.json(result)
		}

		return NextResponse.json(result, { status: 404 })
	} catch (error) {
		console.error("[TRANSCRIPTS_GET]", error)
		if (error instanceof Error) {
			return new NextResponse(error.message, { status: 500 })
		}
		return new NextResponse("Internal Error", { status: 500 })
	}
}
