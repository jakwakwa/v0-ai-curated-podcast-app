import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { getYouTubeVideoTitle } from "@/lib/youtube-safe"

const schema = z.object({
	url: z.string().url(),
})

export async function GET(request: Request) {
	try {
		const { userId } = await auth()
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const { searchParams } = new URL(request.url)
		const url = searchParams.get("url")

		const parsed = schema.safeParse({ url })
		if (!parsed.success) {
			return new NextResponse(parsed.error.message, { status: 400 })
		}

		const title = await getYouTubeVideoTitle(parsed.data.url)

		return NextResponse.json({ title })
	} catch (error) {
		console.error("[YOUTUBE_METADATA_GET]", error)
		if (error instanceof Error) {
			return new NextResponse(error.message, { status: 500 })
		}
		return new NextResponse("Internal Error", { status: 500 })
	}
}
