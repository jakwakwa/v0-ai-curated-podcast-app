// Import Prisma's generated types
import type { 
  User,
  UserCurationProfile, 
  Source,
  Episode,
  CuratedPodcast,
  CuratedBundle,
  CuratedBundlePodcast,
  Notification,
  Subscription,
  EpisodeFeedback,
  FeedbackRating
} from '@prisma/client'

// Re-export for convenience
export type {
  User,
  UserCurationProfile,
  Source,
  Episode,
  CuratedPodcast,
  CuratedBundle,
  CuratedBundlePodcast,
  Notification,
  Subscription,
  EpisodeFeedback,
  FeedbackRating
}

// Custom type for CuratedBundle that includes the transformed 'podcasts' array from the API
export interface TransformedCuratedBundle extends CuratedBundle {
  podcasts: CuratedPodcast[];
}

// Custom type for UserCurationProfile that includes the 'sources' relation
export interface UserCurationProfileWithSources extends UserCurationProfile {
  sources: Source[];
}

// Keep only custom types that aren't in Prisma schema
export interface FormState {
  success: boolean
  message: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// Status type helpers for better type safety
export type UserCurationProfileStatus = "Draft" | "Saved" | "Generated" | "Failed"
export type SubscriptionStatus = "trialing" | "active" | "canceled" | "past_due" | "incomplete"
export type NotificationType = "episode_ready" | "weekly_reminder"
