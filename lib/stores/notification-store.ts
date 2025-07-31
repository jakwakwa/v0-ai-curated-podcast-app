import { create } from "zustand"
import { devtools } from "zustand/middleware"

export interface NotificationPreferences {
	emailNotifications: boolean
	inAppNotifications: boolean
	updatedAt: Date
}

export interface Notification {
	notification_id: string
	user_id: string
	type: string
	message: string
	is_read: boolean
	created_at: string
}

export interface NotificationStore {
	// State
	preferences: NotificationPreferences | null
	notifications: Notification[]
	unreadCount: number
	isLoading: boolean
	error: string | null

	// Actions for preferences
	loadPreferences: () => Promise<void>
	updatePreferences: (preferences: { emailNotifications: boolean; inAppNotifications: boolean }) => Promise<{ success: boolean } | { error: string }>
	toggleEmailNotifications: () => Promise<{ success: boolean } | { error: string }>
	toggleInAppNotifications: () => Promise<{ success: boolean } | { error: string }>

	// Actions for notifications
	loadNotifications: () => Promise<void>
	markAsRead: (notificationId: string) => Promise<void>
	markAllAsRead: () => Promise<void>
	deleteNotification: (notificationId: string) => Promise<void>
	clearAll: () => Promise<void>

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

// Mock notifications for testing
const MOCK_NOTIFICATIONS: Notification[] = [
	{
		notification_id: "1",
		user_id: "user1",
		type: "episode_ready",
		message: "Your weekly curated episode is ready!",
		is_read: false,
		created_at: new Date().toISOString(),
	},
	{
		notification_id: "2",
		user_id: "user1",
		type: "weekly_reminder",
		message: "Don't forget to check your new episodes this week",
		is_read: true,
		created_at: new Date(Date.now() - 86400000).toISOString(),
	},
]

const initialState = {
	preferences: null,
	notifications: [],
	unreadCount: 0,
	isLoading: false,
	error: null,
}

export const useNotificationStore = create<NotificationStore>()(
	devtools(
		(set, get) => ({
			...initialState,

			// Actions for preferences
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

			// Actions for notifications
			loadNotifications: async () => {
				set({ isLoading: true, error: null }, false, "loadNotifications:start")

				try {
					// For testing purposes, use mock data instead of API call
					// In production, this would be: const response = await fetch("/api/notifications")

					// Simulate API delay
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Use mock data for testing
					const notifications = MOCK_NOTIFICATIONS
					const unreadCount = notifications.filter(n => !n.is_read).length

					set({ notifications, unreadCount, isLoading: false }, false, "loadNotifications:success")
				} catch (error) {
					set(
						{
							error: error instanceof Error ? error.message : "Unknown error",
							isLoading: false,
						},
						false,
						"loadNotifications:error"
					)
				}
			},

			markAsRead: async (notificationId: string) => {
				set({ isLoading: true, error: null }, false, "markAsRead:start")

				try {
					// For testing purposes, simulate API call
					await new Promise(resolve => setTimeout(resolve, 500))

					// Mock successful update
					const { notifications } = get()
					const updatedNotifications = notifications.map(n => (n.notification_id === notificationId ? { ...n, is_read: true } : n))
					const unreadCount = updatedNotifications.filter(n => !n.is_read).length

					set({ notifications: updatedNotifications, unreadCount, isLoading: false }, false, "markAsRead:success")
				} catch (error) {
					set(
						{
							error: error instanceof Error ? error.message : "Unknown error",
							isLoading: false,
						},
						false,
						"markAsRead:error"
					)
				}
			},

			markAllAsRead: async () => {
				set({ isLoading: true, error: null }, false, "markAllAsRead:start")

				try {
					// For testing purposes, simulate API call
					await new Promise(resolve => setTimeout(resolve, 500))

					// Mock successful update
					const { notifications } = get()
					const updatedNotifications = notifications.map(n => ({ ...n, is_read: true }))

					set({ notifications: updatedNotifications, unreadCount: 0, isLoading: false }, false, "markAllAsRead:success")
				} catch (error) {
					set(
						{
							error: error instanceof Error ? error.message : "Unknown error",
							isLoading: false,
						},
						false,
						"markAllAsRead:error"
					)
				}
			},

			deleteNotification: async (notificationId: string) => {
				set({ isLoading: true, error: null }, false, "deleteNotification:start")

				try {
					// For testing purposes, simulate API call
					await new Promise(resolve => setTimeout(resolve, 500))

					// Mock successful update
					const { notifications } = get()
					const updatedNotifications = notifications.filter(n => n.notification_id !== notificationId)
					const unreadCount = updatedNotifications.filter(n => !n.is_read).length

					set({ notifications: updatedNotifications, unreadCount, isLoading: false }, false, "deleteNotification:success")
				} catch (error) {
					set(
						{
							error: error instanceof Error ? error.message : "Unknown error",
							isLoading: false,
						},
						false,
						"deleteNotification:error"
					)
				}
			},

			clearAll: async () => {
				set({ isLoading: true, error: null }, false, "clearAll:start")

				try {
					// For testing purposes, simulate API call
					await new Promise(resolve => setTimeout(resolve, 500))

					// Mock successful update
					set({ notifications: [], unreadCount: 0, isLoading: false }, false, "clearAll:success")
				} catch (error) {
					set(
						{
							error: error instanceof Error ? error.message : "Unknown error",
							isLoading: false,
						},
						false,
						"clearAll:error"
					)
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
			name: "notification-store",
			enabled: process.env.NODE_ENV === "development",
		}
	)
)
