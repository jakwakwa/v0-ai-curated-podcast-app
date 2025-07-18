import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface Notification {
  id: string
  userId: string
  type: string // "episode_ready", "weekly_reminder"
  message: string
  isRead: boolean
  createdAt: Date
}

export interface NotificationStore {
  // State
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null

  // Actions
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  loadNotifications: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  clearAll: () => Promise<void>

  // Utility actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateUnreadCount: () => void
}

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
}

export const useNotificationStore = create<NotificationStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Actions
      setNotifications: (notifications) => {
        const unreadCount = notifications.filter(n => !n.isRead).length
        set({ notifications, unreadCount }, false, 'setNotifications')
      },

      addNotification: (notification) => {
        const { notifications } = get()
        const newNotifications = [notification, ...notifications]
        const unreadCount = newNotifications.filter(n => !n.isRead).length
        
        set({ 
          notifications: newNotifications,
          unreadCount 
        }, false, 'addNotification')
      },

      markAsRead: async (notificationId) => {
        set({ isLoading: true, error: null }, false, 'markAsRead:start')
        
        try {
          const response = await fetch(`/api/notifications/${notificationId}/read`, {
            method: 'PATCH',
          })

          if (!response.ok) {
            throw new Error('Failed to mark notification as read')
          }

          const { notifications } = get()
          const updatedNotifications = notifications.map(n =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
          const unreadCount = updatedNotifications.filter(n => !n.isRead).length

          set({ 
            notifications: updatedNotifications,
            unreadCount,
            isLoading: false 
          }, false, 'markAsRead:success')
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false 
          }, false, 'markAsRead:error')
          throw error
        }
      },

      markAllAsRead: async () => {
        set({ isLoading: true, error: null }, false, 'markAllAsRead:start')
        
        try {
          const response = await fetch('/api/notifications/read-all', {
            method: 'PATCH',
          })

          if (!response.ok) {
            throw new Error('Failed to mark all notifications as read')
          }

          const { notifications } = get()
          const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }))

          set({ 
            notifications: updatedNotifications,
            unreadCount: 0,
            isLoading: false 
          }, false, 'markAllAsRead:success')
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false 
          }, false, 'markAllAsRead:error')
          throw error
        }
      },

      loadNotifications: async () => {
        set({ isLoading: true, error: null }, false, 'loadNotifications:start')
        
        try {
          const response = await fetch('/api/notifications')

          if (!response.ok) {
            throw new Error('Failed to load notifications')
          }

          const notifications = await response.json()
          const unreadCount = notifications.filter((n: Notification) => !n.isRead).length

          set({ 
            notifications,
            unreadCount,
            isLoading: false 
          }, false, 'loadNotifications:success')
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false 
          }, false, 'loadNotifications:error')
          throw error
        }
      },

      deleteNotification: async (notificationId) => {
        set({ isLoading: true, error: null }, false, 'deleteNotification:start')
        
        try {
          const response = await fetch(`/api/notifications/${notificationId}`, {
            method: 'DELETE',
          })

          if (!response.ok) {
            throw new Error('Failed to delete notification')
          }

          const { notifications } = get()
          const updatedNotifications = notifications.filter(n => n.id !== notificationId)
          const unreadCount = updatedNotifications.filter(n => !n.isRead).length

          set({ 
            notifications: updatedNotifications,
            unreadCount,
            isLoading: false 
          }, false, 'deleteNotification:success')
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false 
          }, false, 'deleteNotification:error')
          throw error
        }
      },

      clearAll: async () => {
        set({ isLoading: true, error: null }, false, 'clearAll:start')
        
        try {
          const response = await fetch('/api/notifications', {
            method: 'DELETE',
          })

          if (!response.ok) {
            throw new Error('Failed to clear all notifications')
          }

          set({ 
            notifications: [],
            unreadCount: 0,
            isLoading: false 
          }, false, 'clearAll:success')
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false 
          }, false, 'clearAll:error')
          throw error
        }
      },

      // Utility actions
      setLoading: (loading) => {
        set({ isLoading: loading }, false, 'setLoading')
      },

      setError: (error) => {
        set({ error }, false, 'setError')
      },

      updateUnreadCount: () => {
        const { notifications } = get()
        const unreadCount = notifications.filter(n => !n.isRead).length
        set({ unreadCount }, false, 'updateUnreadCount')
      },
    }),
    { name: 'notification-store' }
  )
)