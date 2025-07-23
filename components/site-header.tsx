"use client"

import Link from "next/link"
import { useContext } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarContext, SidebarTrigger } from "@/components/ui/sidebar-ui"
import styles from "./site-header.module.css"

export function SiteHeader() {
	// Check if we're in a sidebar context to avoid errors
	const sidebarContext = useContext(SidebarContext)

	return (
		<header className={`${styles["header-container"]} ${styles["header-container-collapsed"]}`}>
			<div className={styles["content-wrapper"]}>
				{sidebarContext && (
					<>
						<SidebarTrigger className={styles["sidebar-trigger-margin"]} />
						<Separator orientation="vertical" className={styles["separator-vertical"]} />
					</>
				)}
				<Button asChild variant="link" className={styles["title-text"]}>
					<Link href="/dashboard">PodSlice</Link>
				</Button>
			</div>
		</header>
	)
}
