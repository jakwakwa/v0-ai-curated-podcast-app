import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"
import { toast } from "sonner"

// Create a new bundle
export async function POST(request: Request) {
	const { userId, redirectToSignIn } = await auth()

	try {
		if (!userId) {
			toast.error("Unauthorized")
			return redirectToSignIn({ returnBackUrl: "/login" })
		}

		// Check if user is admin
		const adminStatus = await isAdmin()
		if (!adminStatus) {
			toast.error("Forbidden")
			return redirectToSignIn({ returnBackUrl: "/login" })
		}

		const body = await request.json()
		const { name, description, imageUrl, podcastIds } = body

		if (!name || !description || !podcastIds || !Array.isArray(podcastIds)) {
			toast.error("Missing required fields")
			return redirectToSignIn({ returnBackUrl: "/login" })
		}

		// Create the bundle
		const bundle = await prisma.curatedBundle.create({
			data: {
				name,
				description,
				imageUrl,
				isActive: true,
			},
		})

		// Create bundle-podcast relationships
		if (podcastIds.length > 0) {
			await prisma.curatedBundlePodcast.createMany({
				data: podcastIds.map((podcastId: string) => ({
					bundleId: bundle.id,
					podcastId,
				})),
			})
		}

		// Fetch the created bundle with podcasts
		const createdBundle = await prisma.curatedBundle.findUnique({
			where: { id: bundle.id },
			include: {
				bundlePodcasts: {
					include: { podcast: true },
				},
			},
		})

		if (!createdBundle) {
			toast.error("Failed to create bundle")
			return redirectToSignIn({ returnBackUrl: "/login" })
		}

		// Transform the response to match the expected format
		const bundleWithPodcasts = {
			...createdBundle,
			podcasts: createdBundle.bundlePodcasts.map(bp => bp.podcast),
		}

		return NextResponse.json(bundleWithPodcasts)
	} catch (error) {
		console.error("[ADMIN_BUNDLES_POST]", error)
		toast.error("Internal Error")
		return redirectToSignIn({ returnBackUrl: "/login" })
	}
}

// Delete a bundle
export async function DELETE(request: Request) {
	try {
		const { userId, redirectToSignIn } = await auth()

		if (!userId) {
			toast.error("Unauthorized")
			return redirectToSignIn({ returnBackUrl: "/login" })
		}

		// Check if user is admin
		const adminStatus = await isAdmin()
		if (!adminStatus) {
			toast.error("Forbidden")
			return redirectToSignIn({ returnBackUrl: "/login" })
		}

		const { searchParams } = new URL(request.url)
		const bundleId = searchParams.get("id")

		if (!bundleId) {
			toast.error("Bundle ID is required")
			return redirectToSignIn({ returnBackUrl: "/login" })
		}

		// Check if bundle exists and is not being used by any active user profiles
		const bundle = await prisma.curatedBundle.findUnique({
			where: { id: bundleId },
			include: {
				userCurationProfiles: {
					where: { isActive: true },
				},
			},
		})

		if (!bundle) {
			toast.error("Bundle not found")
			return redirectToSignIn({ returnBackUrl: "/login" })
		}

		if (bundle.userCurationProfiles.length > 0) {
			toast.error("Cannot delete bundle - it is currently being used by active user profiles")
			return redirectToSignIn({ returnBackUrl: "/login" })
		}

		// Delete bundle-podcast relationships first
		await prisma.curatedBundlePodcast.deleteMany({
			where: { bundleId },
		})

		// Delete any bundle episodes
		await prisma.curatedBundleEpisode.deleteMany({
			where: { bundleId },
		})

		// Finally delete the bundle
		await prisma.curatedBundle.delete({
			where: { id: bundleId },
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("[ADMIN_BUNDLES_DELETE]", error)
		toast.error("Internal Error")
		return NextResponse.json({ success: false }, { status: 500 })
	}
}
