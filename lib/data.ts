"use server"

import type {
	CuratedPodcast,
	Episode,
	Source,
	TransformedCuratedBundle,
	UserCurationProfileStatus,
	UserCurationProfileWithRelations,
} from "@/lib/types"
import { auth } from "@clerk/nextjs/server"
import { shouldUseDummyData, logDummyDataUsage } from "./config"
import prisma from "@/lib/prisma"

// --- CONCISE DUMMY DATA MATCHING PRISMA SCHEMA ---

const DUMMY_CURATED_PODCASTS: CuratedPodcast[] = [
	{
		id: "pod1",
		name: "Lex Fridman Podcast",
		url: "https://www.youtube.com/@lexfridman",
		description:
			"Conversations about science, technology, history, philosophy and the nature of intelligence, consciousness, love, and power.",
		imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop",
		category: "Technology",
		isActive: true,
		createdAt: new Date(),
	},
	{
		id: "pod2",
		name: "The Vergecast",
		url: "https://www.youtube.com/@verge",
		description: "The flagship podcast of The Verge... and the internet.",
		imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop",
		category: "Technology",
		isActive: true,
		createdAt: new Date(),
	},
]

const DUMMY_SOURCES: Source[] = [
	{
		id: "src1",
		userCurationProfileId: "dummyCurationProfile",
		name: "Lex Fridman Podcast Source",
		url: "https://www.youtube.com/watch?v=lex_vid_1",
		imageUrl: DUMMY_CURATED_PODCASTS[0].imageUrl,
		createdAt: new Date(),
	},
	{
		id: "src2",
		userCurationProfileId: "dummyCurationProfile",
		name: "The Vergecast Source",
		url: "https://www.youtube.com/watch?v=verge_vid_1",
		imageUrl: DUMMY_CURATED_PODCASTS[1].imageUrl,
		createdAt: new Date(),
	},
]

const DUMMY_TRANSFORMED_BUNDLE: TransformedCuratedBundle = {
	id: "bundle1",
	name: "Tech Weekly",
	description: "Latest in technology and innovation",
	imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop",
	isActive: true,
	createdAt: new Date(),
	podcasts: DUMMY_CURATED_PODCASTS,
}

// User can only have ONE active user curation profile - either bundle or custom
const DUMMY_USER_CURATION_PROFILE: UserCurationProfileWithRelations = {
	id: "dummyCurationProfile",
	userId: "user_2gXwLd20u8wK51Y5YjBf02002",
	name: "My Custom Tech Collection",
	status: "Generated" as UserCurationProfileStatus,
	audioUrl: "https://example.com/audio/my-custom-collection-latest.mp3",
	imageUrl: "https://example.com/image/my-custom-collection.jpg",
	createdAt: new Date(new Date().setDate(new Date().getDate() - 7)),
	updatedAt: new Date(),
	generatedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
	lastGenerationDate: new Date(new Date().setDate(new Date().getDate() - 8)),
	nextGenerationDate: new Date(new Date().setDate(new Date().getDate() + 6)),
	isActive: true,
	isBundleSelection: false, // This user has a custom profile (not bundle)
	selectedBundleId: null,
	selectedBundle: null,
	sources: DUMMY_SOURCES,
	episodes: [],
}

const DUMMY_EPISODES: Episode[] = [
	{
		id: "episode1",
		title: "The Future of AI: A Deep Dive",
		description: "An in-depth look into the latest advancements and ethical considerations in artificial intelligence.",
		audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
		imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=400&fit=crop",
		publishedAt: new Date(new Date().setDate(new Date().getDate() - 2)),
		createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
		sourceId: DUMMY_SOURCES[0].id,
		userCurationProfileId: DUMMY_USER_CURATION_PROFILE.id,
		weekNr: new Date(),
		source: DUMMY_SOURCES[0],
		userCurationProfile: DUMMY_USER_CURATION_PROFILE,
	},
	{
		id: "episode2",
		title: "Space Exploration: Beyond Our Solar System",
		description: "Exploring the possibilities of interstellar travel and discovering exoplanets.",
		audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
		imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop",
		publishedAt: new Date(new Date().setDate(new Date().getDate() - 9)),
		createdAt: new Date(new Date().setDate(new Date().getDate() - 9)),
		sourceId: DUMMY_SOURCES[1].id,
		userCurationProfileId: DUMMY_USER_CURATION_PROFILE.id,
		weekNr: new Date(new Date().setDate(new Date().getDate() - 7)),
		source: DUMMY_SOURCES[1],
		userCurationProfile: DUMMY_USER_CURATION_PROFILE,
	},
]

// --- DATA FETCHING FUNCTIONS ---

export async function getUserCurationProfile(): Promise<UserCurationProfileWithRelations | null> {
	const { userId } = await auth()
	if (!userId) return null

	if (shouldUseDummyData()) {
		logDummyDataUsage("getUserCurationProfile")
		const dummyDataWithCorrectUserId = {
			...DUMMY_USER_CURATION_PROFILE,
			userId: userId,
		} as UserCurationProfileWithRelations
		return dummyDataWithCorrectUserId
	}

	// Real database query - only get the active user curation profile
	try {
		const userCurationProfile = await prisma.userCurationProfile.findFirst({
			where: { userId, isActive: true },
			include: {
				sources: true,
				episodes: true,
				selectedBundle: {
					include: {
						bundlePodcasts: {
							include: { podcast: true }
						},
						episodes: {
							orderBy: { publishedAt: "desc" }
						}
					}
				}
			},
		})

		if (!userCurationProfile) {
			return null
		}

		// Transform the data to match the expected structure
		const transformedProfile = {
			...userCurationProfile,
			selectedBundle: userCurationProfile.selectedBundle ? {
				...userCurationProfile.selectedBundle,
				podcasts: userCurationProfile.selectedBundle.bundlePodcasts.map(bp => bp.podcast),
				episodes: userCurationProfile.selectedBundle.episodes || []
			} : null
		}

		return transformedProfile as UserCurationProfileWithRelations
	} catch (error) {
		console.error('Error fetching user curation profile:', error)
		// Fallback to dummy data if database query fails
		logDummyDataUsage("getUserCurationProfile (Database fallback)")
		const dummyDataWithCorrectUserId = {
			...DUMMY_USER_CURATION_PROFILE,
			userId: userId,
		} as UserCurationProfileWithRelations
		return dummyDataWithCorrectUserId
	}
}

export async function getEpisodes(): Promise<Episode[]> {
	if (shouldUseDummyData()) {
		logDummyDataUsage("getEpisodes")
		return DUMMY_EPISODES
	}

	// Real database query
	try {
		const { userId } = await auth()
		if (!userId) return []

		const episodes = await prisma.episode.findMany({
			where: {
				userCurationProfile: { userId }
			},
			include: {
				source: true,
				userCurationProfile: {
					include: {
						sources: true,
						selectedBundle: {
							include: {
								bundlePodcasts: {
									include: { podcast: true }
								}
							}
						}
					}
				}
			},
			orderBy: { createdAt: "desc" },
		})

		// Transform the data to match the Episode type
		const transformedEpisodes = episodes.map(episode => ({
			id: episode.id,
			title: episode.title,
			description: episode.description,
			audioUrl: episode.audioUrl,
			imageUrl: episode.imageUrl,
			publishedAt: episode.publishedAt,
			createdAt: episode.createdAt,
			sourceId: episode.sourceId,
			userCurationProfileId: episode.userCurationProfileId,
			weekNr: episode.weekNr,
			source: episode.source,
			userCurationProfile: episode.userCurationProfile
		}))

		return transformedEpisodes as Episode[]
	} catch (error) {
		console.error('Error fetching episodes:', error)
		// Fallback to dummy data if database query fails
		logDummyDataUsage("getEpisodes (Database fallback)")
		return DUMMY_EPISODES
	}
}
