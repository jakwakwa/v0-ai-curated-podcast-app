import { Suspense } from "react"

import { LoadingScreen } from "@/components/ui/loading-screen"
import { PageHeader } from "@/components/ui/page-header"

export default async function PaymentsPage() {
	return (
		<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
			<PageHeader title="Payments" />
			<Suspense fallback={<LoadingScreen />}>
				{/* <PaymentsContent subscriptionId={""} /> */}
			</Suspense>
		</main>
	)
}
