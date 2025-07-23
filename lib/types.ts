// Import Prisma's generated types
import type { Bundle, BundlePodcast, Episode, EpisodeFeedback, FeedbackRating, Notification, Podcast, ProfilePodcast, Subscription, User, UserCurationProfile } from "@prisma/client"

// Re-export unified types for convenience
export type {
	User,
	UserCurationProfile,
	Podcast, // Unified: replaces CuratedPodcast + Source
	Bundle, // Unified: replaces CuratedBundle
	Episode, // Unified: replaces Episode + CuratedBundleEpisode
	BundlePodcast, // Renamed from CuratedBundlePodcast
	ProfilePodcast, // New: junction for user's custom podcast selections
	Notification,
	Subscription,
	EpisodeFeedback,
	FeedbackRating,
}

// Legacy type aliases for backward compatibility during transition
export type CuratedPodcast = Podcast
export type CuratedBundle = Bundle
export type Source = Podcast
export type CuratedBundleEpisode = Episode
export type CuratedBundlePodcast = BundlePodcast

// Custom type for Bundle that includes the transformed 'podcasts' array from the API
export interface TransformedCuratedBundle extends Bundle {
	podcasts: Podcast[]
	episodes?: Episode[]
}

// Custom type for UserCurationProfile that includes relations
export interface UserCurationProfileWithRelations extends UserCurationProfile {
	status: UserCurationProfileStatus // This will be cast at runtime
	podcastSelections?: (ProfilePodcast & { podcast: Podcast })[]
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

// Status type helpers for better type safety
export type UserCurationProfileStatus = "Draft" | "Saved" | "Generated" | "Failed"
export type SubscriptionStatus = "trialing" | "active" | "canceled" | "past_due" | "incomplete"
export type NotificationType = "episode_ready" | "weekly_reminder" | "subscription_expiring" | "daily_reminder" | "podcast_ready"
