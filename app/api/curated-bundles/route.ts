import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_request: NextRequest) {
	try {
		// Check if we're in a build environment
		if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
			console.log("[CURATED_BUNDLES_GET] Skipping during build - no DATABASE_URL")
			return NextResponse.json([])
		}

		// prisma is already imported

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

		return NextResponse.json(transformedBundles)
	} catch (error) {
		console.error("[CURATED_BUNDLES_GET]", error)
		// Return empty array instead of error during build or if database schema is not ready
		if (process.env.NODE_ENV === "production" || (error instanceof Error && error.message.includes("does not exist"))) {
			console.log("[CURATED_BUNDLES_GET] Returning empty array due to database issue during build")
			return NextResponse.json([])
		}
		// Return more specific error message
		const errorMessage = error instanceof Error ? error.message : "Unknown error"
		return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 })
	}
}
