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

		const curatedPodcasts = await prisma.curatedPodcast.findMany({
			where: { isActive: true },
			orderBy: { name: "asc" },
		})

		return NextResponse.json(curatedPodcasts)
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: <error debugging>
		console.error("[CURATED_PODCASTS_GET]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
