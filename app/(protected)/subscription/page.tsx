"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, CreditCard, Settings, Zap } from "lucide-react"
import Link from "next/link"

interface SubscriptionData {
	subscription: any
	plan: any
	hasActiveSubscription: boolean
}

export default function SubscriptionPage() {
	const { user } = useUser()
	const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetchSubscriptionData()
	}, [])

	const fetchSubscriptionData = async () => {
		try {
			const response = await fetch("/api/subscription")
			if (response.ok) {
				const data = await response.json()
				setSubscriptionData(data)
			}
		} catch (error) {
			console.error("Error fetching subscription data:", error)
		} finally {
			setLoading(false)
		}
	}

	const handleManageBilling = async () => {
		try {
			const response = await fetch("/api/subscription/billing-portal", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					returnUrl: window.location.href,
				}),
			})

			const data = await response.json()

			if (response.ok && data.url) {
				window.location.href = data.url
			} else {
				alert("Unable to access billing portal. Please try again.")
			}
		} catch (error) {
			console.error("Error accessing billing portal:", error)
			alert("Error accessing billing portal. Please try again.")
		}
	}

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="animate-pulse space-y-6">
					<div className="h-8 bg-muted rounded w-1/3"></div>
					<div className="h-32 bg-muted rounded"></div>
					<div className="h-24 bg-muted rounded"></div>
				</div>
			</div>
		)
	}

	const { subscription, plan, hasActiveSubscription } = subscriptionData || {}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-4xl mx-auto space-y-8">
				<div>
					<h1 className="text-3xl font-bold">Subscription Management</h1>
					<p className="text-muted-foreground mt-2">
						Manage your subscription and billing preferences
					</p>
				</div>

				{/* Current Plan */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="flex items-center gap-2">
									<Zap className="h-5 w-5" />
									Current Plan
								</CardTitle>
								<CardDescription>
									Your active subscription plan and features
								</CardDescription>
							</div>
							<Badge
								variant={hasActiveSubscription ? "default" : "secondary"}
							>
								{hasActiveSubscription ? "Active" : "Free"}
							</Badge>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<h3 className="font-semibold text-lg">{plan?.name || "Free Plan"}</h3>
							<p className="text-muted-foreground">{plan?.description}</p>
							{plan?.price > 0 && (
								<p className="text-2xl font-bold mt-2">
									${(plan.price / 100).toFixed(2)}
									<span className="text-sm font-normal text-muted-foreground">
										/{plan.interval}
									</span>
								</p>
							)}
						</div>

						{plan?.features && (
							<div>
								<h4 className="font-medium mb-2">Plan Features:</h4>
								<ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
									{plan.features.map((feature: string, index: number) => (
										<li key={index} className="flex items-center gap-2 text-sm">
											<div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
											{feature}
										</li>
									))}
								</ul>
							</div>
						)}

						<div className="flex gap-3 pt-4">
							{hasActiveSubscription ? (
								<Button onClick={handleManageBilling}>
									<CreditCard className="mr-2 h-4 w-4" />
									Manage Billing
								</Button>
							) : (
								<Button asChild>
									<Link href="/pricing">
										<Zap className="mr-2 h-4 w-4" />
										Upgrade Plan
									</Link>
								</Button>
							)}
							<Button variant="outline" asChild>
								<Link href="/pricing">
									<Settings className="mr-2 h-4 w-4" />
									View All Plans
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Subscription Details */}
				{subscription && hasActiveSubscription && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<CalendarDays className="h-5 w-5" />
								Subscription Details
							</CardTitle>
							<CardDescription>
								Information about your current subscription
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<h4 className="font-medium">Status</h4>
									<p className="text-sm text-muted-foreground capitalize">
										{subscription.status}
									</p>
								</div>
								<div>
									<h4 className="font-medium">Next Billing Date</h4>
									<p className="text-sm text-muted-foreground">
										{subscription.currentPeriodEnd
											? new Date(subscription.currentPeriodEnd).toLocaleDateString()
											: "N/A"}
									</p>
								</div>
								{subscription.trialEnd && (
									<div>
										<h4 className="font-medium">Trial End</h4>
										<p className="text-sm text-muted-foreground">
											{new Date(subscription.trialEnd).toLocaleDateString()}
										</p>
									</div>
								)}
								<div>
									<h4 className="font-medium">Subscription Started</h4>
									<p className="text-sm text-muted-foreground">
										{subscription.createdAt
											? new Date(subscription.createdAt).toLocaleDateString()
											: "N/A"}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	)
}
