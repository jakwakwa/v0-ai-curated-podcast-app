"use client"

import { useAuth } from "@clerk/nextjs"
import { Settings, Shield } from "lucide-react"
import { useEffect, useState } from "react"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar-ui"

export function NavAdmin() {
	const { isLoaded, isSignedIn } = useAuth()
	const [isAdmin, setIsAdmin] = useState(false)
	const [isCheckingAdmin, setIsCheckingAdmin] = useState(false)

	useEffect(() => {
		// Only check admin status once Clerk auth is loaded and user is signed in
		if (!(isLoaded && isSignedIn)) {
			setIsAdmin(false)
			return
		}

		const checkAdminStatus = async () => {
			setIsCheckingAdmin(true)
			try {
				const response = await fetch("/api/admin/check")

				// Check if response is ok and has content
				if (!response.ok) {
					// Don't log 401 errors as they're expected for non-authenticated users
					if (response.status !== 401) {
						console.error("Admin check API returned error:", response.status)
					}
					setIsAdmin(false)
					return
				}

				// Check if response has content
				const text = await response.text()
				if (!text) {
					console.error("Admin check API returned empty response")
					setIsAdmin(false)
					return
				}

				// Parse JSON
				const data = JSON.parse(text)
				const adminStatus = data.isAdmin
				setIsAdmin(adminStatus)
			} catch (error) {
				console.error("Error checking admin status:", error)
				setIsAdmin(false)
			} finally {
				setIsCheckingAdmin(false)
			}
		}

		checkAdminStatus()
	}, [isLoaded, isSignedIn])

	// Don't render anything if:
	// - Clerk auth is not loaded yet
	// - User is not signed in
	// - Still checking admin status
	// - User is not admin
	if (!(isLoaded && isSignedIn) || isCheckingAdmin || !isAdmin) {
		return null
	}

	return (
		<SidebarGroup>
			<SidebarGroupLabel>
				<Shield className="h-4 w-4 mr-1" />
				Admin
			</SidebarGroupLabel>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton asChild>
						<a href="/admin">
							<Settings className="h-4 w-4" />
							<span>Content Configuration</span>
						</a>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	)
}
