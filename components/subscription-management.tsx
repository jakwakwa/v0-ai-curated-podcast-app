"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CreditCard, ArrowUp, ArrowDown, X, History, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useSubscriptionStore } from "@/lib/stores/subscription-store"

interface SubscriptionManagementProps {
	className?: string
}

export function SubscriptionManagement({ className }: SubscriptionManagementProps) {
	const router = useRouter()
	const { subscription, tiers, billingHistory, isLoading, upgradeSubscription, downgradeSubscription, cancelSubscription, loadBillingHistory } = useSubscriptionStore()
	const [showCancelDialog, setShowCancelDialog] = useState(false)
	const [showBillingHistory, setShowBillingHistory] = useState(false)

	// Get current plan information
	const getCurrentPlanName = () => {
		if (!subscription) return "FreeSlice"
		const currentPlan = tiers.find(tier => tier.paystackPlanCode === subscription.paystackPlanCode)
		return currentPlan?.name || "FreeSlice"
	}

	const currentPlan = getCurrentPlanName()
	const currentPlanTier = tiers.find(tier => tier.name === currentPlan)

	// Handle subscription upgrade
	const handleUpgrade = async (planCode: string) => {
		if (!planCode) {
			toast.error("No plan code provided for upgrade.")
			return
		}

		const result = await upgradeSubscription(planCode)
		if ("checkoutUrl" in result && result.checkoutUrl) {
			router.push(result.checkoutUrl)
		} else if ("error" in result) {
			toast.error(`Failed to upgrade subscription: ${result.error}`)
		}
	}

	// Handle subscription downgrade
	const handleDowngrade = async (planCode: string) => {
		if (!planCode) {
			toast.error("No plan code provided for downgrade.")
			return
		}

		const result = await downgradeSubscription(planCode)
		if ("checkoutUrl" in result && result.checkoutUrl) {
			router.push(result.checkoutUrl)
		} else if ("error" in result) {
			toast.error(`Failed to downgrade subscription: ${result.error}`)
		}
	}

	// Handle subscription cancellation
	const handleCancel = async () => {
		const result = await cancelSubscription()
		if ("success" in result) {
			toast.success("Subscription cancelled successfully")
			setShowCancelDialog(false)
			// Reload subscription data
			await useSubscriptionStore.getState().loadSubscription()
		} else if ("error" in result) {
			toast.error(`Failed to cancel subscription: ${result.error}`)
		}
	}

	// Load billing history
	const handleLoadBillingHistory = async () => {
		await loadBillingHistory()
		setShowBillingHistory(true)
	}

	// Get available upgrade options
	const getUpgradeOptions = () => {
		if (!subscription) return tiers.filter(tier => tier.price > 0)
		return tiers.filter(tier => tier.price > (currentPlanTier?.price || 0))
	}

	// Get available downgrade options
	const getDowngradeOptions = () => {
		if (!subscription) return []
		return tiers.filter(tier => tier.price < (currentPlanTier?.price || 0))
	}

	return (
		<div className={className}>
			{/* Current Plan Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<CreditCard className="h-5 w-5" />
						Current Plan
					</CardTitle>
					<CardDescription>
						Manage your subscription plan and billing information.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="p-4 border rounded-lg bg-muted/50">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium">{currentPlan}</p>
								<p className="text-sm text-muted-foreground">
									{subscription ? "Active subscription" : "Free plan"}
								</p>
								{currentPlanTier?.description && (
									<p className="text-sm text-muted-foreground mt-1">
										{currentPlanTier.description}
									</p>
								)}
							</div>
							<Badge variant={subscription ? "default" : "secondary"}>
								{subscription ? "Active" : "Free"}
							</Badge>
						</div>
					</div>

					<Separator />

					{/* Plan Actions */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Plan Actions</h3>

						{/* Upgrade Options */}
						{getUpgradeOptions().length > 0 && (
							<div className="space-y-3">
								<h4 className="text-sm font-medium text-muted-foreground">Upgrade Options</h4>
								<div className="grid gap-3">
									{getUpgradeOptions().map((tier) => (
										<Button
											key={tier.id}
											variant="outline"
											className="h-auto p-4 flex-col items-start"
											onClick={() => handleUpgrade(tier.paystackPlanCode || "")}
											disabled={isLoading}
										>
											<div className="flex items-center gap-2 w-full">
												<ArrowUp className="h-4 w-4" />
												<span className="font-medium">Upgrade to {tier.name}</span>
												<span className="ml-auto text-sm text-muted-foreground">
													${tier.price}/month
												</span>
											</div>
											<span className="text-sm text-muted-foreground mt-1">
												{tier.description}
											</span>
										</Button>
									))}
								</div>
							</div>
						)}

						{/* Downgrade Options */}
						{getDowngradeOptions().length > 0 && (
							<div className="space-y-3">
								<h4 className="text-sm font-medium text-muted-foreground">Downgrade Options</h4>
								<div className="grid gap-3">
									{getDowngradeOptions().map((tier) => (
										<Button
											key={tier.id}
											variant="outline"
											className="h-auto p-4 flex-col items-start"
											onClick={() => handleDowngrade(tier.paystackPlanCode || "")}
											disabled={isLoading}
										>
											<div className="flex items-center gap-2 w-full">
												<ArrowDown className="h-4 w-4" />
												<span className="font-medium">Downgrade to {tier.name}</span>
												<span className="ml-auto text-sm text-muted-foreground">
													${tier.price}/month
												</span>
											</div>
											<span className="text-sm text-muted-foreground mt-1">
												{tier.description}
											</span>
										</Button>
									))}
								</div>
							</div>
						)}

						{/* Billing History */}
						<Button
							variant="outline"
							className="h-auto p-4 flex-col items-start"
							onClick={handleLoadBillingHistory}
							disabled={isLoading}
						>
							<div className="flex items-center gap-2 w-full">
								<History className="h-4 w-4" />
								<span className="font-medium">Billing History</span>
							</div>
							<span className="text-sm text-muted-foreground mt-1">
								View past payments and transactions
							</span>
						</Button>

						{/* Cancel Subscription */}
						{subscription && (
							<Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
								<DialogTrigger asChild>
									<Button
										variant="outline"
										className="h-auto p-4 flex-col items-start border-destructive/20 text-destructive hover:bg-destructive/5"
									>
										<div className="flex items-center gap-2 w-full">
											<X className="h-4 w-4" />
											<span className="font-medium">Cancel Subscription</span>
										</div>
										<span className="text-sm text-muted-foreground mt-1">
											Cancel your subscription (access until end of billing period)
										</span>
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle className="flex items-center gap-2">
											<AlertTriangle className="h-5 w-5 text-destructive" />
											Cancel Subscription
										</DialogTitle>
										<DialogDescription>
											Are you sure you want to cancel your subscription? You'll continue to have access to premium features until the end of your current billing period.
										</DialogDescription>
									</DialogHeader>
									<DialogFooter>
										<Button variant="outline" onClick={() => setShowCancelDialog(false)}>
											Keep Subscription
										</Button>
										<Button variant="destructive" onClick={handleCancel} disabled={isLoading}>
											{isLoading ? "Cancelling..." : "Cancel Subscription"}
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						)}
					</div>

					<Separator />

					{/* Subscription Details */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Subscription Details</h3>
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<p className="text-sm font-medium">Status</p>
								<p className="text-sm text-muted-foreground">
									{subscription?.status || "Free"}
								</p>
							</div>
							<div className="space-y-2">
								<p className="text-sm font-medium">Next Billing Date</p>
								<p className="text-sm text-muted-foreground">
									{subscription?.currentPeriodEnd
										? new Date(subscription.currentPeriodEnd).toLocaleDateString()
										: "N/A"}
								</p>
							</div>
							{subscription?.trialEnd && (
								<div className="space-y-2">
									<p className="text-sm font-medium">Trial Ends</p>
									<p className="text-sm text-muted-foreground">
										{new Date(subscription.trialEnd).toLocaleDateString()}
									</p>
								</div>
							)}
							{subscription?.canceledAt && (
								<div className="space-y-2">
									<p className="text-sm font-medium">Cancelled On</p>
									<p className="text-sm text-muted-foreground">
										{new Date(subscription.canceledAt).toLocaleDateString()}
									</p>
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Billing History Dialog */}
			<Dialog open={showBillingHistory} onOpenChange={setShowBillingHistory}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<History className="h-5 w-5" />
							Billing History
						</DialogTitle>
						<DialogDescription>
							View your past payments and subscription changes.
						</DialogDescription>
					</DialogHeader>
					<div className="max-h-96 overflow-y-auto">
						{billingHistory.length === 0 ? (
							<div className="text-center py-8">
								<p className="text-muted-foreground">No billing history available.</p>
							</div>
						) : (
							<div className="space-y-3">
								{billingHistory.map((item) => (
									<div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
										<div className="space-y-1">
											<p className="font-medium">{item.description}</p>
											<p className="text-sm text-muted-foreground">
												{new Date(item.date).toLocaleDateString()}
											</p>
										</div>
										<div className="text-right">
											<p className="font-medium">
												{item.amount > 0 ? `$${item.amount.toFixed(2)}` : "Free"}
											</p>
											<Badge variant={item.status === "active" ? "default" : "secondary"}>
												{item.status}
											</Badge>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
