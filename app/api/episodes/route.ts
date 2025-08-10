// @ts-nocheck

import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma" // Use the global client
import { withDatabaseTimeout } from "../../../lib/utils"

// export const dynamic = "force-dynamic"
export const maxDuration = 60 // 1 minute for complex database queries

export async function GET(_request: Request) {
	try {
		console.log("Episodes API: Starting request...")
		const { userId } = await auth()
		console.log("Episodes API: Auth successful, userId:", userId)

		if (!userId) {
			console.log("Episodes API: No userId, returning 401")
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		console.log("Episodes API: Querying database...")
		// Episodes should relate to podcasts; visibility via user's selected bundle membership
		const profile = await prisma.userCurationProfile.findFirst({
			where: { user_id: userId, is_active: true },
			include: { selectedBundle: { include: { bundle_podcast: true } } },
		})

		const podcastIdsInSelectedBundle = profile?.selectedBundle?.bundle_podcast.map(bp => bp.podcast_id) ?? []

		const episodes = await withDatabaseTimeout(
			prisma.episode.findMany({
				where: {
					OR: [
						{ userProfile: { user_id: userId } },
						// Show episodes whose podcast belongs to the user's selected bundle
						...(podcastIdsInSelectedBundle.length > 0 ? [{ podcast_id: { in: podcastIdsInSelectedBundle } }] : []),
					],
				},
				include: {
					podcast: true,
					userProfile: true,
				},
				orderBy: { created_at: "desc" },
			})
		)

		console.log("Episodes API: Query successful, found", episodes.length, "episodes")
		return NextResponse.json(episodes)
	} catch (error) {
		console.error("Episodes API: Error fetching episodes:", error)
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}
