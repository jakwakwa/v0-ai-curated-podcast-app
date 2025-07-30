import { create } from "zustand"
import { devtools } from "zustand/middleware"

export interface NotificationPreferences {
	emailNotifications: boolean
	inAppNotifications: boolean
	updatedAt: Date
}

export interface NotificationStore {
	// State
	preferences: NotificationPreferences | null
	isLoading: boolean
	error: string | null

	// Actions
	loadPreferences: () => Promise<void>
	updatePreferences: (preferences: { emailNotifications: boolean; inAppNotifications: boolean }) => Promise<{ success: boolean } | { error: string }>
	toggleEmailNotifications: () => Promise<{ success: boolean } | { error: string }>
	toggleInAppNotifications: () => Promise<{ success: boolean } | { error: string }>

	// Utility actions
	setLoading: (loading: boolean) => void
	setError: (error: string | null) => void
	reset: () => void
}

// Mock notification preferences for testing
const MOCK_PREFERENCES: NotificationPreferences = {
	emailNotifications: true,
	inAppNotifications: true,
	updatedAt: new Date("2024-01-15"),
}

const initialState = {
	preferences: null,
	isLoading: false,
	error: null,
}

export const useNotificationStore = create<NotificationStore>()(
	devtools(
		(set, get) => ({
			...initialState,

			// Actions
			loadPreferences: async () => {
				set({ isLoading: true, error: null }, false, "loadPreferences:start")

				try {
					// For testing purposes, use mock data instead of API call
					// In production, this would be: const response = await fetch("/api/account/notifications")

					// Simulate API delay
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Use mock data for testing
					const preferences = MOCK_PREFERENCES
					set({ preferences, isLoading: false }, false, "loadPreferences:success")
				} catch (error) {
					set(
						{
							error: error instanceof Error ? error.message : "Unknown error",
							isLoading: false,
						},
						false,
						"loadPreferences:error"
					)
				}
			},

			updatePreferences: async (newPreferences: { emailNotifications: boolean; inAppNotifications: boolean }) => {
				set({ isLoading: true, error: null }, false, "updatePreferences:start")

				try {
					// For testing purposes, simulate API call
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Mock successful update
					const updatedPreferences = {
						...MOCK_PREFERENCES,
						...newPreferences,
						updatedAt: new Date(),
					}

					set({ preferences: updatedPreferences, isLoading: false }, false, "updatePreferences:success")
					return { success: true }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : "Unknown error"
					set(
						{
							error: errorMessage,
							isLoading: false,
						},
						false,
						"updatePreferences:error"
					)
					return { error: errorMessage }
				}
			},

			toggleEmailNotifications: async () => {
				const { preferences } = get()
				if (!preferences) {
					return { error: "No preferences loaded" }
				}

				return get().updatePreferences({
					emailNotifications: !preferences.emailNotifications,
					inAppNotifications: preferences.inAppNotifications,
				})
			},

			toggleInAppNotifications: async () => {
				const { preferences } = get()
				if (!preferences) {
					return { error: "No preferences loaded" }
				}

				return get().updatePreferences({
					emailNotifications: preferences.emailNotifications,
					inAppNotifications: !preferences.inAppNotifications,
				})
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
			name: "notification-store",
			enabled: process.env.NODE_ENV === "development",
		}
	)
)
