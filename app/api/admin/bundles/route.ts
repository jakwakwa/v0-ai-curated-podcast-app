import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { isOrgAdmin } from "@/lib/organization-roles"
import { prisma } from "@/lib/prisma"

// Force this API route to be dynamic since it uses auth()
export const dynamic = 'force-dynamic'

// Create a new bundle
export async function POST(request: Request) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		// Check if user is admin
		const adminStatus = await isOrgAdmin()
		if (!adminStatus) {
			return new NextResponse("Forbidden", { status: 403 })
		}

		const body = await request.json()
		const { name, description, image_url, podcast_ids } = body

		if (!(name && description && podcast_ids && Array.isArray(podcast_ids))) {
			return new NextResponse("Missing required fields", { status: 400 })
		}

		// Create the bundle
		const bundle = await prisma.bundle.create({
			data: {
				bundle_id: `bundle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				name,
				description,
				image_url: image_url,
				is_active: true,
			},
		})

		// Create bundle-podcast relationships
		if (podcast_ids.length > 0) {
			await prisma.bundlePodcast.createMany({
				data: podcast_ids.map((podcastId: string) => ({
					bundle_id: bundle.bundle_id,
					podcast_id: podcastId,
				})),
			})
		}

		// Fetch the created bundle with podcasts
		const createdBundle = await prisma.bundle.findUnique({
			where: { bundle_id: bundle.bundle_id },
			include: {
				bundle_podcast: {
					include: { podcast: true },
				},
			},
		})

		if (!createdBundle) {
			return new NextResponse("Failed to create bundle", { status: 500 })
		}

		// Transform the response to match the expected format
		const bundleWithPodcasts = {
			...createdBundle,
			podcasts: createdBundle.bundle_podcast.map((bp: { podcast: unknown }) => bp.podcast),
		}

		return NextResponse.json(bundleWithPodcasts)
	} catch (error) {
		console.error("[ADMIN_BUNDLES_POST]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}

// Delete a bundle
export async function DELETE(request: Request) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		// Check if user is admin
		const adminStatus = await isOrgAdmin()
		if (!adminStatus) {
			return new NextResponse("Forbidden", { status: 403 })
		}

		const { searchParams } = new URL(request.url)
		const bundleId = searchParams.get("id")

		if (!bundleId) {
			return new NextResponse("Bundle ID is required", { status: 400 })
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
			return new NextResponse("Bundle not found", { status: 404 })
		}

		if (bundle.user_curation_profile.length > 0) {
			return new NextResponse("Cannot delete bundle - it is currently being used by active user profiles", { status: 400 })
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
		return new NextResponse("Internal Error", { status: 500 })
	}
}
