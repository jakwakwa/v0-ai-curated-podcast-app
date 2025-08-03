"use client"

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { StoreInitializer } from "../store-initializer"
// CSS module migrated to Tailwind classes

// Inner component that uses the sidebar context
function ProtectedLayoutInner({ children }: { children: React.ReactNode }) {
	const { state } = useSidebar()

	return (
		<>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						{/* @ts-ignore */}
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>Data Fetching</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>

				<main className="flex flex-col flex-grow transition-all duration-300 ease-in-out">
					<div className="bg-gradient-to-br from-blue-900/90 via-blue-950 to-gray-950 w-full min-w-[100px] p-0 flex backdrop-blur-md gap-8 px-8">{children}</div>
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
			{/* <DummyDataTogglePanel /> */}
		</SidebarProvider>
	)
}
