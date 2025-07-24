"use server"

import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import type { Episode, UserCurationProfileWithRelations } from "@/lib/types"

// --- DATA FETCHING FUNCTIONS ---

export async function getUserCurationProfile(): Promise<UserCurationProfileWithRelations | null> {
	const { userId } = await auth()
	if (!userId) return null

	// Real database query - only get the active user curation profile
	try {
		const userCurationProfile = await prisma.userCurationProfile.findFirst({
			where: { userId, isActive: true },
			include: {
				podcastSelections: {
					include: { podcast: true },
				},
				episodes: true,
				selectedBundle: {
					include: {
						podcasts: {
							include: { podcast: true },
						},
						episodes: {
							orderBy: { publishedAt: "desc" },
						},
					},
				},
			},
		})

		if (!userCurationProfile) {
			return null
		}

		// Transform the data to match the expected structure
		const transformedProfile = {
			...userCurationProfile,
			selectedBundle: userCurationProfile.selectedBundle
				? {
						...userCurationProfile.selectedBundle,
						podcasts: userCurationProfile.selectedBundle.podcasts.map(bp => bp.podcast),
						episodes: userCurationProfile.selectedBundle.episodes || [],
					}
				: null,
		}

		return transformedProfile as UserCurationProfileWithRelations
	} catch (error) {
		console.error("Error fetching user curation profile:", error)
		return null
	}
}

export async function getEpisodes(_query?: { search?: string; page?: number; limit?: number }): Promise<Episode[]> {
	// Real database query using unified schema
	try {
		const { userId } = await auth()
		if (!userId) return []

		const episodes = await prisma.episode.findMany({
			where: {
				OR: [
					// Episodes from user's custom profile
					{
						userProfile: { userId },
					},
					// Episodes from user's selected bundle
					{
						bundle: {
							profiles: {
								some: { userId },
							},
						},
					},
				],
			},
			include: {
				podcast: true, // Unified podcast model
				userProfile: true,
				bundle: {
					include: {
						podcasts: {
							include: { podcast: true },
						},
					},
				},
			},
			orderBy: { createdAt: "desc" },
		})

		return episodes
	} catch (error) {
		console.error("Error fetching episodes:", error)
		return []
	}
}
