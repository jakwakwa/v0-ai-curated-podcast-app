// Temporary fallback types for Prisma client generation issues
// This file provides essential enums and types when Prisma client can't be properly generated

export enum PlanGate {
  NONE = "NONE",
  CASUAL_LISTENER = "CASUAL_LISTENER", 
  CURATE_CONTROL = "CURATE_CONTROL",
  FREE_SLICE = "FREE_SLICE"
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN"
}

export enum UserEpisodeStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING", 
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}

export enum FeedbackRating {
  THUMBS_UP = "THUMBS_UP",
  THUMBS_DOWN = "THUMBS_DOWN",
  NEUTRAL = "NEUTRAL"
}

// Basic type interfaces based on the schema
export interface User {
  user_id: string
  name?: string | null
  email: string
  password: string
  image?: string | null
  email_verified?: Date | null
  is_admin: boolean
  role: UserRole
  email_notifications: boolean
  in_app_notifications: boolean
  created_at: Date
  updated_at: Date
  paddle_customer_id?: string | null
}

export interface Episode {
  episode_id: string
  podcast_id: string
  profile_id?: string | null
  bundle_id?: string | null
  title: string
  description?: string | null
  audio_url: string
  image_url?: string | null
  duration_seconds?: number | null
  published_at?: Date | null
  week_nr?: Date | null
  created_at: Date
}

export interface UserEpisode {
  episode_id: string
  user_id: string
  episode_title: string
  youtube_url: string
  transcript?: string | null
  summary?: string | null
  gcs_audio_url?: string | null
  duration_seconds?: number | null
  status: UserEpisodeStatus
  created_at: Date
  updated_at: Date
}

export interface Podcast {
  podcast_id: string
  name: string
  description?: string | null
  url: string
  image_url?: string | null
  category?: string | null
  is_active: boolean
  owner_user_id?: string | null
  created_at: Date
}

export interface Bundle {
  bundle_id: string
  name: string
  description?: string | null
  image_url?: string | null
  is_static: boolean
  is_active: boolean
  owner_user_id?: string | null
  min_plan: PlanGate
  created_at: Date
}

export interface UserCurationProfile {
  profile_id: string
  user_id: string
  name: string
  status: string
  audio_url?: string | null
  image_url?: string | null
  created_at: Date
  updated_at: Date
  generated_at?: Date | null
  last_generation_date?: Date | null
  next_generation_date?: Date | null
  is_active: boolean
  is_bundle_selection: boolean
  selected_bundle_id?: string | null
}