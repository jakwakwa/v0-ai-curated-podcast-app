"use client"

import { Bell } from "lucide-react"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarContext, SidebarTrigger } from "@/components/ui/sidebar-ui"
import styles from "./site-header.module.css"

export function SiteHeader() {
	// Check if we're in a sidebar context to avoid errors
	const sidebarContext = useContext(SidebarContext)
	const [unreadCount, setUnreadCount] = useState(0)

	useEffect(() => {
		const fetchNotificationCount = async () => {
			try {
				const response = await fetch("/api/notifications")
				if (response.ok) {
					const notifications = await response.json()
					const count = notifications.filter((n: { is_read: boolean }) => !n.is_read).length
					setUnreadCount(count)
				}
			} catch (error) {
				console.error("Error fetching notification count:", error)
			}
		}

		fetchNotificationCount()

		// Refresh count every 30 seconds
		const interval = setInterval(fetchNotificationCount, 30000)
		return () => clearInterval(interval)
	}, [])

	return (
		<header className={`${styles["header-container"]} ${styles["header-container-collapsed"]}`}>
			<div className={styles["content-wrapper"]}>
				<div className={styles["left-section"]}>
					{sidebarContext && (
						<>
							<SidebarTrigger className={styles["sidebar-trigger-margin"]} />
							<Separator orientation="vertical" className={styles["separator-vertical"]} />
						</>
					)}
					<Button asChild variant="link" className={styles["title-text"]}>
						<Link href="/dashboard">PodSlice</Link>
					</Button>
				</div>

				<div className={styles["right-section"]}>
					<Button asChild variant="ghost" size="icon" className={styles["notification-button"]}>
						<Link href="/notifications" className={styles["notification-link"]}>
							<Bell className={styles["bell-icon"]} />
							{unreadCount > 0 && (
								<Badge variant="destructive" className={styles["notification-badge"]}>
									{unreadCount > 99 ? "99+" : unreadCount}
								</Badge>
							)}
							<span className="sr-only">Notifications{unreadCount > 0 ? ` (${unreadCount} unread)` : ""}</span>
						</Link>
					</Button>
				</div>
			</div>
		</header>
	)
}
