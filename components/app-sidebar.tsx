import { ChevronRight } from "lucide-react"
import type * as React from "react"
import { House } from "lucide-react"
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
import { NavAdmin } from "./nav-admin"

interface SidebarNavItem {
	title: string
	url: string
	isActive?: boolean
}

interface SidebarNavGroup {
	title: string
	url: string
	items: SidebarNavItem[]
}

// This is sample data.
const data = {
	versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
	navMain: [
		{
			title: "Getting Started",
			url: "#",
			items: [
				{
					title: "About Ai Curator",
					url: "/about",
				},
			],
		},
		{
			title: "Your Library",
			url: "#",
			items: [
				{
					title: "Weekly Episodes",
					url: "/collections/weekly-episodes",
				},
				{
					title: "Curation Profiles",
					url: "/curation-profile-management",
				},
				{
					title: "Curated Bundles",
					url: "/curated-bundles",
				},
				{
					title: "Notifications",
					url: "/notifications",
				},
			],
		},
	] as SidebarNavGroup[], // Apply the new type to navMain
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
									{item.title} <ChevronRight className={styles["chevron-icon"]} />
								</CollapsibleTrigger>
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenu>
										{item.items.map(item => (
											<SidebarMenuItem key={item.title}>
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

				{/* Admin section - only shows for admin users */}
				<NavAdmin />
			</SidebarContent>
			<SidebarRail />
			<SidebarFooter>
				<NavUser user={{ name: "", email: "", avatar: "" }} />
			</SidebarFooter>
		</Sidebar>
	)
}
