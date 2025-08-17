import { toast } from "sonner"
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
				set({ isLoading: true, error: null })

				try {
					// Fetch fresh preferences
					const response = await fetch("/api/account/notifications")

					if (!response.ok) {
						throw new Error(`Failed to load preferences: ${response.status}`)
					}

					const preferences = await response.json()

					set({
						preferences,
						isLoading: false,
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
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(newPreferences),
					})

					if (!response.ok) {
						throw new Error(`Failed to update preferences: ${response.status}`)
					}

					const updatedPreferences = await response.json()

					set({
						preferences: updatedPreferences,
						isLoading: false,
					})

					toast.success("Notification preferences updated successfully!")
					return { success: true }
				} catch (error) {
					const message = error instanceof Error ? error.message : "Unknown error"
					set({
						error: message,
						isLoading: false,
					})
					console.error("Failed to update preferences:", error)
					toast.error("Failed to update notification preferences")
					return { error: message }
				}
			},

			toggleEmailNotifications: async () => {
				const currentPreferences = get().preferences
				if (!currentPreferences) {
					return { error: "No preferences loaded" }
				}

				return await get().updatePreferences({
					emailNotifications: !currentPreferences.emailNotifications,
					inAppNotifications: currentPreferences.inAppNotifications,
				})
			},

			toggleInAppNotifications: async () => {
				const currentPreferences = get().preferences
				if (!currentPreferences) {
					return { error: "No preferences loaded" }
				}

				return await get().updatePreferences({
					emailNotifications: currentPreferences.emailNotifications,
					inAppNotifications: !currentPreferences.inAppNotifications,
				})
			},

			// Actions for notifications
			loadNotifications: async () => {
				set({ isLoading: true, error: null })

				try {
					// Fetch fresh notifications
					const response = await fetch("/api/notifications")

					if (!response.ok) {
						throw new Error(`Failed to load notifications: ${response.status}`)
					}

					const notifications = await response.json()

					// Calculate unread count
					const unreadCount = notifications.filter((notification: Notification) => !notification.is_read).length

					set({
						notifications,
						unreadCount,
						isLoading: false,
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
					const response = await fetch(`/api/notifications/${notificationId}/read`, {
						method: "PATCH",
					})

					if (!response.ok) {
						throw new Error(`Failed to mark notification as read: ${response.status}`)
					}

					// Update local state
					const { notifications } = get()
					const updatedNotifications = notifications.map((notification: Notification) => (notification.notification_id === notificationId ? { ...notification, is_read: true } : notification))

					const unreadCount = updatedNotifications.filter((notification: Notification) => !notification.is_read).length

					set({
						notifications: updatedNotifications,
						unreadCount,
					})
				} catch (error) {
					const _message = error instanceof Error ? error.message : "Unknown error"
					console.error("Failed to mark notification as read:", error)
					toast.error("Failed to mark notification as read")
				}
			},

			markAllAsRead: async () => {
				try {
					const response = await fetch("/api/notifications", {
						method: "DELETE",
					})

					if (!response.ok) {
						throw new Error(`Failed to mark all notifications as read: ${response.status}`)
					}

					// Update local state
					const { notifications } = get()
					const updatedNotifications = notifications.map((notification: Notification) => ({
						...notification,
						is_read: true,
					}))

					set({
						notifications: updatedNotifications,
						unreadCount: 0,
					})

					toast.success("All notifications marked as read")
				} catch (error) {
					const _message = error instanceof Error ? error.message : "Unknown error"
					console.error("Failed to mark all notifications as read:", error)
					toast.error("Failed to mark all notifications as read")
				}
			},

			deleteNotification: async (notificationId: string) => {
				try {
					const response = await fetch(`/api/notifications/${notificationId}`, {
						method: "DELETE",
					})

					if (!response.ok) {
						throw new Error(`Failed to delete notification: ${response.status}`)
					}

					// Update local state
					const { notifications } = get()
					const updatedNotifications = notifications.filter((notification: Notification) => notification.notification_id !== notificationId)

					const unreadCount = updatedNotifications.filter((notification: Notification) => !notification.is_read).length

					set({
						notifications: updatedNotifications,
						unreadCount,
					})

					toast.success("Notification deleted")
				} catch (error) {
					const _message = error instanceof Error ? error.message : "Unknown error"
					console.error("Failed to delete notification:", error)
					toast.error("Failed to delete notification")
				}
			},

			clearAll: async () => {
				try {
					const response = await fetch("/api/notifications", {
						method: "DELETE",
					})

					if (!response.ok) {
						throw new Error(`Failed to clear all notifications: ${response.status}`)
					}

					set({
						notifications: [],
						unreadCount: 0,
					})

					toast.success("All notifications cleared")
				} catch (error) {
					const _message = error instanceof Error ? error.message : "Unknown error"
					console.error("Failed to clear all notifications:", error)
					toast.error("Failed to clear all notifications")
				}
			},

			// Utility actions
			setLoading: (loading: boolean) => {
				set({ isLoading: loading })
			},

			setError: (error: string | null) => {
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
