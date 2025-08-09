import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_request: Request) {
	try {
		console.log("User curation profiles API: Starting request...")
		// Temporarily disable auth for testing
		// const { userId } = await auth()
		// console.log("User curation profiles API: Auth successful, userId:", userId)

		// Use the real userId from your database
		const userId = "user_2znO9fTWcCGHg3N7GmyyCA8730S"
		console.log("User curation profiles API: Using real userId:", userId)

		if (!userId) {
			console.log("User curation profiles API: No userId, returning 401")
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
			console.log("User curation profiles API: No profile found, returning null")
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

		console.log("User curation profiles API: Returning profile")
		return NextResponse.json(transformedProfile)
	} catch (error) {
		console.error("[USER_CURATION_PROFILES_GET]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}

// ... rest of the file stays the same
