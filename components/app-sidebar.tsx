"use client"

import { useUser } from "@clerk/nextjs"
import {
	IconCamera,
	IconChartBar,
	IconDashboard,
	IconDatabase,
	IconFileAi,
	IconFileDescription,
	IconFileWord,
	IconFolder,
	IconHelp,
	IconInnerShadowTop,
	IconListDetails,
	IconReport,
	IconSearch,
	IconSettings,
	IconUsers,
} from "@tabler/icons-react"
import Link from "next/link"
import * as React from "react"
// import { NavMain } from "@/components/nav-main"
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

	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
							<Link href="/">
								<IconInnerShadowTop className="!size-5" />
								<span className="text-base font-semibold">PodSlice</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>{/* <NavMain items={data.navMain} /> */}</SidebarContent>
			<SidebarFooter>
				<NavUser user={userData} />
			</SidebarFooter>
		</Sidebar>
	)
}
