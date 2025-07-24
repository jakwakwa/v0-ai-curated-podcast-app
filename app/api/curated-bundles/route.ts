import { NextRequest, NextResponse } from "next/server"

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

		// Dynamic import to avoid issues during static generation
		const { PrismaClient } = await import("@prisma/client")
		const prisma = new PrismaClient({
			log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
		})

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
		// Return empty array instead of error during build
		if (process.env.NODE_ENV === "production") {
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
