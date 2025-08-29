import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { getTranscriptOrchestrated } from "@/lib/transcripts"

export const runtime = "nodejs"

const bodySchema = z.object({ url: z.string().url(), allowPaid: z.coerce.boolean().default(true) })

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return new NextResponse("Unauthorized", { status: 401 })

    const json = await request.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 })

    const result = await getTranscriptOrchestrated({ url: parsed.data.url, allowPaid: parsed.data.allowPaid, kind: "youtube" })
    if (result.success) return NextResponse.json(result)
    return NextResponse.json(result, { status: 404 })
  } catch (error) {
    console.error("[YOUTUBE_TRANSCRIBE]", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

