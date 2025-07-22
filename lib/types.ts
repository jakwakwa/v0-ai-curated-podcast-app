// Import Prisma's generated types
import type {
	CuratedBundle,
	CuratedBundleEpisode,
	CuratedBundleEpisodeFeedback,
	CuratedBundlePodcast,
	CuratedPodcast,
	EpisodeFeedback,
	FeedbackRating,
	Notification,
	Source,
	Subscription,
	User,
	UserCurationProfile,
} from "@prisma/client"

// Re-export for convenience
export type {
	User, // TODO: Find out why User is not used?
	UserCurationProfile,
	Source,
	CuratedPodcast,
	CuratedBundle,
	CuratedBundleEpisode,
	CuratedBundleEpisodeFeedback,
	CuratedBundlePodcast,
	Notification,
	Subscription,
	EpisodeFeedback,
	FeedbackRating,
}

// TODO EpisodeFeedback needs to be updated to include the userCurationProfileId
export type Episode = {
	id: string
	title: string
	description: string | null
	audioUrl: string
	imageUrl: string | null
	publishedAt: Date | null
	weekNr: Date
	createdAt: Date
	sourceId: string
	userCurationProfileId: string
	userCurationProfile?: {
		id: string
		audioUrl: string | null
		imageUrl: string | null
		createdAt: Date
		name: string
		userId: string
		status: string
		updatedAt: Date
		generatedAt: Date | null
		lastGenerationDate: Date | null
		nextGenerationDate: Date | null
		isActive: boolean
		isBundleSelection: boolean
		selectedBundleId: string | null
		sources: Source[]
		episodes: Episode[]
	} | null
	source?: Source | null
}

// Custom type for CuratedBundle that includes the transformed 'podcasts' array from the API
export interface TransformedCuratedBundle extends CuratedBundle {
	podcasts: CuratedPodcast[]
	episodes?: CuratedBundleEpisode[]
}

// Custom type for UserCurationProfile that includes the 'sources' relation
export interface UserCurationProfileWithSources extends UserCurationProfile {
	sources: Source[]
}

// Fix the type mismatch by properly handling Prisma's string type
export interface UserCurationProfileWithRelations extends UserCurationProfile {
	status: UserCurationProfileStatus // This will be cast at runtime
	sources: Source[]
	selectedBundle?: TransformedCuratedBundle | null
	episodes: Episode[]
}

// Add a type assertion helper
export const asUserCurationProfileStatus = (status: string): UserCurationProfileStatus => {
	return status as UserCurationProfileStatus
}

// Keep only custom types that aren't in Prisma schema
export interface FormState {
	success: boolean
	message: string
}

// TODO: Where and why is this used? Use NextJS Interfaces instead
// export interface ApiResponse<T> {
// 	data?: T
// 	error?: string
// 	message?: string
// }

// Status type helpers for better type safety
export type UserCurationProfileStatus = "Draft" | "Saved" | "Generated" | "Failed"
export type SubscriptionStatus = "trialing" | "active" | "canceled" | "past_due" | "incomplete"
export type NotificationType = "episode_ready" | "weekly_reminder" | "subscription_expiring" | "daily_reminder" | "podcast_ready"
