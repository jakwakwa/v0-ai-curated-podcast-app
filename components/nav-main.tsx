"use client"

import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavMain({
	items,
}: {
	items: {
		title: string
		url: string
		icon?: LucideIcon
		separator?: boolean
	}[]
}) {
	const pathname = usePathname()

	return (
		<SidebarGroup>
			<SidebarMenu>
				{items.map((item, index) => (
					<div key={item.title}>
						{item.separator && index > 0 && <SidebarSeparator className="my-2" />}
						<SidebarMenuItem>
							<SidebarMenuButton asChild isActive={pathname === item.url}>
								<Link href={item.url} className={cn("flex items-center gap-2")}>
									{item.icon && <item.icon className="size-4" />}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</div>
				))}
				<SidebarSeparator className="my-2" />
			</SidebarMenu>
		</SidebarGroup>
	)
}
