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
import { cn } from "@/lib/utils"

export function NotificationBell() {
	const [isOpen, setIsOpen] = useState(false)

	const { notifications, unreadCount, isLoading, loadNotifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotificationStore()

	useEffect(() => {
		loadNotifications()
	}, [loadNotifications])

	// Refresh when opened
	useEffect(() => {
		if (isOpen) {
			void loadNotifications()
		}
	}, [isOpen, loadNotifications])

	// Light polling while closed and tab visible
	useEffect(() => {
		const intervalId = setInterval(() => {
			if (!isOpen && typeof document !== "undefined" && document.visibilityState === "visible") {
				void loadNotifications()
			}
		}, 10000)

		const onVisibility = () => {
			if (document.visibilityState === "visible" && !isOpen) {
				void loadNotifications()
			}
		}
		document.addEventListener("visibilitychange", onVisibility)

		return () => {
			clearInterval(intervalId)
			document.removeEventListener("visibilitychange", onVisibility)
		}
	}, [isOpen, loadNotifications])

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
				return "text-green-500"
			case "weekly_reminder":
				return "text-amber-500"
			default:
				return "text-gray-500"
		}
	}

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="relative" aria-label={`Notifications (${unreadCount} unread)`}>
					<Bell size={20} />
					{unreadCount > 0 && (
						<Badge
							variant="destructive"
							size="sm"
							className="absolute -top-1 -right-1 md:-top-2 md:-right-2 min-w-[12px] md:min-w-[20px] h-[12px] md:h-[20px] text-[10px] md:text-xs flex items-center justify-center font-semibold ring-2 ring-red-500/60 shadow-md animate-pulse"
						>
							{unreadCount > 99 ? "99+" : unreadCount}
						</Badge>
					)}
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-[400px] max-h-[500px] overflow-hidden" align="end" sideOffset={8}>
				<div className="flex justify-between items-center p-4 border-b border-border">
					<h3 className="text-lg font-semibold m-0">Notifications</h3>
					{notifications.length > 0 && (
						<div className="flex gap-2">
							{unreadCount > 0 && (
								<Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} disabled={isLoading} className="text-xs px-2 py-1 h-auto">
									<Check size={14} />
									Mark all read
								</Button>
							)}
							<Button variant="ghost" size="sm" onClick={handleClearAll} disabled={isLoading} className="text-xs px-2 py-1 h-auto">
								<Trash2 size={14} />
								Clear all
							</Button>
						</div>
					)}
				</div>

				<div className="max-h-96 overflow-y-auto p-2">
					{notifications.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-8 px-4 text-center text-muted-foreground">
							<Bell size={32} className="mb-3 opacity-50" />
							<p className="mb-1 text-base font-medium">No notifications yet</p>
							<small className="text-xs opacity-70">We'll notify you when new episodes are ready</small>
						</div>
					) : (
						notifications.slice(0, 10).map(notification => (
							<Card
								key={notification.notification_id}
								className={cn("mb-2 border transition-all duration-200 hover:border-primary/20 hover:shadow-sm", !notification.is_read && "border-l-4 border-l-primary bg-muted/30")}
							>
								<div className="p-3">
									<div className="flex items-start justify-between mb-2">
										<span className={cn("text-base mr-2", getNotificationColor(notification.type))}>{getNotificationIcon(notification.type)}</span>
										<div className="flex items-center gap-2 ml-auto">
											<time className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</time>
											{!notification.is_read && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
										</div>
									</div>

									<p className="mb-3 text-sm leading-relaxed">{notification.message}</p>

									<div className="flex gap-2 justify-end">
										{!notification.is_read && (
											<Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.notification_id)} disabled={isLoading} className="text-xs px-2 py-1 h-auto">
												<Check size={12} />
												Mark read
											</Button>
										)}
										<Button variant="ghost" size="sm" onClick={() => handleDeleteNotification(notification.notification_id)} disabled={isLoading} className="text-xs px-2 py-1 h-auto">
											<X size={12} />
											Delete
										</Button>
									</div>
								</div>
							</Card>
						))
					)}

					{notifications.length > 10 && (
						<div className="p-3 text-center border-t border-border">
							<Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
								View all notifications ({notifications.length})
							</Button>
						</div>
					)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
