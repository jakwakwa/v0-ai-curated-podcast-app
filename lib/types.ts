export interface Podcast {
	id: string
	title: string
	date: string
	status: "Completed" | "Processing" | "Failed"
	duration: string
	audioUrl: string | null
}

export interface PodcastSource {
	id: string
	name: string
	url: string
	imageUrl: string
	transcript?: string | null
}

export interface CuratedCollection {
	id: string
	name: string
	status: "Draft" | "Saved" | "Generated" | "Failed"
	audioUrl?: string | null
	sources: PodcastSource[]
	createdAt: Date
}

export interface Episode {
	id: string
	title: string
	description?: string | null
	audioUrl: string
	imageUrl?: string | null
	publishedAt?: string | Date | null
	createdAt: string | Date
	sourceId: string
	collectionId: string
	collection?: CuratedCollection
	source?: PodcastSource
}

export interface FormState {
	success: boolean
	message: string
}
