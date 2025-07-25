import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserCurationProfileCreationWizard } from "@/components/user-curation-profile-creation-wizard"
import styles from "./page.module.css"

// Remove force-dynamic - not recommended by Vercel
// export const dynamic = "force-dynamic"

export default async function BuildCurationPage() {
	return (
		<div className=".container">
			<main className={styles.main}>
				<div className={styles.content}>
					<div className={styles.header}>
						<Link href="/dashboard">
							<Button variant="outline" size="sm" className={styles.backButton}>
								<ArrowLeft size={16} />
								Back to Dashboard
							</Button>
						</Link>
					</div>
					<UserCurationProfileCreationWizard />
				</div>
			</main>
		</div>
	)
}
