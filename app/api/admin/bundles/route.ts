import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { isOrgAdmin } from "@/lib/organization-roles"
import prisma from "@/lib/prisma"

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
		const { name, description, imageUrl, podcastIds } = body

		if (!(name && description && podcastIds && Array.isArray(podcastIds))) {
			return new NextResponse("Missing required fields", { status: 400 })
		}

		// Create the bundle
		const bundle = await prisma.bundle.create({
			data: {
				name,
				description,
				imageUrl,
				isActive: true,
			},
		})

		// Create bundle-podcast relationships
		if (podcastIds.length > 0) {
			await prisma.bundlePodcast.createMany({
				data: podcastIds.map((podcastId: string) => ({
					bundleId: bundle.id,
					podcastId,
				})),
			})
		}

		// Fetch the created bundle with podcasts
		const createdBundle = await prisma.bundle.findUnique({
			where: { id: bundle.id },
			include: {
				podcasts: {
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
			podcasts: createdBundle.podcasts.map(bp => bp.podcast),
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
			where: { id: bundleId },
			include: {
				profiles: {
					where: { isActive: true },
				},
			},
		})

		if (!bundle) {
			return new NextResponse("Bundle not found", { status: 404 })
		}

		if (bundle.profiles.length > 0) {
			return new NextResponse("Cannot delete bundle - it is currently being used by active user profiles", { status: 400 })
		}

		// Delete bundle-podcast relationships first
		await prisma.bundlePodcast.deleteMany({
			where: { bundleId },
		})

		// Delete any bundle episodes
		await prisma.episode.deleteMany({
			where: { bundleId },
		})

		// Finally delete the bundle
		await prisma.bundle.delete({
			where: { id: bundleId },
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("[ADMIN_BUNDLES_DELETE]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
