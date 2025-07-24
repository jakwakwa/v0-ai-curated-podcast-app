import { type NextRequest, NextResponse } from "next/server"
import { prismaEdge } from "@/lib/prisma-edge"

export const runtime = "edge" // Use edge runtime for better performance

// Time-based revalidation - cache for 1 hour
export const revalidate = 3600

export async function GET(_request: NextRequest) {
	try {
		// Get all active bundles
		const bundles = await prismaEdge.bundle.findMany({
			where: { isActive: true },
			include: {
				podcasts: {
					include: {
						podcast: true,
					},
				},
			},
			orderBy: { createdAt: "desc" },
		})

		// Transform data for response
		const transformedBundles = bundles.map(bundle => ({
			...bundle,
			podcasts: bundle.podcasts.map(bp => bp.podcast),
		}))

		// Add cache headers for better CDN caching
		return NextResponse.json(transformedBundles, {
			headers: {
				"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
			},
		})
	} catch (error) {
		console.error("[CURATED_BUNDLES_GET]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
