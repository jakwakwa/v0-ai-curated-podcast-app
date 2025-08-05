// @ts-nocheck

import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma" // Use the global client
import { withDatabaseTimeout } from "@/lib/utils"

export const dynamic = "force-dynamic"
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
		const episodes = await withDatabaseTimeout(
			prisma.episode.findMany({
			where: {
				OR: [
					{ userProfile: { user_id: userId } },
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
				podcast: true,
				userProfile: {
					include: {
						selectedBundle: {
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
			// cacheStrategy: {
			// 	ttl: 300,
			// 	swr: 60,
			// 	tags: ["findMany_episodes"],
			// },
			})
		)

		console.log("Episodes API: Query successful, found", episodes.length, "episodes")
		const response = NextResponse.json(episodes)
		response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60")
		return response
	} catch (error) {
		console.error("Episodes API: Error fetching episodes:", error)
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}
