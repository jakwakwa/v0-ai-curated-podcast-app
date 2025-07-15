import { ChevronRight } from "lucide-react"
import type * as React from "react"

import { SearchForm } from "@/components/search-form"
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
import { VersionSwitcher } from "@/components/version-switcher"
import { NavUser } from "./nav-user"

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
					url: "#",
				},
				{
					title: "Discover	",
					url: "#",
				},
			],
		},
		{
			title: "Building Your Collection",
			url: "#",
			items: [
				{
					title: "Bundles",
					url: "#",
				},
				{
					title: "Custom Collections",
					url: "#",
					isActive: true,
				},
			],
		},
	],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
				<SearchForm />
			</SidebarHeader>
			<SidebarContent className="gap-0">
				{/* We create a collapsible SidebarGroup for each parent. */}
				{data.navMain.map(item => (
					<Collapsible key={item.title} title={item.title} defaultOpen className="group/collapsible">
						<SidebarGroup>
							<SidebarGroupLabel
								asChild
								className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
							>
								<CollapsibleTrigger>
									{item.title}{" "}
									<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
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
			</SidebarContent>
			<SidebarRail />
			<SidebarFooter>
				<NavUser user={{ name: "", email: "", avatar: "" }} />
			</SidebarFooter>
		</Sidebar>
	)
}
