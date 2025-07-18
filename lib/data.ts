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

const DUMMY_USER_CURATION_PROFILES: UserCurationProfileWithRelations[] = [
	{
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
		isBundleSelection: false,
		selectedBundleId: null,
		sources: DUMMY_SOURCES,
		episodes: [],
	},
	{
		id: "profile2",
		userId: "user_2gXwLd20u8wK51Y5YjBf02002",
		name: "Science & Discovery Bundle",
		status: "Saved" as UserCurationProfileStatus,
		audioUrl: null,
		imageUrl: DUMMY_TRANSFORMED_BUNDLE.imageUrl,
		createdAt: new Date(new Date().setDate(new Date().getDate() - 14)),
		updatedAt: new Date(),
		generatedAt: null,
		lastGenerationDate: null,
		nextGenerationDate: null,
		isActive: true,
		isBundleSelection: true,
		selectedBundleId: DUMMY_TRANSFORMED_BUNDLE.id,
		selectedBundle: DUMMY_TRANSFORMED_BUNDLE,
		sources: [],
		episodes: [],
	},
]

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
		userCurationProfileId: DUMMY_USER_CURATION_PROFILES[0].id,
		weekNr: new Date(),
		source: DUMMY_SOURCES[0],
		userCurationProfile: DUMMY_USER_CURATION_PROFILES[0],
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
		userCurationProfileId: DUMMY_USER_CURATION_PROFILES[0].id,
		weekNr: new Date(new Date().setDate(new Date().getDate() - 7)),
		source: DUMMY_SOURCES[1],
		userCurationProfile: DUMMY_USER_CURATION_PROFILES[0],
	},
]

// --- DATA FETCHING FUNCTIONS ---

export async function getUserCurationProfile(): Promise<UserCurationProfileWithRelations[]> {
	const { userId } = await auth()
	if (!userId) return []

	const dummyDataWithCorrectUserId = DUMMY_USER_CURATION_PROFILES.map(profile => ({
		...profile,
		userId: userId,
	})) as UserCurationProfileWithRelations[]

	// biome-ignore lint/suspicious/noConsoleLog: <explanation>
	// biome-ignore lint/suspicious/noConsole: <explanation>
	console.log("Using DUMMY_USER_CURATION_PROFILES with actual user ID:", userId)
	return dummyDataWithCorrectUserId
}

export async function getEpisodes(): Promise<Episode[]> {
	// biome-ignore lint/suspicious/noConsoleLog: <explanation>
	// biome-ignore lint/suspicious/noConsole: <explanation>
	console.log("Using DUMMY_EPISODES (Temporary)")
	return DUMMY_EPISODES
}

export async function getEpisodes() {
	const { userId } = await auth()
	if (!userId) return []
	// Fetch episodes for collections owned by the user
	const episodes = await prisma.episode.findMany({
		orderBy: { publishedAt: "desc" },
		include: {
			collection: {
				include: { sources: true },
			},
			source: true,
		},
		where: {
			collection: {
				userId: userId,
			},
		},
	})
	return episodes.map(episode => ({
		...episode,
		collection: episode.collection
			? ({
					id: episode.collection.id,
					name: episode.collection.name,
					status: episode.collection.status as CuratedCollection["status"],
					audioUrl: episode.collection.audioUrl,
					createdAt: episode.collection.createdAt,
					sources: episode.collection.sources.map(
						source =>
							({
								id: source.id,
								name: source.name,
								url: source.url,
								imageUrl: source.imageUrl || "",
							}) as PodcastSource
					),
				} as CuratedCollection)
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
