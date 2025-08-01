import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import UserFeedSelectorWizard from "@/components/features/user-feed-selector"
import { Button } from "@/components/ui/button"
import styles from "./page.module.css"

export default async function BuildCurationPage() {
	return (
		<div className="container">
			<main className={styles.main}>
				<div className={styles.content}>
					<div className={styles.header}>
						<Link href="/dashboard">
							<Button variant="outline" size="sm" className={styles.backButton}>
								<ArrowLeft size={16} />
								Back to Dashboard
							</Button>
						</Link>
						<UserFeedSelectorWizard />
					</div>
				</div>
			</main>
		</div>
	)
}
