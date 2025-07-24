import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_request: Request) {
	try {
		const { userId } = await auth()
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const episodes = await prisma.episode.findMany({
			where: {
				OR: [
					{
						user_curation_profile: { user_id: userId },
					},
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
		console.error("Error fetching episodes:", error)
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}
