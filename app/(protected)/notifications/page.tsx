"use client"

import { Bell, Calendar, Check, Clock, Play, Trash2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
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

	// Dummy notifications data
	const dummyNotifications = useCallback(
		(): Notification[] => [
			{
				id: "notif1",
				userId: "user_123",
				type: "episode_ready",
				message: "Your weekly podcast episode 'The Future of AI: A Deep Dive' is ready to listen!",
				isRead: false,
				createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
			},
			{
				id: "notif2",
				userId: "user_123",
				type: "weekly_reminder",
				message: "Don't forget! Your next podcast episode will be generated this Friday at midnight.",
				isRead: false,
				createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
			},
			{
				id: "notif3",
				userId: "user_123",
				type: "subscription_expiring",
				message: "Your premium subscription will expire in 3 days. Renew now to continue enjoying unlimited profiles.",
				isRead: true,
				createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
			},
			{
				id: "notif4",
				userId: "user_123",
				type: "trial_ending",
				message: "Your free trial ends tomorrow. Upgrade to premium to keep creating unlimited curation profiles.",
				isRead: true,
				createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
			},
			{
				id: "notif5",
				userId: "user_123",
				type: "episode_ready",
				message: "Your weekly podcast episode 'Space Exploration: Beyond Our Solar System' is ready to listen!",
				isRead: true,
				createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
			},
		],
		[]
	)

	useEffect(() => {
		// Simulate loading
		const timer = setTimeout(() => {
			setNotifications(dummyNotifications())
			setIsLoading(false)
		}, 500)

		return () => clearTimeout(timer)
	}, [dummyNotifications])

	const handleMarkAsRead = (notificationId: string) => {
		setNotifications(prev => prev.map(notif => (notif.id === notificationId ? { ...notif, isRead: true } : notif)))
		toast.success("Notification marked as read")
	}

	const handleMarkAllAsRead = () => {
		setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })))
		toast.success("All notifications marked as read")
	}

	const handleDeleteNotification = (notificationId: string) => {
		setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
		toast.success("Notification deleted")
	}

	const handleClearAll = () => {
		setNotifications([])
		toast.success("All notifications cleared")
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

	const unreadCount = notifications.filter(n => !n.isRead).length

	if (isLoading) {
		return (
			<div className={styles.loadingContainer}>
				<div className={styles.loadingSpinner}></div>
				<p>Loading notifications...</p>
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
							<Card key={notification.id} className={`${styles.notificationCard} ${!notification.isRead ? styles.unreadCard : ""}`}>
								<CardHeader className={styles.cardHeader}>
									<div className={styles.notificationHeader}>
										<div className={styles.notificationIconWrapper}>{getNotificationIcon(notification.type)}</div>
										<div className={styles.notificationInfo}>
											<div className={styles.notificationMeta}>
												{getNotificationBadge(notification.type)}
												<span className={styles.timestamp}>{formatTimeAgo(notification.createdAt)}</span>
											</div>
											<CardTitle className={styles.notificationTitle}>{notification.message}</CardTitle>
										</div>
									</div>
									<div className={styles.notificationActions}>
										{!notification.isRead && (
											<Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)} className={styles.markReadButton}>
												<Check size={16} />
											</Button>
										)}
										<Button variant="ghost" size="sm" onClick={() => handleDeleteNotification(notification.id)} className={styles.deleteButton}>
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
