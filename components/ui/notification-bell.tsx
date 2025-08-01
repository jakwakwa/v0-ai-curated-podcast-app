"use client"

import { formatDistanceToNow } from "date-fns"
import { Bell, Check, Trash2, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useNotificationStore } from "@/lib/stores"
import styles from "./notification-bell.module.css"

export function NotificationBell() {
	const [isOpen, setIsOpen] = useState(false)

	const { notifications, unreadCount, isLoading, loadNotifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotificationStore()

	useEffect(() => {
		loadNotifications()
	}, [loadNotifications])

	const handleMarkAsRead = async (notificationId: string) => {
		try {
			await markAsRead(notificationId)
		} catch {
			toast.error("Failed to mark notification as read")
		}
	}

	const handleMarkAllAsRead = async () => {
		try {
			await markAllAsRead()
			toast.success("All notifications marked as read")
		} catch {
			toast.error("Failed to mark all as read")
		}
	}

	const handleDeleteNotification = async (notificationId: string) => {
		try {
			await deleteNotification(notificationId)
			toast.success("Notification deleted")
		} catch {
			toast.error("Failed to delete notification")
		}
	}

	const handleClearAll = async () => {
		try {
			await clearAll()
			toast.success("All notifications cleared")
			setIsOpen(false)
		} catch {
			toast.error("Failed to clear notifications")
		}
	}

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case "episode_ready":
				return "🎧"
			case "weekly_reminder":
				return "📅"
			default:
				return "📢"
		}
	}

	const getNotificationColor = (type: string) => {
		switch (type) {
			case "episode_ready":
				return styles.episodeReady
			case "weekly_reminder":
				return styles.weeklyReminder
			default:
				return styles.default
		}
	}

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className={styles.bellButton} aria-label={`Notifications (${unreadCount} unread)`}>
					<Bell size={20} />
					{unreadCount > 0 && (
						<Badge variant="destructive" className={styles.unreadBadge}>
							{unreadCount > 99 ? "99+" : unreadCount}
						</Badge>
					)}
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className={styles.notificationDropdown} align="end" sideOffset={8}>
				<div className={styles.dropdownHeader}>
					<h3>Notifications</h3>
					{notifications.length > 0 && (
						<div className={styles.headerActions}>
							{unreadCount > 0 && (
								<Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} disabled={isLoading} className={styles.headerAction}>
									<Check size={14} />
									Mark all read
								</Button>
							)}
							<Button variant="ghost" size="sm" onClick={handleClearAll} disabled={isLoading} className={styles.headerAction}>
								<Trash2 size={14} />
								Clear all
							</Button>
						</div>
					)}
				</div>

				<div className={styles.notificationList}>
					{notifications.length === 0 ? (
						<div className={styles.emptyState}>
							<Bell size={32} className={styles.emptyIcon} />
							<p>No notifications yet</p>
							<small>We'll notify you when new episodes are ready</small>
						</div>
					) : (
						notifications.slice(0, 10).map(notification => (
							<Card key={notification.notification_id} className={`${styles.notificationItem} ${!notification.is_read ? styles.unread : ""}`}>
								<div className={styles.notificationContent}>
									<div className={styles.notificationHeader}>
										<span className={`${styles.notificationIcon} ${getNotificationColor(notification.type)}`}>{getNotificationIcon(notification.type)}</span>
										<div className={styles.notificationMeta}>
											<time className={styles.notificationTime}>{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</time>
											{!notification.is_read && <div className={styles.unreadDot} />}
										</div>
									</div>

									<p className={styles.notificationMessage}>{notification.message}</p>

									<div className={styles.notificationActions}>
										{!notification.is_read && (
											<Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.notification_id)} disabled={isLoading} className={styles.actionButton}>
												<Check size={12} />
												Mark read
											</Button>
										)}
										<Button variant="ghost" size="sm" onClick={() => handleDeleteNotification(notification.notification_id)} disabled={isLoading} className={styles.actionButton}>
											<X size={12} />
											Delete
										</Button>
									</div>
								</div>
							</Card>
						))
					)}

					{notifications.length > 10 && (
						<div className={styles.showMoreContainer}>
							<Button variant="ghost" size="sm" className={styles.showMoreButton}>
								View all notifications ({notifications.length})
							</Button>
						</div>
					)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
