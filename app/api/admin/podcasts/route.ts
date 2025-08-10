import { auth } from "@clerk/nextjs/server"
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

		// Get all podcasts
		const podcasts = await prisma.podcast.findMany({
			orderBy: { created_at: "desc" },
		})

		return NextResponse.json(podcasts)
	} catch (error) {
		console.error("Admin podcasts error:", error)
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
		const { name, description, url, imageUrl, category } = body

		if (!(name && url)) {
			return new NextResponse("Name and URL are required", { status: 400 })
		}

		// Create podcast
		const podcast = await prisma.podcast.create({
			data: {
				podcast_id: `podcast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				name,
				description,
				url,
				image_url: imageUrl,
				category,
				is_active: true,
				owner_user_id: null, // Admin-created podcasts should be global
			},
		})

		return NextResponse.json({ success: true, podcast })
	} catch (error) {
		console.error("Admin podcasts POST error:", error)
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
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
		const adminCheck = await requireAdminMiddleware()
		if (adminCheck) {
			return adminCheck // Return error response if not admin
		}

		const body = await request.json()
		const { id, name, description, url, image_url, category, is_active } = body

		if (!id) {
			return new NextResponse("Podcast ID is required", { status: 400 })
		}

		// Check if podcast exists
		const existingPodcast = await prisma.podcast.findUnique({
			where: { podcast_id: id },
		})

		if (!existingPodcast) {
			return new NextResponse("Podcast not found", { status: 404 })
		}

		// Allow any category - no validation needed

		// Check if name or URL conflicts with other podcasts
		if (name || url) {
			const conflictingPodcast = await prisma.podcast.findFirst({
				where: {
					podcast_id: { not: id },
					OR: [...(name ? [{ name }] : []), ...(url ? [{ url }] : [])],
				},
			})

			if (conflictingPodcast) {
				return new NextResponse("Another podcast with this name or URL already exists", { status: 400 })
			}
		}

		// Update the podcast
		const updatedPodcast = await prisma.podcast.update({
			where: { podcast_id: id },
			data: {
				...(name && { name }),
				...(description && { description }),
				...(url && { url }),
				...(image_url !== undefined && { image_url: image_url }),
				...(category && { category }),
				...(is_active !== undefined && { is_active: is_active }),
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
		const adminCheck = await requireAdminMiddleware()
		if (adminCheck) {
			return adminCheck // Return error response if not admin
		}

		const { searchParams } = new URL(request.url)
		const podcastId = searchParams.get("id")

		if (!podcastId) {
			return new NextResponse("Podcast ID is required", { status: 400 })
		}

		// Check if podcast exists
		const podcast = await prisma.podcast.findUnique({
			where: { podcast_id: podcastId },
			include: {
				bundle_podcast: {
					include: {
						bundle: {
							include: {
								user_curation_profile: {
									where: { is_active: true },
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
		const activeUsage = podcast.bundle_podcast.some((bp: { bundle: { user_curation_profile: unknown[] } }) => bp.bundle.user_curation_profile.length > 0)

		if (activeUsage) {
			return new NextResponse("Cannot delete podcast - it is currently being used in bundles with active user profiles. Consider deactivating instead.", { status: 400 })
		}

		// Delete bundle-podcast relationships first
		await prisma.bundlePodcast.deleteMany({
			where: { podcast_id: podcastId },
		})

		// Finally delete the podcast
		await prisma.podcast.delete({
			where: { podcast_id: podcastId },
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("[ADMIN_PODCASTS_DELETE]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
