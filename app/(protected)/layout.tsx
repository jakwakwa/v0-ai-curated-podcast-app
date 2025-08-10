"use client"

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { DynamicBreadcrumb } from "@/components/ui/dynamic-breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { StoreInitializer } from "../store-initializer"

function ProtectedLayoutInner({ children }: { children: React.ReactNode }) {
	const { state } = useSidebar()

	return (
		<>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] bg-background backdrop-blur-md ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 mt-0">
					<div className="flex items-center gap-2 px-2 md:px-4">
						{/* @ts-ignore */}
						<SidebarTrigger className="ml-2" />
						<Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
						<DynamicBreadcrumb />
					</div>
				</header>

				<main className={`flex flex-col flex-grow transition-all duration-300 ease-in-out pt-8 px-0 md:px-12 mt-8 md:mt-14 mb-20 ${state === "expanded" ? "w-full" : "w-full"}`}>
					<div className="w-full min-w-[100px] p-0 flex backdrop-blur-md gap-8 px-2 md:px-8 min-h-screen">{children}</div>
				</main>
			</SidebarInset>
		</>
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
				{/* <SiteHeader /> */}
				<div className="progress-loader">
					<div className="progress-bar">
						<div className="progress-fill" />
					</div>
				</div>
			</SidebarProvider>
		)
	}

	// Redirect if not signed in
	if (!isSignedIn) {
		return (
			<SidebarProvider>
				{/* <SiteHeader /> */}
				<div className="progress-loader">
					<div className="progress-bar">
						<div className="progress-fill" />
					</div>
				</div>
			</SidebarProvider>
		)
	}

	// No auth check needed here - middleware handles all protection
	return (
		<SidebarProvider>
			<StoreInitializer />
			<ProtectedLayoutInner>{children}</ProtectedLayoutInner>

			{/* Global audio player - always on top */}
			<div
				id="global-audio-player"
				className="fixed bottom-0 left-64 right-0 z-[9999] pointer-events-auto"
				style={{
					// @ts-ignore
					position: "fixed !important",
				}}
			/>
		</SidebarProvider>
	)
}
