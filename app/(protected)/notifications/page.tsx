"use client"

import { Bell, Calendar, Check, Clock, Play, Trash2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { AppSpinner } from "@/components/ui/app-spinner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Notification } from "@/lib/types"
import { cn } from "@/lib/utils"

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
				return <Play className="w-5 h-5" />
			case "weekly_reminder":
				return <Calendar className="w-5 h-5" />
			case "subscription_expiring":
				return <Clock className="w-5 h-5" />
			case "trial_ending":
				return <Bell className="w-5 h-5" />
			default:
				return <Bell className="w-5 h-5" />
		}
	}

	const getNotificationBadge = (type: Notification["type"]) => {
		switch (type) {
			case "episode_ready":
				return (
					<Badge variant="default" size="sm" className="bg-secondary text-primary-foreground font-semibold">
						Episode Ready
					</Badge>
				)
			case "weekly_reminder":
				return (
					<Badge variant="default" size="sm" className="bg-secondary text-secondary-foreground">
						Reminder
					</Badge>
				)
			case "subscription_expiring":
				return (
					<Badge variant="default" size="sm" className="bg-accent text-primary-foreground">
						Subscription
					</Badge>
				)
			case "trial_ending":
				return (
					<Badge variant="default" size="sm" className="bg-destructive text-destructive-foreground">
						Trial
					</Badge>
				)
			default:
				return (
					<Badge variant="default" size="sm" className="bg-accent text-accent-foreground">
						Notification
					</Badge>
				)
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
			<div className="max-w-4xl mx-auto p-8 min-h-screen">
				<div className="flex items-center justify-center min-h-[400px]">
					<AppSpinner size="lg" label="Loading notifications..." />
				</div>
			</div>
		)
	}

	return (
		<Card variant="glass" className="w-full lg:w-full lg:min-w-screen/[60%] lg:max-w-[1200px] h-auto mb-0 mt-12 px-12 pt-12">
			<div className="mb-8 px-12">
				<div className="flex justify-between items-center flex-wrap gap-4">
					<div className="flex items-center gap-3">
						<Bell className="w-6 h-6 text-primary" />
						<h1 className="text-2xl font-semibold m-0">Notifications</h1>
						{unreadCount > 0 && (
							<Badge variant="default" size="sm" className="bg-destructive text-destructive-foreground font-semibold min-w-[20px] h-5 flex items-center justify-center rounded-full text-sm">
								{unreadCount}
							</Badge>
						)}
					</div>
					<div className="flex gap-2 flex-wrap">
						{unreadCount > 0 && (
							<Button variant="default" size="sm" onClick={handleMarkAllAsRead} className="flex items-center gap-2 text-sm">
								<Check size={16} />
								Mark all as read
							</Button>
						)}
						{notifications.length > 0 && (
							<Button variant="outline" size="sm" onClick={handleClearAll} className="flex items-center gap-2 text-sm">
								<Trash2 size={16} />
								Clear all
							</Button>
						)}
					</div>
				</div>
			</div>

			<div className="min-h-[400px]">
				{notifications.length === 0 ? (
					<Card className="text-center p-12 border-2 border-dashed border-border bg-card">
						<CardContent className="flex flex-col items-center gap-4">
							<Bell className="w-12 h-12 text-muted-foreground opacity-50" />
							<h3 className="text-2xl font-semibold text-foreground m-0">No notifications</h3>
							<p className="text-muted-foreground max-w-md text-base m-0">You're all caught up! New notifications will appear here when they arrive.</p>
						</CardContent>
					</Card>
				) : (
					<div className="flex flex-col gap-1 px-2 py-2">
						{notifications.map(notification => (
							<Card
								key={notification.notification_id}
								className={cn(
									"border transition-all duration-200 my-2 px-2 py-2 bg-cardglass hover:translate-y-[-1px] hover:shadow-lg",
									!notification.is_read && "border-l-4 border-l-primary bg-card"
								)}
							>
								<CardHeader className="p-6 flex justify-between items-start gap-4">
									<div className="flex gap-4 flex-1">
										<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#176a888f] text-primary-foreground flex-shrink-0 bg-cardglass">
											{getNotificationIcon(notification.type)}
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-3 mb-2 flex-wrap">
												{getNotificationBadge(notification.type)}
												<span className="bg-primary-foreground/10 text-sm text-muted-foreground px-2 py-0	 rounded-md border border-primary-foreground/10">
													{formatTimeAgo(new Date(notification.created_at))}
												</span>
											</div>
											<CardTitle className="text-custom-sm text-foreground mt-4">{notification.message}</CardTitle>
										</div>
										<div className="flex flex-col gap-1 flex-shrink-0 mt-2">
											{!notification.is_read && (
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleMarkAsRead(notification.notification_id)}
													className="p-2 min-w-auto text-primary hover:bg-primary hover:text-primary-foreground"
												>
													<Check size={16} />
												</Button>
											)}
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleDeleteNotification(notification.notification_id)}
												className="p-2 min-w-auto text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
											>
												<Trash2 size={16} />
											</Button>
										</div>
									</div>
								</CardHeader>
							</Card>
						))}
					</div>
				)}
			</div>
		</Card>
	)
}
