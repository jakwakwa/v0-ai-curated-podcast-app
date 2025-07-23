import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
	// biome-ignore lint/correctness/noUnusedFunctionParameters: <expected unused>
	// biome-ignore lint/correctness/noUnusedVariables: <expected>
	request: Request
) {
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
						userProfile: { userId },
					},
					// Episodes from user's selected bundle
					{
						bundle: {
							profiles: {
								some: { userId },
							},
						},
					},
				],
			},
			include: {
				podcast: true, // Unified podcast model
				userProfile: {
					include: {
						selectedBundle: {
							include: {
								podcasts: {
									include: { podcast: true },
								},
							},
						},
					},
				},
				bundle: {
					include: {
						podcasts: {
							include: { podcast: true },
						},
					},
				},
			},
			orderBy: { createdAt: "desc" },
		})

		return NextResponse.json(episodes)
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: <error debugging>
		console.error("[EPISODES_GET]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
