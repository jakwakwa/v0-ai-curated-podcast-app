"use client"

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import type React from "react"
import { useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"

import { DummyDataTogglePanel } from "@/components/dummy-data-toggle-panel"
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

	// Show loading while checking authentication
	if (!isLoaded) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
					<p>Loading authentication...</p>
				</div>
			</div>
		)
	}

	// Redirect if not signed in
	if (!isSignedIn) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
					<p>Redirecting to sign-in...</p>
				</div>
			</div>
		)
	}

	// No auth check needed here - middleware handles all protection
	return (
		<SidebarProvider>
			<StoreInitializer />
			<AppSidebar />
			<div className={styles.container}>
				<SiteHeader />
				<div className={styles.content}>{children}</div>
			</div>
			<DummyDataTogglePanel />
		</SidebarProvider>
	)
}
