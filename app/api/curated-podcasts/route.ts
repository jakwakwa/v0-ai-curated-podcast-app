import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
	// biome-ignore lint/correctness/noUnusedFunctionParameters: expected unused parameter
	request: Request
) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const curatedPodcasts = await prisma.podcast.findMany({
			where: {
				is_active: true,
				owner_user_id: null, // Only show global podcasts, not user-owned ones
			},
			orderBy: { name: "asc" },
			cacheStrategy: {
				ttl: 1800, // 30 minutes - podcasts don't change frequently
				swr: 600, // 10 minutes stale while revalidate
				tags: ["global_podcasts"],
			},
		})

		return NextResponse.json(curatedPodcasts)
	} catch (error) {
		console.error("[CURATED_PODCASTS_GET]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
