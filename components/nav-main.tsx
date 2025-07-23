"use client"

import { type LucideIcon, MailIcon, PlusCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar-ui"
import styles from "./nav-main.module.css"

export function NavMain({
	items,
}: {
	items: {
		title: string
		url: string
		icon?: LucideIcon
	}[]
}) {
	return (
		<SidebarGroup>
			<SidebarGroupContent className={styles["sidebar-group-content-flex"]}>
				<SidebarMenu>
					<SidebarMenuItem className={styles["sidebar-menu-item-flex"]}>
						<SidebarMenuButton tooltip="Quick Create" className={styles["sidebar-menu-button-primary"]}>
							<PlusCircleIcon />
							<span>Quick Create</span>
						</SidebarMenuButton>
						<Button size="icon" className={styles["button-icon-hidden-on-collapsible-icon"]} variant="outline">
							<MailIcon />
							<span className={styles["sr-only"]}>Inbox</span>
						</Button>
					</SidebarMenuItem>
				</SidebarMenu>
				<SidebarMenu>
					{items.map(item => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton tooltip={item.title}>
								{item.icon && <item.icon />}
								<span>{item.title}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}
