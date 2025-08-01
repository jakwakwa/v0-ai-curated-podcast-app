"use client"

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar-ui"
import { SiteHeader } from "@/components/ui/site-header"
import { StoreInitializer } from "../store-initializer"
//
import styles from "./layout.module.css"

function MainLayout({ children }: { children: React.ReactNode }) {
	const { state } = useSidebar()

	console.log("🔧 MainLayout: rendering", { state })

	return (
		<main className={`${styles.mainContent} ${state === "expanded" ? styles.mainContentExpanded : ""}`}>
			<div className={styles.headerContainer}>
				<SiteHeader />
			</div>
			<div className={styles.content}>{children}</div>
		</main>
	)
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
	const { isSignedIn, isLoaded } = useAuth()
	const router = useRouter()
	const [isUserSynced, setIsUserSynced] = useState(false)
	const [isSyncingUser, setIsSyncingUser] = useState(false)

	// Sync user to local database
	const syncUser = useCallback(async () => {
		if (isSyncingUser || isUserSynced) return

		setIsSyncingUser(true)
		try {
			const response = await fetch("/api/sync-user", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			})

			if (response.ok) {
				setIsUserSynced(true)
			} else {
				setIsUserSynced(true)
			}
		} catch {
			setIsUserSynced(true)
		} finally {
			setIsSyncingUser(false)
		}
	}, [isSyncingUser, isUserSynced])

	useEffect(() => {
		if (isLoaded && !isSignedIn) {
			router.push("/sign-in")
		}
	}, [isSignedIn, isLoaded, router])

	useEffect(() => {
		if (isLoaded && isSignedIn && !isUserSynced && !isSyncingUser) {
			syncUser()
		}
	}, [isLoaded, isSignedIn, isUserSynced, isSyncingUser, syncUser])

	// Show minimal loading while checking authentication or syncing user
	if (!isLoaded || (isSignedIn && !isUserSynced)) {
		return (
			<SidebarProvider>
				<SiteHeader />
				<div className={styles.progressLoader}>
					<div className={styles.progressBar}>
						<div className={styles.progressFill} />
					</div>
				</div>
			</SidebarProvider>
		)
	}

	// Redirect if not signed in
	if (!isSignedIn) {
		return (
			<SidebarProvider>
				<SiteHeader />
				<div className={styles.progressLoader}>
					<div className={styles.progressBar}>
						<div className={styles.progressFill} />
					</div>
				</div>
			</SidebarProvider>
		)
	}

	// No auth check needed here - middleware handles all protection
	return (
		<SidebarProvider>
			<StoreInitializer />
			<AppSidebar />
			<MainLayout>{children}</MainLayout>
		</SidebarProvider>
	)
}
