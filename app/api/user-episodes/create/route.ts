import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { inngest } from "@/lib/inngest/client"
import { prisma } from "@/lib/prisma"

const createEpisodeSchema = z.object({
	youtubeUrl: z.string().url(),
	episodeTitle: z.string().min(1),
})

export async function POST(request: Request) {
	try {
		const { userId } = await auth()
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const json = await request.json()
		const parsed = createEpisodeSchema.safeParse(json)

		if (!parsed.success) {
			return new NextResponse(parsed.error.message, { status: 400 })
		}

		const { youtubeUrl, episodeTitle } = parsed.data

		const subscription = await prisma.subscription.findFirst({
			where: { user_id: userId },
			orderBy: { created_at: "desc" },
		})

		// Assuming a limit of 10 for now
		const EPISODE_LIMIT = 10
		if ((subscription?.episode_creation_count ?? 0) >= EPISODE_LIMIT) {
			return new NextResponse("You have reached your monthly episode creation limit.", { status: 403 })
		}

		const newEpisode = await prisma.userEpisode.create({
			data: {
				user_id: userId,
				youtube_url: youtubeUrl,
				episode_title: episodeTitle,
				status: "PENDING",
			},
		})

		await inngest.send({
			name: "user.episode.generate.requested",
			data: {
				userEpisodeId: newEpisode.episode_id,
			},
		})

		return NextResponse.json(newEpisode, { status: 201 })
	} catch (error) {
		console.error("[USER_EPISODES_CREATE_POST]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
