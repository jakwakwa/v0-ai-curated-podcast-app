"use client"

import { AlertTriangle, ArrowDown, ArrowUp, CreditCard, History, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useSubscriptionStore } from "@/lib/stores/subscription-store"
import styles from "./subscription-management.module.css"

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
					<CardTitle className={styles.cardTitle}>
						<CreditCard className={styles.iconMuted} />
						Current Plan
					</CardTitle>
					<CardDescription>Manage your subscription plan and billing information.</CardDescription>
				</CardHeader>
				<CardContent className={styles.cardContentSpaceY6}>
					<div className={styles.planBox}>
						<div className={styles.flexBetween}>
							<div>
								<p className={styles.fontMedium}>{currentPlan}</p>
								<p className={styles.textSmMuted}>{subscription ? "Active subscription" : "Free plan"}</p>
								{currentPlanTier?.description && <p className={`${styles.textSmMuted} ${styles.mt1}`}>{currentPlanTier.description}</p>}
							</div>
							<Badge variant={subscription ? "default" : "secondary"}>{subscription ? "Active" : "Free"}</Badge>
						</div>
					</div>

					<Separator />

					{/* Plan Actions */}
					<div className={styles.sectionSpaceY4}>
						<h3 className={styles.textLgSemibold}>Plan Actions</h3>

						{/* Upgrade Options */}
						{getUpgradeOptions().length > 0 && (
							<div className={styles.sectionSpaceY3}>
								<h4 className={styles.textSmMediumMuted}>Upgrade Options</h4>
								<div className={styles.gridGap3}>
									{getUpgradeOptions().map(tier => (
										<Button key={tier.id} variant="outline" className={styles.buttonUpgrade} onClick={() => handleUpgrade(tier.paystackPlanCode || "")} disabled={isLoading}>
											<div className={styles.flexRow}>
												<ArrowUp className={styles.iconSmall} />
												<span className={styles.fontMedium}>Upgrade to {tier.name}</span>
												<span className={styles.mlAuto}>${tier.price}/month</span>
											</div>
											<span className={`${styles.textSmMuted} ${styles.mt1}`}>{tier.description}</span>
										</Button>
									))}
								</div>
							</div>
						)}

						{/* Downgrade Options */}
						{getDowngradeOptions().length > 0 && (
							<div className={styles.sectionSpaceY3}>
								<h4 className={styles.textSmMediumMuted}>Downgrade Options</h4>
								<div className={styles.gridGap3}>
									{getDowngradeOptions().map(tier => (
										<Button key={tier.id} variant="outline" className={styles.buttonUpgrade} onClick={() => handleDowngrade(tier.paystackPlanCode || "")} disabled={isLoading}>
											<div className={styles.flexRow}>
												<ArrowDown className={styles.iconSmall} />
												<span className={styles.fontMedium}>Downgrade to {tier.name}</span>
												<span className={styles.mlAuto}>${tier.price}/month</span>
											</div>
											<span className={`${styles.textSmMuted} ${styles.mt1}`}>{tier.description}</span>
										</Button>
									))}
								</div>
							</div>
						)}

						{/* Billing History */}
						<Button variant="outline" className={styles.buttonUpgrade} onClick={handleLoadBillingHistory} disabled={isLoading}>
							<div className={styles.flexRow}>
								<History className={styles.iconSmall} />
								<span className={styles.fontMedium}>Billing History</span>
							</div>
							<span className={`${styles.textSmMuted} ${styles.mt1}`}>View past payments and transactions</span>
						</Button>

						{/* Cancel Subscription */}
						{subscription && (
							<Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
								<DialogTrigger asChild>
									<Button variant="outline" className={`${styles.buttonUpgrade} ${styles.textDestructive}`}>
										<div className={styles.flexRow}>
											<X className={styles.iconSmall} />
											<span className={styles.fontMedium}>Cancel Subscription</span>
										</div>
										<span className={`${styles.textSmMuted} ${styles.mt1}`}>Cancel your subscription (access until end of billing period)</span>
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle className={styles.cardTitle}>
											<AlertTriangle className={`${styles.iconMuted} ${styles.textDestructive}`} />
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
					<div className={styles.sectionSpaceY4}>
						<h3 className={styles.textLgSemibold}>Subscription Details</h3>
						<div className={styles.grid2}>
							<div className={styles.sectionSpaceY2}>
								<p className={styles.textSmMediumMuted}>Status</p>
								<p className={styles.textSmMuted}>{subscription?.status || "Free"}</p>
							</div>
							<div className={styles.sectionSpaceY2}>
								<p className={styles.textSmMediumMuted}>Next Billing Date</p>
								<p className={styles.textSmMuted}>{subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : "N/A"}</p>
							</div>
							{subscription?.trialEnd && (
								<div className={styles.sectionSpaceY2}>
									<p className={styles.textSmMediumMuted}>Trial Ends</p>
									<p className={styles.textSmMuted}>{new Date(subscription.trialEnd).toLocaleDateString()}</p>
								</div>
							)}
							{subscription?.canceledAt && (
								<div className={styles.sectionSpaceY2}>
									<p className={styles.textSmMediumMuted}>Cancelled On</p>
									<p className={styles.textSmMuted}>{new Date(subscription.canceledAt).toLocaleDateString()}</p>
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Billing History Dialog */}
			<Dialog open={showBillingHistory} onOpenChange={setShowBillingHistory}>
				<DialogContent className={styles.maxW2xl}>
					<DialogHeader>
						<DialogTitle className={styles.cardTitle}>
							<History className={styles.iconMuted} />
							Billing History
						</DialogTitle>
						<DialogDescription>View your past payments and subscription changes.</DialogDescription>
					</DialogHeader>
					<div className={styles.maxH96}>
						{billingHistory.length === 0 ? (
							<div className={styles.textCenterPy8}>
								<p className={styles.textSmMuted}>No billing history available.</p>
							</div>
						) : (
							<div className={styles.sectionSpaceY3}>
								{billingHistory.map(item => (
									<div key={item.id} className={styles.billingHistoryItem}>
										<div className={styles.spaceY1}>
											<p className={styles.fontMedium}>{item.description}</p>
											<p className={styles.textSmMuted}>{new Date(item.date).toLocaleDateString()}</p>
										</div>
										<div className={styles.textRight}>
											<p className={styles.fontMedium}>{item.amount > 0 ? `$${item.amount.toFixed(2)}` : "Free"}</p>
											<Badge variant={item.status === "active" ? "default" : "secondary"}>{item.status}</Badge>
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
