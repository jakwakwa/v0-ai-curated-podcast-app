"use client"

import { Link, type LucideIcon } from "lucide-react"
import type * as React from "react"
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar-ui"

export function NavSecondary({
	items,
	...props
}: {
	items: {
		title: string
		url: string
		icon: LucideIcon
	}[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item, index) => (
						<SidebarMenuItem key={index}>
							<SidebarMenuButton asChild>
								<Link href={item.url} className="flex items-center gap-2">
									{item.icon && <item.icon className="size-5" />} {/* Render the LucideIcon component */}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}
