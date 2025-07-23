import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(_request: NextRequest) {
	try {
		// Note: Curated bundles are public data, so no authentication required

		const curatedBundles = await prisma.bundle.findMany({
			where: {
				isActive: true,
				// Note: Showing all active bundles including user-created ones for admin functionality
			},
			include: {
				podcasts: {
					include: { podcast: true },
				},
			},
			orderBy: { name: "asc" },
		})

		// Flatten the structure to include podcasts directly in the bundle object
		const bundlesWithPodcasts = curatedBundles.map(bundle => ({
			...bundle,
			podcasts: bundle.podcasts.map(bp => bp.podcast),
		}))

		return NextResponse.json(bundlesWithPodcasts)
	} catch (error) {
		console.error("[CURATED_BUNDLES_GET]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
