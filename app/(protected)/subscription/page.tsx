"use client"

import { UserProfile, useAuth, useUser } from "@clerk/nextjs"

export default function SubscriptionPage() {
	const { user, isLoaded } = useUser()
	const { has } = useAuth()

	if (!isLoaded) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="animate-pulse space-y-4">
					<div className="h-8 bg-muted rounded w-1/3"></div>
					<div className="h-32 bg-muted rounded"></div>
				</div>
			</div>
		)
	}

	if (!user) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Access Denied</h1>
					<p className="text-muted-foreground mb-6">Please sign in to view your subscription.</p>
				</div>
			</div>
		)
	}

	// Get current plan information
	const getCurrentPlan = () => {
		if (has?.({ feature: "custom_curation_profiles" })) {
			return "Curate & Control"
		}
		if (has?.({ feature: "weekly_combo" })) {
			return "Casual Listener"
		}
		return "FreeSlice"
	}

	const currentPlan = getCurrentPlan()

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
				<p className="text-muted-foreground">Manage your subscription, billing, and account preferences.</p>
				<div className="mt-4 p-4 bg-muted rounded-lg">
					<p className="text-sm">
						<strong>Current Plan:</strong> {currentPlan}
					</p>
				</div>
			</div>

			{/* Clerk's UserProfile component with billing management */}
			<div className="mx-auto">
				<UserProfile
					routing="hash"
					appearance={{
						elements: {
							rootBox: "w-full",
							card: "shadow-none border",
							// Hide the features list in billing section
							planFeaturesList: "display: none",
							planFeaturesItem: "display: none",
						},
					}}
				/>
			</div>
		</div>
	)
}
