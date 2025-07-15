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

export interface UserCurationProfile {
	id: string
	userId: string
	name: string
	status: "Draft" | "Saved" | "Generated" | "Failed"
	audioUrl: string | null
	imageUrl: string | null
	createdAt: Date
	updatedAt: Date
	generatedAt?: Date | null
	lastGenerationDate?: Date | null
	nextGenerationDate?: Date | null
	isActive: boolean
	isBundleSelection: boolean
	selectedBundleId: string | null	
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
	userCurationProfileId: string
	userCurationProfile?: UserCurationProfile
	source?: PodcastSource
}

export interface FormState {
	success: boolean
	message: string
}
