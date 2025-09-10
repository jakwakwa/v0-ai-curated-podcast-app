import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { z } from "zod"

const PlayerBodySchema = z
	.object({
		videoId: z.string().min(5).max(64),
		context: z
			.object({
				client: z.object({ clientName: z.string(), clientVersion: z.string() }).passthrough(),
			})
			.passthrough(),
	})
	.passthrough()

export const runtime = "edge"

export async function POST(request: Request) {
	try {
		const { userId } = await auth()
		if (!userId) return new NextResponse("Unauthorized", { status: 401 })

		const body = await request.json()
		const parsed = PlayerBodySchema.safeParse(body)
		if (!parsed.success) return new NextResponse(parsed.error.message, { status: 400 })

		// ⚠️ WARNING: Using undocumented YouTube innertube API
		// This endpoint may break without notice. See docs/YOUTUBE_API_RISKS.md for details.
		const resp = await fetch("https://www.youtube.com/youtubei/v1/player", {
			method: "POST",
			headers: {
				"content-type": "application/json",
				"x-youtube-client-name": "1",
				"x-youtube-client-version": parsed.data?.context?.client?.clientVersion ?? "2.20240101.00.00",
				Referer: "https://www.youtube.com/",
				Origin: "https://www.youtube.com",
				"User-Agent": "Mozilla/5.0",
			},
			body: JSON.stringify(parsed.data),
		})

		if (!resp.ok) {
			// Enhanced error logging for monitoring undocumented API health
			console.error(`[YOUTUBE_INNERTUBE_API] HTTP ${resp.status}: ${resp.statusText}`, {
				url: "youtubei/v1/player",
				timestamp: new Date().toISOString(),
				userAgent: request.headers.get("user-agent"),
			})
			return new NextResponse(`Upstream error: ${resp.status}`, { status: 502 })
		}
		const json = await resp.json()
		return NextResponse.json(json, { status: 200 })
	} catch (error) {
		console.error("[YOUTUBE_PLAYER_PROXY] YouTube innertube API error:", {
			error: error instanceof Error ? error.message : "Unknown error",
			timestamp: new Date().toISOString(),
			endpoint: "youtubei/v1/player"
		})
		return new NextResponse("Internal Error", { status: 500 })
	}
}
