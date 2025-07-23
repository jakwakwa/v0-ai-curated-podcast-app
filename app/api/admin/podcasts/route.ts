import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"
import prisma from "@/lib/prisma"

// Create a new podcast
export async function POST(request: Request) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		// Check if user is admin
		const adminStatus = await isAdmin()
		if (!adminStatus) {
			return new NextResponse("Forbidden", { status: 403 })
		}

		const body = await request.json()
		const { name, description, url, imageUrl, category } = body

		if (!name || !description || !url || !category) {
			return new NextResponse("Missing required fields", { status: 400 })
		}

		// Validate category
		const validCategories = ["Technology", "Business", "Science", "News"]
		if (!validCategories.includes(category)) {
			return new NextResponse("Invalid category", { status: 400 })
		}

		// Check if a podcast with the same name or URL already exists
		const existingPodcast = await prisma.podcast.findFirst({
			where: {
				OR: [{ name }, { url }],
			},
		})

		if (existingPodcast) {
			return new NextResponse("Podcast with this name or URL already exists", { status: 400 })
		}

		// Create the podcast
		const podcast = await prisma.podcast.create({
			data: {
				name,
				description,
				url,
				imageUrl,
				category,
				isActive: true,
			},
		})

		return NextResponse.json(podcast)
	} catch (error) {
		console.error("[ADMIN_PODCASTS_POST]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}

// Update a podcast
export async function PATCH(request: Request) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		// Check if user is admin
		const adminStatus = await isAdmin()
		if (!adminStatus) {
			return new NextResponse("Forbidden", { status: 403 })
		}

		const body = await request.json()
		const { id, name, description, url, imageUrl, category, isActive } = body

		if (!id) {
			return new NextResponse("Podcast ID is required", { status: 400 })
		}

		// Check if podcast exists
		const existingPodcast = await prisma.podcast.findUnique({
			where: { id },
		})

		if (!existingPodcast) {
			return new NextResponse("Podcast not found", { status: 404 })
		}

		// Validate category if provided
		if (category) {
			const validCategories = ["Technology", "Business", "Science", "News"]
			if (!validCategories.includes(category)) {
				return new NextResponse("Invalid category", { status: 400 })
			}
		}

		// Check if name or URL conflicts with other podcasts
		if (name || url) {
			const conflictingPodcast = await prisma.podcast.findFirst({
				where: {
					id: { not: id },
					OR: [...(name ? [{ name }] : []), ...(url ? [{ url }] : [])],
				},
			})

			if (conflictingPodcast) {
				return new NextResponse("Another podcast with this name or URL already exists", { status: 400 })
			}
		}

		// Update the podcast
		const updatedPodcast = await prisma.podcast.update({
			where: { id },
			data: {
				...(name && { name }),
				...(description && { description }),
				...(url && { url }),
				...(imageUrl !== undefined && { imageUrl }),
				...(category && { category }),
				...(isActive !== undefined && { isActive }),
			},
		})

		return NextResponse.json(updatedPodcast)
	} catch (error) {
		console.error("[ADMIN_PODCASTS_PATCH]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}

// Delete a podcast
export async function DELETE(request: Request) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		// Check if user is admin
		const adminStatus = await isAdmin()
		if (!adminStatus) {
			return new NextResponse("Forbidden", { status: 403 })
		}

		const { searchParams } = new URL(request.url)
		const podcastId = searchParams.get("id")

		if (!podcastId) {
			return new NextResponse("Podcast ID is required", { status: 400 })
		}

		// Check if podcast exists
		const podcast = await prisma.podcast.findUnique({
			where: { id: podcastId },
			include: {
				bundleLinks: {
					include: {
						bundle: {
							include: {
								profiles: {
									where: { isActive: true },
								},
							},
						},
					},
				},
			},
		})

		if (!podcast) {
			return new NextResponse("Podcast not found", { status: 404 })
		}

		// Check if podcast is being used in any active bundles with active user profiles
		const activeUsage = podcast.bundleLinks.some(bp => bp.bundle.profiles.length > 0)

		if (activeUsage) {
			return new NextResponse("Cannot delete podcast - it is currently being used in bundles with active user profiles. Consider deactivating instead.", { status: 400 })
		}

		// Delete bundle-podcast relationships first
		await prisma.bundlePodcast.deleteMany({
			where: { podcastId },
		})

		// Finally delete the podcast
		await prisma.podcast.delete({
			where: { id: podcastId },
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("[ADMIN_PODCASTS_DELETE]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
