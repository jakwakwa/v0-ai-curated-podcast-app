import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar-ui"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import styles from "./site-header.module.css"

export function SiteHeader() {
	return (
		<header className={`${styles["header-container"]} ${styles["header-container-collapsed"]}`}>
			<div className={styles["content-wrapper"]}>
				<SidebarTrigger className={styles["sidebar-trigger-margin"]} />
				<Separator orientation="vertical" className={styles["separator-vertical"]} />
				<Button asChild variant="link" className={styles["title-text"]}>
					<Link href="/dashboard">Ai Podcast Curator App</Link>
				</Button>
			</div>
		</header>
	)
}
