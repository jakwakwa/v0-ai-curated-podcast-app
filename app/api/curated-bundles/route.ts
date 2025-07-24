import { type NextRequest, NextResponse } from "next/server"
import getPrismaClient from "@/lib/prisma"

// Time-based revalidation - cache for 1 hour
export const revalidate = 3600

export async function GET(_request: NextRequest) {
	try {
		// Check if we're in a build environment
		if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
			console.log("[CURATED_BUNDLES_GET] Skipping during build - no DATABASE_URL")
			return NextResponse.json([], {
				headers: {
					"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
				},
			})
		}

		const prisma = getPrismaClient()

		// Get all active bundles
		const bundles = await prisma.bundle.findMany({
			where: { is_active: true },
			include: {
				bundle_podcast: {
					include: {
						podcast: true,
					},
				},
			},
			orderBy: { created_at: "desc" },
		})

		// Transform data for response
		const transformedBundles = bundles.map(bundle => ({
			...bundle,
			podcasts: bundle.bundle_podcast.map(bp => bp.podcast),
		}))

		// Add cache headers for better CDN caching
		return NextResponse.json(transformedBundles, {
			headers: {
				"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
			},
		})
	} catch (error) {
		console.error("[CURATED_BUNDLES_GET]", error)
		// Return empty array instead of error during build or if database schema is not ready
		if (process.env.NODE_ENV === "production" || (error instanceof Error && error.message.includes("does not exist"))) {
			console.log("[CURATED_BUNDLES_GET] Returning empty array due to database issue during build")
			return NextResponse.json([], {
				headers: {
					"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
				},
			})
		}
		// Return more specific error message
		const errorMessage = error instanceof Error ? error.message : "Unknown error"
		return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 })
	}
}
