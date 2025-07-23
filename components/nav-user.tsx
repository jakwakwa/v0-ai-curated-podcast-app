"use client"

import { BellIcon, CreditCardIcon, LogOutIcon, MoreVerticalIcon, UserCircleIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar-ui"
import styles from "./nav-user.module.css"
import { useClerk } from "@clerk/nextjs"
import Link from "next/link"

export function NavUser({
	user,
}: {
	user: {
		name: string
		email: string
		avatar: string
	}
}) {
	const { isMobile } = useSidebar()
	const { signOut } = useClerk()

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton size="lg" className={styles["sidebar-menu-button"]}>
							<Avatar className={styles["avatar-image-grayscale"]}>
								<AvatarImage src={user.avatar} alt={user.name} />
								<AvatarFallback className={styles["avatar-fallback-rounded"]}>CN</AvatarFallback>
							</Avatar>
							<div className={styles["text-grid-container"]}>
								<span className={styles["truncate-font-medium"]}>{user.name}</span>
								<span className={styles["truncate-text-xs"]}>{user.email}</span>
							</div>
							<MoreVerticalIcon className={styles["more-vertical-icon"]} />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent className={styles["dropdown-menu-content"]} side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
						<DropdownMenuLabel className={styles["dropdown-menu-label"]}>
							<div className={styles["dropdown-menu-label-content"]}>
								<Avatar className={styles["avatar-image-grayscale"]}>
									{/* <AvatarImage src={user?.avatar} alt={user.name} /> */}
									<AvatarFallback className={styles["avatar-fallback-rounded"]}>CN</AvatarFallback>
								</Avatar>
								<div className={styles["text-grid-container"]}>
									<span className={styles["truncate-font-medium"]}>{user.name}</span>
									<span className={styles["truncate-text-xs"]}>{user.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<Link href="/curation-profile-management">
									<UserCircleIcon />
									Curation Profile Management
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/subscription">
									<CreditCardIcon />
									Subscription
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/notifications">
									<BellIcon />
									Notifications
								</Link>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={async () => {
								try {
									await signOut({ redirectUrl: "/" })
								} catch {
									// console.error("Sign out failed:", error);
								}
							}}
						>
							<LogOutIcon />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
