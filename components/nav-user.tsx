"use client"

import { useAuth, useClerk } from "@clerk/nextjs"
import { Bell, CreditCard, LogOutIcon, MoreVerticalIcon, Settings, Shield, UserCircleIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"

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

	// Compute Clerk Account Portal direct link with redirect
	const appUrl = process.env.NEXT_PUBLIC_APP_URL || ""
	let accountPortalUrl: string | null = null
	try {
		if (appUrl) {
			const parsed = new URL(appUrl)
			accountPortalUrl = `https://accounts.${parsed.hostname}/account?redirect_url=${encodeURIComponent(parsed.origin)}`
		}
	} catch {
		accountPortalUrl = null
	}

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
					<SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
						<Avatar className="h-8 w-8 rounded-lg filter grayscale">
							<AvatarFallback className="rounded-lg">...</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">Loading...3</span>
							<span className="truncate text-xs text-muted-foreground">Loading. 2..</span>
						</div>
						<MoreVerticalIcon className="ml-auto h-4 w-4" />
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
						<SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
							<Avatar className="h-8 w-8 rounded-lg filter grayscale">
								<AvatarImage src={user.avatar} alt={user.name} />
								<AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user.name}</span>
								<span className="truncate text-xs text-muted-foreground">{user.email}</span>
							</div>
							<MoreVerticalIcon className="ml-auto h-4 w-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-full md:min-w-56 rounded-lg" side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 md:px-2 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg filter grayscale">
									<AvatarImage src={user.avatar} alt={user.name} />
									<AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{user.name}</span>
									<span className="truncate text-xs text-muted-foreground">{user.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<Link href="/notification-preferences">
									<Bell className="h-4 w-4" />
									Notification Preferences
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/user-subscription">
									<CreditCard className="h-4 w-4" />
									Subscription
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href={accountPortalUrl ?? "/"}>
									<Settings className="h-4 w-4" />
									Account & Security (Clerk)
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/curation-profile-management">
									<UserCircleIcon />
									Personalized Feed Management
								</Link>
							</DropdownMenuItem>
							{/* legacy account menu items removed in favor of dedicated routes and Clerk portal */}
						</DropdownMenuGroup>
						{isAdmin && (
							<>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem asChild>
										<Link href="/admin">
											<Shield className="h-4 w-4" />
											Admin Portal (Restricted Access)
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
									console.error("Sign out failed from nav-user.tsx, try again")
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
