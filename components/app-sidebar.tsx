"use client"

import { useUser } from "@clerk/nextjs"
import { Bell, Home, Info, Play, Radio, Settings } from "lucide-react"
import type * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, } from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { user } = useUser()

	// Prepare user data for NavUser component
	const userData = {
		name: user?.fullName || user?.firstName || "User",
		email: user?.emailAddresses?.[0]?.emailAddress || "user@example.com",
		avatar: user?.imageUrl || "/placeholder-user.jpg",
	}

	// Navigation items
	const navItems = [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: Home,
		},
		{
			title: "Notifications",
			url: "/notifications",
			icon: Bell
		},
		{
			title: "About Podslice",
			url: "/welcome",
			icon: Info,
		},
		{
			title: "Weekly Episodes",
			url: "/episodes",
			icon: Play,
			separator: true,
		},
		{
			title: "Bundles",
			url: "/curated-bundles",
			icon: Radio,
		},
		{
			title: "Personal Feed",
			url: "/curation-profile-management",
			icon: Settings,
		},
	]

	return (
		<Sidebar collapsible="offcanvas" {...props} className="bg-sidebar/90 border-2 border-l-0 border-b-0 border-r-[#000] ">
			<SidebarContent>
				<NavMain items={navItems} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={userData} />
			</SidebarFooter>
		</Sidebar>
	)
}
