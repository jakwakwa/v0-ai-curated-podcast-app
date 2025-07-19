import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

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

		const episodes = await prisma.episode.findMany({
			where: {
				userCurationProfile: { userId },
			},
			include: {
				source: true,
				userCurationProfile: {
					include: {
						sources: true,
						selectedBundle: {
							include: {
								bundlePodcasts: {
									include: { podcast: true },
								},
							},
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
