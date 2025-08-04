"use client"

import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
		<Card variant="glass" className="w-full lg:w-full lg:min-w-screen/[60%] lg:max-w-[1200px] h-auto mb-0 mt-12 px-12 pt-12">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
				<p className="text-muted-foreground">Manage your subscription, billing, and account preferences.</p>
				<div className="flex items-center justify-between mt-4 p-4 bg-card rounded-lg">
					<p className="text-sm">
						<strong>Current Plan:</strong> {currentPlan} <span className="text-muted-foreground">({currentPlan})</span>
					</p>
					<Button variant="default" size="sm">
						Manage Subscription
					</Button>
				</div>
			</div>
		</Card>
	)
}
