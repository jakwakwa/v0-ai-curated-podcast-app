"use client"

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import type React from "react"
import { useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar-ui"
import { StoreInitializer } from "../store-initializer"
import styles from "./layout.module.css"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
	const { isSignedIn, isLoaded } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (isLoaded && !isSignedIn) {
			router.push("/sign-in")
		}
	}, [isSignedIn, isLoaded, router])

	// Show minimal loading while checking authentication
	if (!isLoaded) {
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
			<SiteHeader />
			<AppSidebar />
			<div className={styles.container}>
				<div className={styles.content}>{children}</div>
			</div>
		</SidebarProvider>
	)
}
