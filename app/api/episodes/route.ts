import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prismaEdge } from "@/lib/prisma-edge"

export const runtime = "edge" // Use edge runtime for better performance

export async function GET(_request: Request) {
	try {
		const { userId } = await auth()
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const episodes = await prismaEdge.episode.findMany({
			where: {
				OR: [
					{
						userProfile: {
							userId,
						},
					},
					{
						bundle: {
							profiles: {
								some: {
									userId,
								},
							},
						},
					},
				],
			},
			include: {
				podcast: true,
				userProfile: true,
				bundle: true,
				feedback: {
					where: {
						userId,
					},
				},
			},
			orderBy: {
				publishedAt: "desc",
			},
		})

		return NextResponse.json(episodes)
	} catch (error) {
		console.error("Error fetching episodes:", error)
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}
