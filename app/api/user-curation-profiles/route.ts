import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Force this API route to be dynamic since it uses auth()
export const dynamic = "force-dynamic"

export async function GET(_request: Request) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const userCurationProfile = await prisma.userCurationProfile.findFirst({
			where: { user_id: userId, is_active: true },
			include: {
				episodes: true,
				selectedBundle: {
					include: {
						bundle_podcast: {
							include: { podcast: true },
						},
						episodes: {
							orderBy: { published_at: "desc" },
						},
					},
				},
			},
		})

		if (!userCurationProfile) {
			return NextResponse.json(null)
		}

		// Transform the data to match the expected structure
		const transformedProfile = {
			...userCurationProfile,
			selectedBundle: userCurationProfile.selectedBundle
				? {
					...userCurationProfile.selectedBundle,
					podcasts: userCurationProfile.selectedBundle.bundle_podcast.map((bp: { podcast: unknown }) => bp.podcast),
					episodes: userCurationProfile.selectedBundle.episodes || [],
				}
				: null,
		}

		return NextResponse.json(transformedProfile)
	} catch (error) {
		console.error("[USER_CURATION_PROFILES_GET]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}

export async function POST(request: Request) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const body = await request.json()
		const { name, isBundleSelection, selectedBundleId, sourceUrls } = body

		if (!name) {
			return new NextResponse("User Curation Profile name is required", { status: 400 })
		}

		// Check if user already has an active user curation profile
		const existingUserCurationProfile = await prisma.userCurationProfile.findFirst({
			where: { user_id: userId, is_active: true },
		})

		if (existingUserCurationProfile) {
			return new NextResponse("User can only have one active user curation profile", { status: 400 })
		}

		// biome-ignore lint/suspicious/noImplicitAnyLet: <expected>
		let newUserCurationProfile

		if (isBundleSelection && selectedBundleId) {
			// Create a bundle-based user curation profile
			newUserCurationProfile = await prisma.userCurationProfile.create({
				data: {
					profile_id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
					user_id: userId,
					name,
					is_bundle_selection: true,
					selected_bundle_id: selectedBundleId,
					updated_at: new Date(),
				},
			})
		} else if (!isBundleSelection && sourceUrls) {
			// Create a custom user curation profile with sources
			// Note: Sources functionality has been temporarily disabled during migration
			newUserCurationProfile = await prisma.userCurationProfile.create({
				data: {
					profile_id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
					user_id: userId,
					name,
					is_bundle_selection: false,
					updated_at: new Date(),
				},
			})
		} else {
			return new NextResponse("Invalid user curation profile data provided", { status: 400 })
		}

		return NextResponse.json(newUserCurationProfile, { status: 201 })
	} catch (error) {
		console.error("[USER_CURATION_PROFILE_POST]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
