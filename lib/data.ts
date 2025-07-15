"use server"

import prisma from "@/lib/prisma"
import type { UserCurationProfile, Podcast, PodcastSource } from '@/lib/types'
import { auth } from "@clerk/nextjs/server"

export async function getPodcasts(): Promise<Podcast[]> {
	// For demonstration, return dummy data
	return [
		{
			id: "1",
			title: "The AI Revolution in Healthcare",
			date: "2023-10-26",
			status: "Completed",
			duration: "25:30",
			audioUrl: "/podcast1.mp3",
		},
		{
			id: "2",
			title: "Sustainable Living in the 21st Century",
			date: "2023-10-25",
			status: "Processing",
			duration: "28:15",
			audioUrl: null,
		},
		{
			id: "3",
			title: "The Future of Remote Work",
			date: "2023-10-24",
			status: "Failed",
			duration: "00:00",
			audioUrl: null,
		},
	]
}

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

	return collections.map(collection => ({
		...collection,
		status: collection.status as "Draft" | "Saved" | "Generated" | "Failed",
		sources: collection.sources.map(source => ({
			...source,
			imageUrl: source.imageUrl || "",
		})),
		selectedBundle: collection.selectedBundle
			? {
					...collection.selectedBundle,
					// Flatten bundlePodcasts to just podcasts for easier use in frontend
					podcasts: collection.selectedBundle.bundlePodcasts.map(bp => bp.podcast),
				}
			: null,
	})) as unknown as UserCurationProfile[]
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
	return episodes.map(episode => ({
		...episode,
		userCurationProfile: episode.userCurationProfile
			? ({
					id: episode.userCurationProfile.id,
					name: episode.userCurationProfile.name,
					status: episode.userCurationProfile.status as UserCurationProfile["status"],
					audioUrl: episode.userCurationProfile.audioUrl,
					createdAt: episode.userCurationProfile.createdAt,
					imageUrl: episode.userCurationProfile.imageUrl,
					updatedAt: episode.userCurationProfile.updatedAt,
					generatedAt: episode.userCurationProfile.generatedAt,
					lastGenerationDate: episode.userCurationProfile.lastGenerationDate,
					nextGenerationDate: episode.userCurationProfile.nextGenerationDate,
					isActive: episode.userCurationProfile.isActive,
					isBundleSelection: episode.userCurationProfile.isBundleSelection,
					selectedBundleId: episode.userCurationProfile.selectedBundleId,
					sources: episode.userCurationProfile.sources.map(
						source =>
							({
								id: source.id,
								name: source.name,
								url: source.url,
								imageUrl: source.imageUrl || "",
							}) as PodcastSource
					),
				} as UserCurationProfile)
			: undefined,
		source: episode.source
			? ({
					id: episode.source.id,
					name: episode.source.name,
					url: episode.source.url,
					imageUrl: episode.source.imageUrl || "",
				} as PodcastSource)
			: undefined,
	}))
}
