import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(_request: Request) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		// Unified query: get episodes from both user profiles and selected bundles
		const episodes = await prisma.episode.findMany({
			where: {
				OR: [
					// Episodes from user's custom profile
					{
						user_curation_profile: { user_id: userId },
					},
					// Episodes from user's selected bundle
					{
						bundle: {
							user_curation_profile: {
								some: { user_id: userId },
							},
						},
					},
				],
			},
			include: {
				podcast: true, // Unified podcast model
				user_curation_profile: {
					include: {
						bundle: {
							include: {
								bundle_podcast: {
									include: { podcast: true },
								},
							},
						},
					},
				},
				bundle: {
					include: {
						bundle_podcast: {
							include: { podcast: true },
						},
					},
				},
			},
			orderBy: { created_at: "desc" },
		})

		return NextResponse.json(episodes)
	} catch (error) {
		console.error("[EPISODES_GET]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
