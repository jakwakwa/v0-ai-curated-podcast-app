"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import type { Episode, UserCurationProfile, UserCurationProfileStatus } from '@/lib/types'
import type { Source, Episode as PrismaEpisode, UserCurationProfile as PrismaUserCurationProfile } from "@prisma/client"

// Removing the getPodcasts function as it's for dummy data and no longer relevant

export async function getCuratedCollections(): Promise<UserCurationProfile[]> {
	const { userId } = await auth()

	if (!userId) {
		return []
	}

	const collections = await prisma.userCurationProfile.findMany({
		where: { userId: userId, isActive: true }, // Only fetch active collections
		include: {
			sources: true,
			selectedBundle: {
				include: {
					bundlePodcasts: {
						include: { podcast: true },
					},
				},
			},
		},
	})

	return collections.map((collection) => {
		const transformedCollection: UserCurationProfile = {
			...collection,
			status: collection.status as UserCurationProfileStatus,
			sources: collection.sources.map((source: Source) => ({
				...source,
				imageUrl: source.imageUrl ?? "",
			})),
			selectedBundle: collection.selectedBundle
				? {
						...collection.selectedBundle,
						podcasts: collection.selectedBundle.bundlePodcasts.map((bp) => bp.podcast),
					}
				: null,
		}
		return transformedCollection
	})
}

export async function getEpisodes() {
	const { userId } = await auth()
	if (!userId) return []
	// Fetch episodes for collections owned by the user
	const episodes = await prisma.episode.findMany({
		orderBy: { publishedAt: "desc" },
		include: {
			userCurationProfile: {
				include: { sources: true },
			},
			source: true,
		},
		where: {
			userCurationProfile: {
				userId: userId,
			},
		},
	})
	return episodes.map((episode: PrismaEpisode & { userCurationProfile: PrismaUserCurationProfile & { sources: Source[] } | null; source: Source | null }) => {
		const transformedEpisode: Episode = {
			...episode,
			userCurationProfile: episode.userCurationProfile
				? {
						...episode.userCurationProfile,
						status: episode.userCurationProfile.status as UserCurationProfileStatus,
						sources: episode.userCurationProfile.sources.map((source: Source) => ({
							...source,
							imageUrl: source.imageUrl ?? null,
						})),
					}
				: undefined,
			source: episode.source
				? {
						...episode.source,
						imageUrl: episode.source.imageUrl ?? "",
					}
				: undefined,
		}
		return transformedEpisode
	})
}
