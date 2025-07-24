import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(_request: NextRequest) {
	try {
		// Note: Bundles are public data, so no authentication required
		const bundles = await prisma.bundle.findMany({
			where: {
				is_active: true,
				// Note: Showing all active bundles including user-created ones for admin functionality
			},
			include: {
				bundle_podcast: {
					include: { podcast: true },
				},
			},
			orderBy: { name: "asc" },
		})

		// Flatten the structure to include podcasts directly in the bundle object
		const bundlesWithPodcasts = bundles.map(bundle => ({
			...bundle,
			podcasts: bundle.bundle_podcast.map(bp => bp.podcast),
		}))

		return NextResponse.json(bundlesWithPodcasts)
	} catch (error) {
		console.error("[BUNDLES_GET]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
