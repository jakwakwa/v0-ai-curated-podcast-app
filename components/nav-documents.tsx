"use client"

import { FolderIcon, type LucideIcon, MoreHorizontalIcon, ShareIcon } from "lucide-react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar-ui"
import styles from "./nav-documents.module.css"

export function NavDocuments({
	items,
}: {
	items: {
		name: string
		url: string
		icon: LucideIcon
	}[]
}) {
	const { isMobile } = useSidebar()

	return (
		<SidebarGroup className={styles["sidebar-group-hidden"]}>
			<SidebarGroupLabel>MY Dashboard</SidebarGroupLabel>
			<SidebarMenu>
				{items.map(item => (
					<SidebarMenuItem key={item.name}>
						<SidebarMenuButton asChild>
							<a href={item.url}>
								<item.icon />
								<span>{item.name}</span>
							</a>
						</SidebarMenuButton>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuAction showOnHover className={styles["dropdown-menu-action"]}>
									<MoreHorizontalIcon />
									<span className={styles["sr-only"]}>More</span>
								</SidebarMenuAction>
							</DropdownMenuTrigger>
							<DropdownMenuContent className={styles["dropdown-menu-content"]} side={isMobile ? "bottom" : "right"} align={isMobile ? "end" : "start"}>
								<DropdownMenuItem>
									<FolderIcon />
									<span>Open</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<ShareIcon />
									<span>Share</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				))}
				<SidebarMenuItem>
					<SidebarMenuButton className={styles["sidebar-menu-button-text"]}>
						<MoreHorizontalIcon className={styles["more-horizontal-icon"]} />
						<span>More</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	)
}
