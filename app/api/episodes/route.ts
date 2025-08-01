// @ts-nocheck

import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Force this API route to be dynamic since it uses auth()
export const dynamic = "force-dynamic"

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
						userProfile: { user_id: userId },
					},
					{
						bundle: {
							userProfile: {
								some: { user_id: userId },
							},
						},
					},
				],
			},
			include: {
				podcast: true, // Unified podcast model
				userProfile: {
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
