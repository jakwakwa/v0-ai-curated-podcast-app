"use client"

import { useUser } from "@clerk/nextjs"
import { IconInnerShadowTop } from "@tabler/icons-react"
import { Home, Info, Play, Radio, Settings } from "lucide-react"
import Link from "next/link"
import type * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

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
			title: "About Podslice",
			url: "/about",
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
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
							<Link href="/" className="text-custom-sm  bg-card/50 hover:bg-card/10 active:bg-card/20 mt-2 mb-4">
								<IconInnerShadowTop className="size-5!" />
								<span className="text-base font-semibold">PodSlice</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navItems} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={userData} />
			</SidebarFooter>
		</Sidebar>
	)
}
