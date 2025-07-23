"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Mic } from "lucide-react"
import { cn } from "@/lib/utils"
import { UserNav } from "./user-nav"
import { useUser } from "@clerk/nextjs"

export function Header() {
	const { user } = useUser()
	const pathname = usePathname()

	return (
		<header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
			<nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
				<Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
					<Mic className="h-6 w-6" />
					<span className="sr-only">AI Podcast Generator</span>
				</Link>
				<Link href="/" className={cn("transition-colors hover:text-foreground", pathname === "/" ? "text-foreground" : "text-muted-foreground")}>
					Dashboard
				</Link>
				<Link href="/build" className={cn("transition-colors hover:text-foreground", pathname === "/build" ? "text-foreground" : "text-muted-foreground")}>
					Build
				</Link>
			</nav>
			<div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
				<div className="ml-auto flex-1 sm:flex-initial" />
				{user ? <UserNav /> : <Link href="/login">Login</Link>}
			</div>
		</header>
	)
}
