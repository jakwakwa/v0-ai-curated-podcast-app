"use client"

import { useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SubscriptionManagement } from "@/components/user-account/subscription-management"
import { SubscriptionTestControls } from "@/components/user-account/subscription-test-controls"
import { useSubscriptionStore } from "@/lib/stores/subscription-store"

export default function SubscriptionTestPage() {
	const { subscription, tiers, loadSubscription, billingHistory, loadBillingHistory } = useSubscriptionStore()

	// Load subscription data on mount
	useEffect(() => {
		loadSubscription()
		loadBillingHistory()
	}, [loadSubscription, loadBillingHistory])

	const getCurrentPlanName = () => {
		if (!subscription) return "FreeSlice"
		const currentPlan = tiers.find(tier => tier.paystackPlanCode === subscription.paystackPlanCode)
		return currentPlan?.name || "FreeSlice"
	}

	return (
		<>
			<div className="container mx-auto px-2 md:px-4 py-8 max-w-6xl">
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight">Subscription Test Page</h1>
					<p className="text-muted-foreground">Test all subscription management functionality with mock data</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					{/* Current Subscription Status */}
					<Card>
						<CardHeader>
							<CardTitle>Current Subscription Status</CardTitle>
							<CardDescription>Real-time subscription information and computed properties</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-4">
								<div className="flex items-center justify-between">
									<span className="font-medium">Plan:</span>
									<Badge variant="outline" size="sm">
										{getCurrentPlanName()}
									</Badge>
								</div>
								<div className="flex items-center justify-between">
									<span className="font-medium">Status:</span>
									<Badge variant={subscription?.status === "active" ? "default" : "secondary"} size="sm">
										{subscription?.status || "Free"}
									</Badge>
								</div>
								<div className="flex items-center justify-between">
									<span className="font-medium">Subscription ID:</span>
									<span className="text-sm text-muted-foreground">{subscription?.id || "N/A"}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="font-medium">Paystack Code:</span>
									<span className="text-sm text-muted-foreground">{subscription?.paystackPlanCode || "N/A"}</span>
								</div>
								{subscription?.currentPeriodEnd && (
									<div className="flex items-center justify-between">
										<span className="font-medium">Next Billing:</span>
										<span className="text-sm text-muted-foreground">{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</span>
									</div>
								)}
								{subscription?.trialEnd && (
									<div className="flex items-center justify-between">
										<span className="font-medium">Trial Ends:</span>
										<span className="text-sm text-muted-foreground">{new Date(subscription.trialEnd).toLocaleDateString()}</span>
									</div>
								)}
								{subscription?.canceledAt && (
									<div className="flex items-center justify-between">
										<span className="font-medium">Canceled On:</span>
										<span className="text-sm text-muted-foreground">{new Date(subscription.canceledAt).toLocaleDateString()}</span>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Available Plans */}
					<Card>
						<CardHeader>
							<CardTitle>Available Plans</CardTitle>
							<CardDescription>All subscription tiers and their features</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{tiers.map(tier => (
								<div key={tier.id} className="p-4 border rounded-lg">
									<div className="flex items-center justify-between mb-2">
										<h3 className="font-medium">{tier.name}</h3>
										<Badge variant={tier.popular ? "default" : "secondary"} size="sm">
											${tier.price}/month
										</Badge>
									</div>
									<p className="text-sm text-muted-foreground mb-2">{tier.description}</p>
									<div className="flex flex-wrap gap-1">
										{tier.features.map((feature, index) => (
											<Badge key={index} variant="outline" size="sm" className="text-xs">
												{feature}
											</Badge>
										))}
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</div>

				<Separator className="my-8" />

				{/* Billing History */}
				<Card>
					<CardHeader>
						<CardTitle>Billing History</CardTitle>
						<CardDescription>Past payments and subscription changes</CardDescription>
					</CardHeader>
					<CardContent>
						{billingHistory.length === 0 ? (
							<p className="text-muted-foreground text-center py-8">No billing history available</p>
						) : (
							<div className="space-y-3">
								{billingHistory.map(item => (
									<div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
										<div className="space-y-1">
											<p className="font-medium">{item.description}</p>
											<p className="text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
										</div>
										<div className="text-right">
											<p className="font-medium">{item.amount > 0 ? `$${item.amount.toFixed(2)}` : "Free"}</p>
											<Badge variant={item.status === "active" ? "default" : "secondary"} size="sm">
												{item.status}
											</Badge>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				<Separator className="my-8" />

				{/* Subscription Management Component */}
				<Card>
					<CardHeader>
						<CardTitle>Subscription Management</CardTitle>
						<CardDescription>Full subscription management interface with all features</CardDescription>
					</CardHeader>
					<CardContent>
						<SubscriptionManagement />
					</CardContent>
				</Card>
			</div>

			{/* Test Controls */}
			<SubscriptionTestControls />
		</>
	)
}
