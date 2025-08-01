"use client"

import { useAuth, useClerk } from "@clerk/nextjs"
import { BellIcon, CreditCardIcon, LogOutIcon, MoreVerticalIcon, Settings, Shield, UserCircleIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import styles from "./nav-user.module.css"

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
	const { isLoaded, isSignedIn } = useAuth()
	const [isAdmin, setIsAdmin] = useState(false)

	// Generate initials from user name
	const getInitials = (name: string) => {
		if (!name) return "U"
		return name
			.split(" ")
			.map(part => part.charAt(0).toUpperCase())
			.slice(0, 2)
			.join("")
	}

	// Check if user is admin
	useEffect(() => {
		const checkAdminStatus = async () => {
			try {
				const response = await fetch("/api/admin/check")
				if (response.ok) {
					setIsAdmin(true)
				}
			} catch (error) {
				console.error("Failed to check admin status:", error)
			}
		}

		if (isLoaded && isSignedIn) {
			checkAdminStatus()
		}
	}, [isLoaded, isSignedIn])

	if (!isLoaded) {
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton size="lg" className={styles["sidebar-menu-button"]}>
						<Avatar className={styles["avatar-image-grayscale"]}>
							<AvatarFallback className={styles["avatar-fallback-rounded"]}>...</AvatarFallback>
						</Avatar>
						<div className={styles["text-grid-container"]}>
							<span className={styles["truncate-font-medium"]}>Loading...</span>
							<span className={styles["truncate-text-xs"]}>Loading...</span>
						</div>
						<MoreVerticalIcon className={styles["more-vertical-icon"]} />
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		)
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton size="lg" className={styles["sidebar-menu-button"]}>
							<Avatar className={styles["avatar-image-grayscale"]}>
								<AvatarImage src={user.avatar} alt={user.name} />
								<AvatarFallback className={styles["avatar-fallback-rounded"]}>{getInitials(user.name)}</AvatarFallback>
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
									<AvatarImage src={user.avatar} alt={user.name} />
									<AvatarFallback className={styles["avatar-fallback-rounded"]}>{getInitials(user.name)}</AvatarFallback>
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
									Personalized Feed Management
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
							<DropdownMenuItem asChild>
								<Link href="/account">
									<Settings />
									Account Settings
								</Link>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						{isAdmin && (
							<>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem asChild>
										<Link href="/admin">
											<Shield className="h-4 w-4" />
											Content Configuration
										</Link>
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</>
						)}
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
