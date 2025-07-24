import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Time-based revalidation - cache for 1 hour
export const revalidate = 3600

export async function GET(_request: NextRequest) {
	try {
		// Check if prisma is initialized
		if (!prisma) {
			console.error("[CURATED_BUNDLES_GET] Prisma client not initialized")
			return NextResponse.json({ error: "Database connection error" }, { status: 500 })
		}

		// Get all active bundles
		const bundles = await prisma.bundle.findMany({
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
		// Return more specific error message
		const errorMessage = error instanceof Error ? error.message : "Unknown error"
		return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 })
	}
}
