"use client"

import { useUser } from "@clerk/nextjs"
import { BookOpen, ChevronRight, House, Library } from "lucide-react"
import type * as React from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar-ui"
import styles from "./app-sidebar.module.css"
import { NavUser } from "./nav-user"

interface SidebarNavItem {
	title: string
	url: string
	isActive?: boolean
}

interface SidebarNavGroup {
	title: string
	url: string
	icon?: React.ReactNode
	items: SidebarNavItem[]
}

// This is sample data.
const data = {
	versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
	navMain: [
		{
			title: "Getting Started",
			url: "#",
			icon: <BookOpen className="h-4 w-4 mr-1" />,
			items: [
				{
					title: "Dashboard",
					url: "/dashboard",
				},
				{
					title: "About ZIST",
					url: "/about",
				},
			],
		},
		{
			title: "Your Library",
			url: "#",
			icon: <Library className="h-4 w-4 mr-1" />,
			items: [
				{
					title: "Weekly Episodes",
					url: "/collections/weekly-episodes",
				},
				{
					title: "Personalized Feeds",
					url: "/curation-profile-management",
				},
				{
					title: "Active ZIST Bundles",
					url: "/curated-bundles",
				},
			],
		},
	] as SidebarNavGroup[], // Apply the new type to navMain
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { user } = useUser()

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
							<a href="/">
								<House />
								<span className="text-base font-semibold">Home</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent className={styles["sidebar-content-gap"]}>
				{/* We create a collapsible SidebarGroup for each parent. */}
				{data.navMain.map(item => (
					<Collapsible key={item.title} title={item.title} defaultOpen className={styles["collapsible-open"]}>
						<SidebarGroup>
							<SidebarGroupLabel asChild className={styles["collapsible-label"]}>
								<CollapsibleTrigger>
									{item.icon}
									{item.title} <ChevronRight className={styles["chevron-icon"]} />
								</CollapsibleTrigger>
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenu>
										{item.items.map(item => (
											<SidebarMenuItem key={item.title} className={styles["sidebar-menu-item"]}>
												<SidebarMenuButton asChild isActive={item.isActive}>
													<a href={item.url}>{item.title}</a>
												</SidebarMenuButton>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>
				))}
			</SidebarContent>
			<SidebarRail />
			<SidebarFooter>
				<NavUser
					user={{
						name: user?.fullName || user?.firstName || "User",
						email: user?.emailAddresses?.[0]?.emailAddress || "",
						avatar: user?.imageUrl || "",
					}}
				/>
			</SidebarFooter>
		</Sidebar>
	)
}
