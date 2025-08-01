// import { SidebarProvider } from "@/components/ui/sidebar"
// import { SiteHeader } from "@/components/ui/site-header"
import styles from "./layout.module.css"

export default function Loading() {
	return (
		<div className={styles.progressLoader}>
			<div className={styles.progressBar}>
				<div className={styles.progressFill} />
			</div>
		</div>
	)
}
