"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSubscriptionStore } from "@/lib/stores/subscription-store"
import styles from "./subscription-test-controls.module.css"

export function SubscriptionTestControls() {
	const { setSubscription, subscription } = useSubscriptionStore()
	const [isVisible, setIsVisible] = useState(false)

	// Mock subscription states for testing
	const mockSubscriptions = {
		free: null,
		trial: {
			id: "sub_trial_123",
			userId: "user_123456789",
			paystackSubscriptionCode: "SUB_TRIAL_001",
			paystackPlanCode: "PLN_CASUAL_001",
			status: "trialing" as const,
			currentPeriodStart: new Date("2024-01-01"),
			currentPeriodEnd: new Date("2024-02-01"),
			trialStart: new Date("2023-12-15"),
			trialEnd: new Date("2024-01-15"),
			canceledAt: null,
			createdAt: new Date("2023-12-15"),
			updatedAt: new Date("2024-01-01"),
		},
		casual: {
			id: "sub_casual_123",
			userId: "user_123456789",
			paystackSubscriptionCode: "SUB_CASUAL_001",
			paystackPlanCode: "PLN_CASUAL_001",
			status: "active" as const,
			currentPeriodStart: new Date("2024-01-01"),
			currentPeriodEnd: new Date("2024-02-01"),
			trialStart: new Date("2023-12-15"),
			trialEnd: new Date("2024-01-01"),
			canceledAt: null,
			createdAt: new Date("2023-12-15"),
			updatedAt: new Date("2024-01-01"),
		},
		premium: {
			id: "sub_premium_123",
			userId: "user_123456789",
			paystackSubscriptionCode: "SUB_PREMIUM_001",
			paystackPlanCode: "PLN_PREMIUM_001",
			status: "active" as const,
			currentPeriodStart: new Date("2024-01-01"),
			currentPeriodEnd: new Date("2024-02-01"),
			trialStart: new Date("2023-12-15"),
			trialEnd: new Date("2024-01-01"),
			canceledAt: null,
			createdAt: new Date("2023-12-15"),
			updatedAt: new Date("2024-01-01"),
		},
		canceled: {
			id: "sub_canceled_123",
			userId: "user_123456789",
			paystackSubscriptionCode: "SUB_CANCELED_001",
			paystackPlanCode: "PLN_CASUAL_001",
			status: "canceled" as const,
			currentPeriodStart: new Date("2024-01-01"),
			currentPeriodEnd: new Date("2024-02-01"),
			trialStart: new Date("2023-12-15"),
			trialEnd: new Date("2024-01-01"),
			canceledAt: new Date("2024-01-15"),
			createdAt: new Date("2023-12-15"),
			updatedAt: new Date("2024-01-15"),
		},
	}

	const getCurrentPlanName = () => {
		if (!subscription) return "FreeSlice"
		const planCodes: Record<string, string> = {
			PLN_CASUAL_001: "Casual Listener",
			PLN_PREMIUM_001: "Curate & Control",
		}
		return planCodes[subscription.paystackPlanCode || ""] || "FreeSlice"
	}

	return (
		<div className={styles.fixedPanel}>
			{/* Toggle Button */}
			<Button onClick={() => setIsVisible(!isVisible)} variant="outline" size="sm" className={styles.toggleButton}>
				{isVisible ? "Hide" : "Show"} Test Controls
			</Button>

			{/* Test Controls Panel */}
			{isVisible && (
				<Card className={styles.panelCard}>
					<CardHeader className={styles.headerPadding}>
						<CardTitle className={styles.titleSm}>Subscription Test Controls</CardTitle>
						<CardDescription className={styles.descXs}>Switch between different subscription states for testing</CardDescription>
					</CardHeader>
					<CardContent className={styles.contentSpaceY3}>
						{/* Current State Display */}
						<div className={styles.stateBox}>
							<strong>Current:</strong> {subscription ? getCurrentPlanName() : "FreeSlice"}
							<br />
							<strong>Status:</strong> {subscription?.status || "Free"}
						</div>

						{/* Test Buttons */}
						<div className={styles.grid2}>
							<Button variant="outline" size="sm" onClick={() => setSubscription(mockSubscriptions.free)} className={styles.buttonXs}>
								FreeSlice
							</Button>
							<Button variant="outline" size="sm" onClick={() => setSubscription(mockSubscriptions.trial)} className={styles.buttonXs}>
								Trial
							</Button>
							<Button variant="outline" size="sm" onClick={() => setSubscription(mockSubscriptions.casual)} className={styles.buttonXs}>
								Casual
							</Button>
							<Button variant="outline" size="sm" onClick={() => setSubscription(mockSubscriptions.premium)} className={styles.buttonXs}>
								Premium
							</Button>
							<Button variant="outline" size="sm" onClick={() => setSubscription(mockSubscriptions.canceled)} className={styles.buttonXs}>
								Canceled
							</Button>
						</div>

						{/* Status Badges */}
						<div className={styles.flexWrapGap1}>
							<Badge variant="secondary" className={styles.buttonXs}>
								{subscription?.status || "Free"}
							</Badge>
							{subscription?.trialEnd && (
								<Badge variant="outline" className={styles.buttonXs}>
									Trial
								</Badge>
							)}
							{subscription?.canceledAt && (
								<Badge variant="destructive" className={styles.buttonXs}>
									Canceled
								</Badge>
							)}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
}
