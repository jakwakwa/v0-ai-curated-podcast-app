import type { Metadata } from "next"
import { Suspense } from "react"
import { SubscriptionManagement } from "./components/subscription-management.disabled"

export const revalidate = 0

export const metadata: Metadata = {
	title: "Subscription",
	description: "Manage your subscription",
}

export default function Page() {
	return (
		<div className="container mx-auto py-8 px-2 md:px-4 mt-4 max-w-3xl">
			<div className="mb-6">
				<h1 className="text-2xl font-semibold">Subscription</h1>
				<p className="text-muted-foreground mt-1">View and manage your plan.</p>
			</div>
			<Suspense fallback={<div>Loading…</div>}>
				<SubscriptionManagement />
			</Suspense>
		</div>
	)
}
