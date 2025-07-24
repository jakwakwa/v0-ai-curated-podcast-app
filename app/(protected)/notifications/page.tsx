"use client"

import { Bell, Calendar, Check, Clock, Play, Trash2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { AppSpinner } from "@/components/ui/app-spinner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import styles from "./page.module.css"

interface Notification {
	id: string
	userId: string
	type: "episode_ready" | "weekly_reminder" | "subscription_expiring" | "trial_ending"
	message: string
	isRead: boolean
	createdAt: Date
}

export default function NotificationsPage() {
	const [notifications, setNotifications] = useState<Notification[]>([])
	const [isLoading, setIsLoading] = useState(true)

	const fetchNotifications = useCallback(async () => {
		try {
			const response = await fetch("/api/notifications")
			if (!response.ok) {
				throw new Error("Failed to fetch notifications")
			}
			const data = await response.json()
			setNotifications(data)
		} catch (error) {
			console.error("Error fetching notifications:", error)
			toast.error("Failed to load notifications")
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchNotifications()
	}, [fetchNotifications])

	const handleMarkAsRead = async (notificationId: string) => {
		try {
			const response = await fetch(`/api/notifications/${notificationId}/read`, {
				method: "PATCH",
			})
			if (!response.ok) {
				throw new Error("Failed to mark notification as read")
			}
			setNotifications(prev => prev.map(notif => (notif.notification_id === notificationId ? { ...notif, is_read: true } : notif)))
			toast.success("Notification marked as read")
		} catch (error) {
			console.error("Error marking notification as read:", error)
			toast.error("Failed to mark notification as read")
		}
	}

	const handleMarkAllAsRead = async () => {
		try {
			const unreadNotifications = notifications.filter(n => !n.is_read)
			await Promise.all(
				unreadNotifications.map(notif =>
					fetch(`/api/notifications/${notif.notification_id}/read`, {
						method: "PATCH",
					})
				)
			)
			setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })))
			toast.success("All notifications marked as read")
		} catch (error) {
			console.error("Error marking all notifications as read:", error)
			toast.error("Failed to mark all notifications as read")
		}
	}

	const handleDeleteNotification = async (notificationId: string) => {
		try {
			const response = await fetch(`/api/notifications/${notificationId}`, {
				method: "DELETE",
			})
			if (!response.ok) {
				throw new Error("Failed to delete notification")
			}
			setNotifications(prev => prev.filter(notif => notif.notification_id !== notificationId))
			toast.success("Notification deleted")
		} catch (error) {
			console.error("Error deleting notification:", error)
			toast.error("Failed to delete notification")
		}
	}

	const handleClearAll = async () => {
		try {
			await Promise.all(
				notifications.map(notif =>
					fetch(`/api/notifications/${notif.notification_id}`, {
						method: "DELETE",
					})
				)
			)
			setNotifications([])
			toast.success("All notifications cleared")
		} catch (error) {
			console.error("Error clearing all notifications:", error)
			toast.error("Failed to clear all notifications")
		}
	}

	const getNotificationIcon = (type: Notification["type"]) => {
		switch (type) {
			case "episode_ready":
				return <Play className={styles.notificationIcon} />
			case "weekly_reminder":
				return <Calendar className={styles.notificationIcon} />
			case "subscription_expiring":
				return <Clock className={styles.notificationIcon} />
			case "trial_ending":
				return <Bell className={styles.notificationIcon} />
			default:
				return <Bell className={styles.notificationIcon} />
		}
	}

	const getNotificationBadge = (type: Notification["type"]) => {
		switch (type) {
			case "episode_ready":
				return <Badge className={styles.episodeBadge}>Episode Ready</Badge>
			case "weekly_reminder":
				return <Badge className={styles.reminderBadge}>Reminder</Badge>
			case "subscription_expiring":
				return <Badge className={styles.subscriptionBadge}>Subscription</Badge>
			case "trial_ending":
				return <Badge className={styles.trialBadge}>Trial</Badge>
			default:
				return <Badge variant="outline">Notification</Badge>
		}
	}

	const formatTimeAgo = (date: Date) => {
		const now = new Date()
		const diffInMs = now.getTime() - date.getTime()
		const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
		const diffInDays = Math.floor(diffInHours / 24)

		if (diffInDays > 0) {
			return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
		} else if (diffInHours > 0) {
			return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
		} else {
			return "Just now"
		}
	}

	const unreadCount = notifications.filter(n => !n.is_read).length

	if (isLoading) {
		return (
			<div className={styles.loadingContainer}>
				<div className={styles.loadingWrapper}>
					<AppSpinner size="lg" label="Loading notifications..." />
				</div>
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.headerContent}>
					<div className={styles.titleSection}>
						<Bell className={styles.headerIcon} />
						<h1 className={styles.title}>Notifications</h1>
						{unreadCount > 0 && <Badge className={styles.unreadBadge}>{unreadCount}</Badge>}
					</div>
					<div className={styles.headerActions}>
						{unreadCount > 0 && (
							<Button variant="outline" size="sm" onClick={handleMarkAllAsRead} className={styles.markAllButton}>
								<Check size={16} />
								Mark all as read
							</Button>
						)}
						{notifications.length > 0 && (
							<Button variant="outline" size="sm" onClick={handleClearAll} className={styles.clearAllButton}>
								<Trash2 size={16} />
								Clear all
							</Button>
						)}
					</div>
				</div>
			</div>

			<div className={styles.content}>
				{notifications.length === 0 ? (
					<Card className={styles.emptyCard}>
						<CardContent className={styles.emptyContent}>
							<Bell className={styles.emptyIcon} />
							<h3 className={styles.emptyTitle}>No notifications</h3>
							<p className={styles.emptyDescription}>You're all caught up! New notifications will appear here when they arrive.</p>
						</CardContent>
					</Card>
				) : (
					<div className={styles.notificationsList}>
						{notifications.map(notification => (
							<Card key={notification.notification_id} className={`${styles.notificationCard} ${!notification.is_read ? styles.unreadCard : ""}`}>
								<CardHeader className={styles.cardHeader}>
									<div className={styles.notificationHeader}>
										<div className={styles.notificationIconWrapper}>{getNotificationIcon(notification.type)}</div>
										<div className={styles.notificationInfo}>
											<div className={styles.notificationMeta}>
												{getNotificationBadge(notification.type)}
												<span className={styles.timestamp}>{formatTimeAgo(new Date(notification.created_at))}</span>
											</div>
											<CardTitle className={styles.notificationTitle}>{notification.message}</CardTitle>
										</div>
									</div>
									<div className={styles.notificationActions}>
										{!notification.is_read && (
											<Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.notification_id)} className={styles.markReadButton}>
												<Check size={16} />
											</Button>
										)}
										<Button variant="ghost" size="sm" onClick={() => handleDeleteNotification(notification.notification_id)} className={styles.deleteButton}>
											<Trash2 size={16} />
										</Button>
									</div>
								</CardHeader>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
