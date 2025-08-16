import { auth } from "@clerk/nextjs/server"
import { PlanGate } from "@prisma/client"
import { NextResponse } from "next/server"
import { requireAdminMiddleware } from "../../../../lib/admin-middleware"
import { prisma } from "../../../../lib/prisma"

export async function GET() {
	try {
		// First check admin status
		const adminCheck = await requireAdminMiddleware()
		if (adminCheck) {
			return adminCheck // Return error response if not admin
		}

		// If we get here, user is admin
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		// Get all bundles
		const bundles = await prisma.bundle.findMany({
			include: {
				bundle_podcast: {
					include: { podcast: true },
				},
				episodes: {
					orderBy: { published_at: "desc" },
				},
			},
		})

		return NextResponse.json(bundles)
	} catch (error) {
		console.error("Admin bundles error:", error)
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}

export async function POST(request: Request) {
	try {
		// First check admin status
		const adminCheck = await requireAdminMiddleware()
		if (adminCheck) {
			return adminCheck // Return error response if not admin
		}

		// If we get here, user is admin
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const body = await request.json()
		const { name, description, isStatic } = body
		// Accept both UI payload shapes
		const selectedPodcastIds: string[] = Array.isArray(body.selectedPodcastIds) ? body.selectedPodcastIds : Array.isArray(body.podcast_ids) ? body.podcast_ids : []

		if (!name) {
			return new NextResponse("Bundle name is required", { status: 400 })
		}

		// Create the bundle
		const bundle = await prisma.bundle.create({
			data: {
				bundle_id: `bundle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				name,
				description,
				is_static: isStatic,
				is_active: true,
				owner_user_id: userId,
			},
		})

		// Add podcast relationships if selectedPodcastIds is provided
		if (selectedPodcastIds && selectedPodcastIds.length > 0) {
			await prisma.bundlePodcast.createMany({
				data: selectedPodcastIds.map((podcastId: string) => ({
					bundle_id: bundle.bundle_id,
					podcast_id: podcastId,
				})),
			})
		}

		const bundleWithRelations = await prisma.bundle.findUnique({
			where: { bundle_id: bundle.bundle_id },
			include: { bundle_podcast: { include: { podcast: true } }, episodes: { orderBy: { published_at: "desc" } } },
		})

		return NextResponse.json({ success: true, bundle: bundleWithRelations })
	} catch (error) {
		console.error("Admin bundles POST error:", error)
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}

// Update bundle podcast membership (replace set)
export async function PATCH(request: Request) {
	try {
		// First check admin status
		const adminCheck = await requireAdminMiddleware()
		if (adminCheck) {
			return adminCheck
		}

		const { userId } = await auth()
		if (!userId) return new NextResponse("Unauthorized", { status: 401 })

		const body = await request.json()
		const bundleId: string | undefined = body.bundle_id || body.id
		if (!bundleId) return new NextResponse("Bundle ID is required", { status: 400 })

		// Accept both shapes
		const podcastIds: string[] = Array.isArray(body.podcast_ids) ? body.podcast_ids : Array.isArray(body.selectedPodcastIds) ? body.selectedPodcastIds : []
		const minPlan: string | undefined = body.min_plan

		// Ensure bundle exists
		const existing = await prisma.bundle.findUnique({ where: { bundle_id: bundleId } })
		if (!existing) return NextResponse.json({ error: "Bundle not found" }, { status: 400 })

		// Replace membership atomically and update min_plan if provided
		const tx: Array<
			ReturnType<typeof prisma.$queryRaw> | ReturnType<typeof prisma.bundle.update> | ReturnType<typeof prisma.bundlePodcast.deleteMany> | ReturnType<typeof prisma.bundlePodcast.createMany>
		> = []
		if (typeof minPlan === "string") {
			let minPlanEnum: PlanGate | undefined
			if (minPlan === "NONE" || minPlan === "CASUAL_LISTENER" || minPlan === "CURATE_CONTROL") {
				minPlanEnum = PlanGate[minPlan]
			}
			if (minPlanEnum) {
				tx.push(prisma.bundle.update({ where: { bundle_id: bundleId }, data: { min_plan: minPlanEnum } }))
			}
		}
		tx.push(prisma.bundlePodcast.deleteMany({ where: { bundle_id: bundleId } }))
		if (podcastIds.length > 0) {
			tx.push(prisma.bundlePodcast.createMany({ data: podcastIds.map((pid: string) => ({ bundle_id: bundleId, podcast_id: pid })) }))
		}
		await prisma.$transaction(tx)

		const updated = await prisma.bundle.findUnique({
			where: { bundle_id: bundleId },
			include: { bundle_podcast: { include: { podcast: true } }, episodes: { orderBy: { published_at: "desc" } } },
		})

		return NextResponse.json({ success: true, bundle: updated })
	} catch (error) {
		console.error("[ADMIN_BUNDLES_PATCH]", error)
		return NextResponse.json({ error: "Internal Error" }, { status: 500 })
	}
}

// Delete a bundle
export async function DELETE(request: Request) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		// Check if user is admin
		const adminStatus = await requireAdminMiddleware()
		if (adminStatus) {
			return adminStatus // Return error response if not admin
		}

		const { searchParams } = new URL(request.url)
		const bundleId = searchParams.get("id")

		if (!bundleId) {
			return NextResponse.json({ error: "Bundle ID is required" }, { status: 400 })
		}

		// Check if bundle exists and is not being used by any active user profiles
		const bundle = await prisma.bundle.findUnique({
			where: { bundle_id: bundleId },
			include: {
				user_curation_profile: {
					where: { is_active: true },
				},
			},
		})

		if (!bundle) {
			return NextResponse.json({ error: "Bundle not found" }, { status: 400 })
		}

		if (bundle.user_curation_profile.length > 0) {
			return NextResponse.json({ error: "Cannot delete bundle - it is currently being used by active user profiles" }, { status: 400 })
		}

		// Delete bundle-podcast relationships first
		await prisma.bundlePodcast.deleteMany({
			where: { bundle_id: bundleId },
		})

		// Delete any bundle episodes
		await prisma.episode.deleteMany({
			where: { bundle_id: bundleId },
		})

		// Finally delete the bundle
		await prisma.bundle.delete({
			where: { bundle_id: bundleId },
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("[ADMIN_BUNDLES_DELETE]", error)
		return NextResponse.json({ error: "Internal Error" }, { status: 500 })
	}
}
