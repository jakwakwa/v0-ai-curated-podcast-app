"use server"

import type {
	CuratedPodcast,
	Episode,
	Source,
	TransformedCuratedBundle,
	UserCurationProfile,
	UserCurationProfileStatus,
} from "@/lib/types"
// import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

// TODO: Remove DUMMY DATA and uncomment original prisma queries after UI planning

// --- DUMMY DATA (TEMPORARY) ---
const DUMMY_CURATED_PODCASTS: CuratedPodcast[] = [
	{
		id: "pod1",
		name: "Lex Fridman Podcast",
		url: "https://www.youtube.com/@lexfridman",
		description:
			"Conversations about science, technology, history, philosophy and the nature of intelligence, consciousness, love, and power.",
		imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop",
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
	{
		id: "pod3",
		name: "Freakonomics",
		url: "https://freakonomics.com/",
		description: "Discover the hidden side of everything with Stephen J. Dubner.",
		imageUrl: "https://images.unsplash.com/photo-1556761175-4acf4c6d6c96?w=400&h=400&fit=crop",
		category: "Business",
		isActive: true,
		createdAt: new Date(),
	},
	{
		id: "pod4",
		name: "The Daily",
		url: "https://www.nytimes.com/column/the-daily",
		description: "The biggest stories of our time, told by the best journalists in the world.",
		imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=400&fit=crop",
		category: "News",
		isActive: true,
		createdAt: new Date(),
	},
	{
		id: "pod5",
		name: "Hidden Brain",
		url: "https://www.npr.org/series/423302056/hidden-brain",
		description:
			"Shankar Vedantam uses science and storytelling to reveal the unconscious patterns that drive human behavior.",
		imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
		category: "Science",
		isActive: true,
		createdAt: new Date(),
	},
]

const DUMMY_SOURCES: Source[] = [
	{
		id: "src1",
		// @ts-ignore
		collectionId: "collection1",
		name: "Lex Fridman Podcast Source",
		url: "https://www.youtube.com/watch?v=lex_vid_1",
		imageUrl: DUMMY_CURATED_PODCASTS[0].imageUrl,
		createdAt: new Date(),
	},
	{
		id: "src2",
		// @ts-ignore
		collectionId: "collection1",
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
	imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop",
	isActive: true,
	createdAt: new Date(),
	podcasts: [DUMMY_CURATED_PODCASTS[0], DUMMY_CURATED_PODCASTS[1]],
}

const DUMMY_USER_CURATION_PROFILES: UserCurationProfile[] = [
	{
		id: "userCurationProfile1",
		userId: "user_2gXwLd20u8wK51Y5YjBf02002", // Replace with your test user ID
		name: "My Custom Tech Collection",
		status: "Generated" as UserCurationProfileStatus,
		audioUrl: "https://example.com/audio/my-custom-collection-latest.mp3",
		imageUrl: "https://example.com/image/my-custom-collection.jpg",
		createdAt: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 days ago
		updatedAt: new Date(),
		generatedAt: new Date(new Date().setDate(new Date().getDate() - 1)), // 1 day ago
		lastGenerationDate: new Date(new Date().setDate(new Date().getDate() - 8)),
		nextGenerationDate: new Date(new Date().setDate(new Date().getDate() + 6)),
		isActive: true,
		isBundleSelection: false,
		selectedBundleId: null,
		// @ts-ignore
		sources: DUMMY_SOURCES,
		// @ts-ignore
		user: {}, // Placeholder, not used in this context
		episodes: [], // Will be populated by DUMMY_EPISODES
	},
	{
		id: "userCurationProfile2",
		userId: "user_2gXwLd20u8wK51Y5YjBf02002", // Replace with your test user ID
		name: "Science & Discovery Bundle",
		status: "Saved" as UserCurationProfileStatus,
		audioUrl: null,
		imageUrl: DUMMY_TRANSFORMED_BUNDLE.imageUrl,
		createdAt: new Date(new Date().setDate(new Date().getDate() - 14)), // 14 days ago
		updatedAt: new Date(),
		generatedAt: null,
		lastGenerationDate: null,
		nextGenerationDate: null,
		isActive: true,
		isBundleSelection: true,
		selectedBundleId: DUMMY_TRANSFORMED_BUNDLE.id,
		// @ts-ignore
		selectedBundle: DUMMY_TRANSFORMED_BUNDLE,
		sources: [],
		user: {}, // Placeholder
		episodes: [],
	},
]

const DUMMY_EPISODES: Episode[] = [
	{
		id: "episode1",
		title: "The Future of AI: A Deep Dive",
		description: "An in-depth look into the latest advancements and ethical considerations in artificial intelligence.",
		audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
		imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop",
		publishedAt: new Date(new Date().setDate(new Date().getDate() - 2)), // 2 days ago
		createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
		sourceId: DUMMY_SOURCES[0].id,
		// @ts-ignore
		collectionId: DUMMY_USER_CURATION_PROFILES[0].id,
		source: DUMMY_SOURCES[0],
		userCurationProfile: DUMMY_USER_CURATION_PROFILES[0],
		weekNr: new Date(), // Dummy week number
	},
	{
		id: "episode2",
		title: "Space Exploration: Beyond Our Solar System",
		description: "Exploring the possibilities of interstellar travel and discovering exoplanets.",
		audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
		imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop",
		publishedAt: new Date(new Date().setDate(new Date().getDate() - 9)), // 9 days ago
		createdAt: new Date(new Date().setDate(new Date().getDate() - 9)),
		sourceId: DUMMY_SOURCES[1].id,
		// @ts-ignore
		collectionId: DUMMY_USER_CURATION_PROFILES[0].id,
		source: DUMMY_SOURCES[1],
		userCurationProfile: DUMMY_USER_CURATION_PROFILES[0],
		weekNr: new Date(new Date().setDate(new Date().getDate() - 7)), // Dummy week number
	},
	{
		id: "episode3",
		title: "The Science of Happiness",
		description: "Understanding the psychological and neurological basis of human well-being.",
		audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
		imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
		publishedAt: new Date(new Date().setDate(new Date().getDate() - 16)), // 16 days ago
		createdAt: new Date(new Date().setDate(new Date().getDate() - 16)),
		sourceId: DUMMY_CURATED_PODCASTS[4].id, // Using a curated podcast directly for a dummy episode
		// @ts-ignore
		collectionId: DUMMY_USER_CURATION_PROFILES[1].id,
		source: {
			// Dummy source for this episode as it's from a bundle
			id: "src3",
			collectionId: DUMMY_USER_CURATION_PROFILES[1].id,
			name: DUMMY_CURATED_PODCASTS[4].name,
			url: DUMMY_CURATED_PODCASTS[4].url,
			imageUrl: DUMMY_CURATED_PODCASTS[4].imageUrl,
			createdAt: new Date(),
		},
		userCurationProfile: DUMMY_USER_CURATION_PROFILES[1],
		weekNr: new Date(new Date().setDate(new Date().getDate() - 14)), // Dummy week number
	},
]
// --- END DUMMY DATA ---

// Removing the getPodcasts function as it's for dummy data and no longer relevant

export async function getCuratedCollections(): Promise<UserCurationProfile[]> {
	const { userId } = await auth()

	if (!userId) {
		return []
	}

	// For now, return dummy data but with the correct user ID
	const dummyDataWithCorrectUserId = DUMMY_USER_CURATION_PROFILES.map(profile => ({
		...profile,
		userId: userId, // Use the actual logged-in user ID
	}))

	// biome-ignore lint/suspicious/noConsoleLog: <explanation>
	// biome-ignore lint/suspicious/noConsole: <explanation>
	console.log("Using DUMMY_USER_CURATION_PROFILES with actual user ID:", userId)
	return dummyDataWithCorrectUserId

	// const collections = await prisma.userCurationProfile.findMany({
	// 	where: { userId: userId, isActive: true }, // Only fetch active collections
	// 	include: {
	// 		sources: true,
	// 		selectedBundle: {
	// 			include: {
	// 				bundlePodcasts: {
	// 					include: { podcast: true },
	// 				},
	// 			},
	// 		},
	// 	},
	// })

	// return collections.map((collection) => {
	// 	const transformedCollection: UserCurationProfile = {
	// 		...collection,
	// 		status: collection.status as UserCurationProfileStatus,
	// 		sources: collection.sources.map((source: Source) => ({
	// 			...source,
	// 			imageUrl: source.imageUrl ?? "",
	// 		})),
	// 		selectedBundle: collection.selectedBundle
	// 			? {
	// 					...collection.selectedBundle,
	// 					podcasts: collection.selectedBundle.bundlePodcasts.map((bp) => bp.podcast),
	// 				}
	// 			: null,
	// 	}
	// 	return transformedCollection
	// })
}

export async function getEpisodes(): Promise<Episode[]> {
	// const { userId } = await auth()
	// if (!userId) return []
	// // Fetch episodes for collections owned by the user
	// const episodes = await prisma.episode.findMany({
	// 	orderBy: { publishedAt: "desc" },
	// 	include: {
	// 		userCurationProfile: {
	// 			include: { sources: true },
	// 		},
	// 		source: true,
	// 	},
	// 	where: {
	// 		userCurationProfile: {
	// 			userId: userId,
	// 		},
	// 	},
	// })
	// return episodes.map((episode: PrismaEpisode & { userCurationProfile: PrismaUserCurationProfile & { sources: PrismaSource[] } | null; source: PrismaSource | null }) => {
	// 	const transformedEpisode: Episode = {
	// 		...episode,
	// 		userCurationProfile: episode.userCurationProfile
	// 			? {
	// 					...episode.userCurationProfile,
	// 					status: episode.userCurationProfile.status as UserCurationProfileStatus,
	// 					sources: episode.userCurationProfile.sources.map((source: PrismaSource) => ({
	// 						...source,
	// 						imageUrl: source.imageUrl ?? null,
	// 					})),
	// 				}
	// 			: undefined,
	// 		source: episode.source
	// 			? {
	// 					...episode.source,
	// 					imageUrl: episode.source.imageUrl ?? "",
	// 				}
	// 			: undefined,
	// 	}
	// 	return transformedEpisode
	// })
	// biome-ignore lint/suspicious/noConsoleLog: <explanation>
	// biome-ignore lint/suspicious/noConsole: <explanation>
	console.log("Using DUMMY_EPISODES (Temporary)")
	return DUMMY_EPISODES
}
