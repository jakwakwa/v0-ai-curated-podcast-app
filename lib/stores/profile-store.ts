import { create } from "zustand"
import { devtools } from "zustand/middleware"

export interface UserProfile {
	name: string
	email: string
	avatar?: string | null
	createdAt: Date
	updatedAt: Date
}

export interface ProfileStore {
	// State
	profile: UserProfile | null
	isLoading: boolean
	error: string | null

	// Actions
	loadProfile: () => Promise<void>
	updateProfile: (data: { name: string; email: string }) => Promise<{ success: boolean } | { error: string }>
	uploadAvatar: (file: File) => Promise<{ success: boolean; avatarUrl?: string } | { error: string }>
	removeAvatar: () => Promise<{ success: boolean } | { error: string }>

	// Utility actions
	setLoading: (loading: boolean) => void
	setError: (error: string | null) => void
	reset: () => void
}

// Mock profile data for testing
const MOCK_PROFILE: UserProfile = {
	name: "John Doe",
	email: "john.doe@example.com",
	avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john&size=200",
	createdAt: new Date("2023-12-01"),
	updatedAt: new Date("2024-01-15"),
}

const initialState = {
	profile: null,
	isLoading: false,
	error: null,
}

export const useProfileStore = create<ProfileStore>()(
	devtools(
		(set, get) => ({
			...initialState,

			// Actions
			loadProfile: async () => {
				set({ isLoading: true, error: null }, false, "loadProfile:start")

				try {
					// For testing purposes, use mock data instead of API call
					// In production, this would be: const response = await fetch("/api/account/profile")

					// Simulate API delay
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Use mock data for testing
					const profile = MOCK_PROFILE
					set({ profile, isLoading: false }, false, "loadProfile:success")
				} catch (error) {
					set(
						{
							error: error instanceof Error ? error.message : "Unknown error",
							isLoading: false,
						},
						false,
						"loadProfile:error"
					)
				}
			},

			updateProfile: async (data: { name: string; email: string }) => {
				set({ isLoading: true, error: null }, false, "updateProfile:start")

				try {
					// For testing purposes, simulate API call
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Mock successful update
					const updatedProfile = {
						...MOCK_PROFILE,
						name: data.name,
						email: data.email,
						updatedAt: new Date(),
					}

					set({ profile: updatedProfile, isLoading: false }, false, "updateProfile:success")
					return { success: true }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : "Unknown error"
					set(
						{
							error: errorMessage,
							isLoading: false,
						},
						false,
						"updateProfile:error"
					)
					return { error: errorMessage }
				}
			},

			uploadAvatar: async (file: File) => {
				set({ isLoading: true, error: null }, false, "uploadAvatar:start")

				try {
					// For testing purposes, simulate API call
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Mock successful upload
					const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}&size=200`

					// Update profile with new avatar
					const { profile } = get()
					if (profile) {
						set(
							{
								profile: { ...profile, avatar: avatarUrl },
								isLoading: false,
							},
							false,
							"uploadAvatar:success"
						)
					}

					return { success: true, avatarUrl }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : "Unknown error"
					set(
						{
							error: errorMessage,
							isLoading: false,
						},
						false,
						"uploadAvatar:error"
					)
					return { error: errorMessage }
				}
			},

			removeAvatar: async () => {
				set({ isLoading: true, error: null }, false, "removeAvatar:start")

				try {
					// For testing purposes, simulate API call
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Update profile to remove avatar
					const { profile } = get()
					if (profile) {
						set(
							{
								profile: { ...profile, avatar: null },
								isLoading: false,
							},
							false,
							"removeAvatar:success"
						)
					}

					return { success: true }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : "Unknown error"
					set(
						{
							error: errorMessage,
							isLoading: false,
						},
						false,
						"removeAvatar:error"
					)
					return { error: errorMessage }
				}
			},

			// Utility actions
			setLoading: loading => {
				set({ isLoading: loading }, false, "setLoading")
			},

			setError: error => {
				set({ error }, false, "setError")
			},

			reset: () => {
				set(initialState, false, "reset")
			},
		}),
		{
			name: "profile-store",
			enabled: process.env.NODE_ENV === "development",
		}
	)
)
