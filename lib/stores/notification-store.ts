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
	isFromCache: boolean
	lastFetched: number | null
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

	// Cache management
	refreshNotifications: () => Promise<void>
	invalidateNotificationsCache: () => void
	invalidatePreferencesCache: () => void

	// Utility actions
	setLoading: (loading: boolean) => void
	setError: (error: string | null) => void
	reset: () => void
}

// Cache durations
const NOTIFICATIONS_CACHE_DURATION = 15 * 60 * 1000 // 15 minutes in milliseconds
const PREFERENCES_CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

// Helper functions for localStorage caching
const getCachedData = (key: string, duration: number): unknown | null => {
	try {
		const cached = localStorage.getItem(key)
		if (cached) {
			const { data, timestamp } = JSON.parse(cached)
			if (Date.now() - timestamp < duration) {
				return data
			}
		}
	} catch (error) {
		console.warn("Failed to read cache:", error)
	}
	return null
}

const setCachedData = (key: string, data: unknown): void => {
	try {
		const cacheData = {
			data,
			timestamp: Date.now(),
		}
		localStorage.setItem(key, JSON.stringify(cacheData))
	} catch (error) {
		console.warn("Failed to write cache:", error)
	}
}

const initialState = {
	preferences: null,
	notifications: [],
	unreadCount: 0,
	isLoading: false,
	isFromCache: false,
	lastFetched: null,
	error: null,
}

export const useNotificationStore = create<NotificationStore>()(
	devtools(
		(set, get) => ({
			...initialState,

			// Actions for preferences
			loadPreferences: async () => {
				set({ isLoading: true, error: null })

				try {
					// Try to get cached preferences first
					const cachedPreferences = getCachedData("preferences_cache", PREFERENCES_CACHE_DURATION) as NotificationPreferences | null

					if (cachedPreferences) {
						set({
							preferences: cachedPreferences,
							isFromCache: true,
							isLoading: false,
						})
						return
					}

					// Fetch fresh preferences
					const response = await fetch("/api/account/notifications", {
						headers: { "Cache-Control": "max-age=3600" }, // 1 hour cache
					})

					if (!response.ok) {
						throw new Error(`Failed to load preferences: ${response.status}`)
					}

					const preferences = await response.json()
					setCachedData("preferences_cache", preferences)

					set({
						preferences,
						isFromCache: false,
						isLoading: false,
						lastFetched: Date.now(),
					})
				} catch (error) {
					const message = error instanceof Error ? error.message : "Unknown error"
					set({
						error: message,
						isLoading: false,
					})
					console.error("Failed to load preferences:", error)
				}
			},

			updatePreferences: async (newPreferences: { emailNotifications: boolean; inAppNotifications: boolean }) => {
				set({ isLoading: true, error: null })

				try {
					// Call API to update preferences
					const response = await fetch("/api/account/notifications", {
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(newPreferences),
					})

					if (!response.ok) {
						throw new Error(`Failed to update preferences: ${response.status}`)
					}

					const updatedPreferences = await response.json()

					// Update cache with new data
					setCachedData("preferences_cache", updatedPreferences)

					set({
						preferences: updatedPreferences,
						isLoading: false,
						lastFetched: Date.now(),
					})
					return { success: true }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : "Unknown error"
					set({
						error: errorMessage,
						isLoading: false,
					})
					console.error("Failed to update preferences:", error)
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
				set({ isLoading: true, error: null })

				try {
					// Try to get cached notifications first
					const cachedNotifications = getCachedData("notifications_cache", NOTIFICATIONS_CACHE_DURATION) as Notification[] | null

					if (cachedNotifications && Array.isArray(cachedNotifications)) {
						const unreadCount = cachedNotifications.filter(n => !n.is_read).length
						set({
							notifications: cachedNotifications,
							unreadCount,
							isFromCache: true,
							isLoading: false,
						})
						return
					}

					// Fetch fresh notifications
					const response = await fetch("/api/notifications", {
						headers: { "Cache-Control": "max-age=900" }, // 15 minutes cache
					})

					if (!response.ok) {
						throw new Error(`Failed to load notifications: ${response.status}`)
					}

					const notifications = await response.json()
					const unreadCount = notifications.filter((n: Notification) => !n.is_read).length

					setCachedData("notifications_cache", notifications)

					set({
						notifications,
						unreadCount,
						isFromCache: false,
						isLoading: false,
						lastFetched: Date.now(),
					})
				} catch (error) {
					const message = error instanceof Error ? error.message : "Unknown error"
					set({
						error: message,
						isLoading: false,
					})
					console.error("Failed to load notifications:", error)
				}
			},

			markAsRead: async (notificationId: string) => {
				try {
					// Call API to mark as read
					const response = await fetch(`/api/notifications/${notificationId}/read`, {
						method: "POST",
					})

					if (!response.ok) {
						throw new Error(`Failed to mark notification as read: ${response.status}`)
					}

					// Update local state optimistically
					const { notifications } = get()
					const updatedNotifications = notifications.map(n => (n.notification_id === notificationId ? { ...n, is_read: true } : n))
					const unreadCount = updatedNotifications.filter(n => !n.is_read).length

					// Update cache with new data
					setCachedData("notifications_cache", updatedNotifications)

					set({
						notifications: updatedNotifications,
						unreadCount,
						lastFetched: Date.now(),
					})
				} catch (error) {
					const message = error instanceof Error ? error.message : "Unknown error"
					set({ error: message })
					console.error("Failed to mark notification as read:", error)
					throw error
				}
			},

			markAllAsRead: async () => {
				try {
					// Call API to mark all as read (endpoint needs to be created)
					const response = await fetch("/api/notifications/mark-all-read", {
						method: "POST",
					})

					if (!response.ok) {
						throw new Error(`Failed to mark all as read: ${response.status}`)
					}

					// Update local state optimistically
					const { notifications } = get()
					const updatedNotifications = notifications.map(n => ({ ...n, is_read: true }))

					// Update cache with new data
					setCachedData("notifications_cache", updatedNotifications)

					set({
						notifications: updatedNotifications,
						unreadCount: 0,
						lastFetched: Date.now(),
					})
				} catch (error) {
					const message = error instanceof Error ? error.message : "Unknown error"
					set({ error: message })
					console.error("Failed to mark all as read:", error)
					throw error
				}
			},

			deleteNotification: async (notificationId: string) => {
				try {
					// Call API to delete notification
					const response = await fetch(`/api/notifications/${notificationId}`, {
						method: "DELETE",
					})

					if (!response.ok) {
						throw new Error(`Failed to delete notification: ${response.status}`)
					}

					// Update local state optimistically
					const { notifications } = get()
					const updatedNotifications = notifications.filter(n => n.notification_id !== notificationId)
					const unreadCount = updatedNotifications.filter(n => !n.is_read).length

					// Update cache with new data
					setCachedData("notifications_cache", updatedNotifications)

					set({
						notifications: updatedNotifications,
						unreadCount,
						lastFetched: Date.now(),
					})
				} catch (error) {
					const message = error instanceof Error ? error.message : "Unknown error"
					set({ error: message })
					console.error("Failed to delete notification:", error)
					throw error
				}
			},

			clearAll: async () => {
				set({ isLoading: true, error: null })

				try {
					// Call API to clear all notifications
					const response = await fetch("/api/notifications", {
						method: "DELETE",
					})

					if (!response.ok) {
						throw new Error(`Failed to clear notifications: ${response.status}`)
					}

					// Clear cache and local state
					localStorage.removeItem("notifications_cache")

					set({
						notifications: [],
						unreadCount: 0,
						isLoading: false,
						lastFetched: Date.now(),
					})
				} catch (error) {
					const message = error instanceof Error ? error.message : "Unknown error"
					set({
						error: message,
						isLoading: false,
					})
					console.error("Failed to clear notifications:", error)
					throw error
				}
			},

			// Cache management
			refreshNotifications: async () => {
				// Invalidate cache and force fresh fetch
				localStorage.removeItem("notifications_cache")
				set({ isFromCache: false })
				await get().loadNotifications()
			},

			invalidateNotificationsCache: () => {
				try {
					localStorage.removeItem("notifications_cache")
				} catch (error) {
					console.warn("Failed to invalidate notifications cache:", error)
				}
			},

			invalidatePreferencesCache: () => {
				try {
					localStorage.removeItem("preferences_cache")
				} catch (error) {
					console.warn("Failed to invalidate preferences cache:", error)
				}
			},

			// Utility actions
			setLoading: loading => {
				set({ isLoading: loading })
			},

			setError: error => {
				set({ error })
			},

			reset: () => {
				set(initialState)
			},
		}),
		{
			name: "notification-store",
			enabled: process.env.NODE_ENV === "development",
		}
	)
)
