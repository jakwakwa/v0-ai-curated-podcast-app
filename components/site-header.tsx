import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar-ui"
import styles from "./site-header.module.css"

export function SiteHeader() {
	return (
		<header className={`${styles["header-container"]} ${styles["header-container-collapsed"]}`}>
			<div className={styles["content-wrapper"]}>
				<SidebarTrigger className={styles["sidebar-trigger-margin"]} />
				<Separator orientation="vertical" className={styles["separator-vertical"]} />
				<h1 className={styles["title-text"]}>Ai Podcast Curator App</h1>
			</div>
		</header>
	)
}
