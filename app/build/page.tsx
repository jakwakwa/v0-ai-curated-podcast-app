import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import UserFeedSelectorWizard from "@/components/features/user-feed-selector"
import { Button } from "@/components/ui/button"
// CSS module migrated to Tailwind classes

export default async function BuildCurationPage() {
	return (
		<div className="container">
			<main className="flex flex-1 items-center justify-center p-4">
				<div className="w-full max-w-[92rem]">
					<div className="flex flex-col gap-4">
						<Link href="/dashboard">
							<Button variant="outline" size="sm">
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
