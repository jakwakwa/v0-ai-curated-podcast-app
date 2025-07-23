import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar-ui"
import styles from "./layout.module.css"

export default function Loading() {
	return (
		<SidebarProvider>
			<SiteHeader />
			<div className={styles.progressLoader}>
				<div className={styles.progressBar}>
					<div className={styles.progressFill} />
				</div>
			</div>
		</SidebarProvider>
	)
}
