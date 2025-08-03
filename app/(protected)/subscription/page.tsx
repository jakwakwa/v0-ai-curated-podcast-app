"use client"

import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSubscriptionStore } from "@/lib/stores/subscription-store"

export default function SubscriptionPage() {
	const { user, isLoaded } = useUser()
	const { subscription, tiers } = useSubscriptionStore()

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
	const getCurrentPlanName = () => {
		if (!subscription) return "FreeSlice"
		const currentPlan = tiers.find(tier => tier.paystackPlanCode === subscription.paystackPlanCode)
		return currentPlan?.name || "FreeSlice"
	}

	const currentPlan = getCurrentPlanName()

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

			<div className="mt-8">
				<p className="mb-4">To change your subscription plan, please visit your account settings.</p>
				<Button asChild variant="default">
					<Link href="/account">Manage Subscription</Link>
				</Button>
			</div>
		</div>
	)
}
