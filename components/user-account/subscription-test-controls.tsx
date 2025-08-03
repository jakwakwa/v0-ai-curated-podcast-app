"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSubscriptionStore } from "@/lib/stores/subscription-store"

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
		<div className="fixed bottom-4 right-4 z-50">
			{/* Toggle Button */}
			<Button onClick={() => setIsVisible(!isVisible)} variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm">
				{isVisible ? "Hide" : "Show"} Test Controls
			</Button>

			{/* Test Controls Panel */}
			{isVisible && (
				<Card className="w-80 mt-2 bg-background/95 backdrop-blur-sm border-2">
					<CardHeader className="pb-3">
						<CardTitle className="text-sm">Subscription Test Controls</CardTitle>
						<CardDescription className="text-xs">Switch between different subscription states for testing</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{/* Current State Display */}
						<div className="p-2 bg-muted rounded-md text-xs">
							<strong>Current:</strong> {subscription ? getCurrentPlanName() : "FreeSlice"}
							<br />
							<strong>Status:</strong> {subscription?.status || "Free"}
						</div>

						{/* Test Buttons */}
						<div className="grid grid-cols-2 gap-2">
							<Button variant="outline" size="sm" onClick={() => setSubscription(mockSubscriptions.free)} className="text-xs">
								FreeSlice
							</Button>
							<Button variant="outline" size="sm" onClick={() => setSubscription(mockSubscriptions.trial)} className="text-xs">
								Trial
							</Button>
							<Button variant="outline" size="sm" onClick={() => setSubscription(mockSubscriptions.casual)} className="text-xs">
								Casual
							</Button>
							<Button variant="outline" size="sm" onClick={() => setSubscription(mockSubscriptions.premium)} className="text-xs">
								Premium
							</Button>
							<Button variant="outline" size="sm" onClick={() => setSubscription(mockSubscriptions.canceled)} className="text-xs">
								Canceled
							</Button>
						</div>

						{/* Status Badges */}
						<div className="flex flex-wrap gap-1">
							<Badge variant="secondary" className="text-xs">
								{subscription?.status || "Free"}
							</Badge>
							{subscription?.trialEnd && (
								<Badge variant="outline" className="text-xs">
									Trial
								</Badge>
							)}
							{subscription?.canceledAt && (
								<Badge variant="destructive" className="text-xs">
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
