import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"
export const dynamic = "force-dynamic"
export const revalidate = 0
import { prisma } from "@/lib/prisma"

function resolveAllowedGates(plan: string | null | undefined): Array<"NONE" | "CASUAL_LISTENER" | "CURATE_CONTROL"> {
    if (plan === "curate_control") return ["NONE", "CASUAL_LISTENER", "CURATE_CONTROL"]
    if (plan === "casual_listener") return ["NONE", "CASUAL_LISTENER"]
    return ["NONE"]
}

export async function GET(_request: NextRequest) {
	try {
		// Check if we're in a build environment
		if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
			console.log("[CURATED_BUNDLES_GET] Skipping during build - no DATABASE_URL")
			return NextResponse.json([])
		}

        const { userId } = await auth()
        let plan: string | null = null
        if (userId) {
            const sub = await prisma.subscription.findFirst({ where: { user_id: userId }, orderBy: { updated_at: "desc" } })
            plan = sub?.plan_type ?? null
            // Admin bypass: treat admin as highest plan
            const user = await prisma.user.findUnique({ where: { user_id: userId }, select: { is_admin: true } })
            if (user?.is_admin) {
                plan = "curate_control"
            }
        }
        const allowedGates = resolveAllowedGates(plan)

        // Get all active bundles (return locked ones too)
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

        // Transform with gating info
        const transformedBundles = bundles.map(bundle => {
            // @ts-ignore - min_plan exists on Bundle model
            const gate = (bundle as any).min_plan as "NONE" | "CASUAL_LISTENER" | "CURATE_CONTROL" | undefined
            const canInteract = gate ? allowedGates.includes(gate) : true
            const lockReason = canInteract ? null : "This bundle requires a higher plan."
            return {
                ...bundle,
                podcasts: bundle.bundle_podcast.map(bp => bp.podcast),
                canInteract,
                lockReason,
            }
        })

        return NextResponse.json(transformedBundles, { headers: { "Cache-Control": "no-store" } })
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
