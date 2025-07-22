"use client"

import { ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SubscriptionData {
	subscription: {
		id: string
		status: string
		currentPeriodStart: string
		currentPeriodEnd: string
	}
	plan: {
		name: string
		features: string[]
	}
	hasActiveSubscription: boolean
}

export default function SubscriptionSuccessPage() {
	const searchParams = useSearchParams()
	const sessionId = searchParams.get("session_id")
	const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
	const [loading, setLoading] = useState(true)

	const fetchSubscriptionData = useCallback(async () => {
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
	}, [])

	useEffect(() => {
		if (sessionId) {
			fetchSubscriptionData()
		}
	}, [sessionId, fetchSubscriptionData])

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-12">
				<div className="flex justify-center items-center min-h-[400px]">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
						<p>Processing your subscription...</p>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="mx-auto">
				<Card className="text-center">
					<CardHeader>
						<div className="mx-auto mb-4">
							<CheckCircle2 className="h-16 w-16 text-green-500" />
						</div>
						<CardTitle className="text-3xl">Welcome to {subscriptionData?.plan?.name || "Premium"}!</CardTitle>
						<CardDescription>Your subscription has been successfully activated.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="bg-muted p-4 rounded-lg">
							<h3 className="font-semibold mb-2">What's included in your plan:</h3>
							<ul className="text-sm space-y-1">
								{subscriptionData?.plan?.features?.map((feature: string, index: number) => (
									<li key={index} className="flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 text-green-500" />
										{feature}
									</li>
								))}
							</ul>
						</div>

						<div className="space-y-4">
							<p className="text-sm text-muted-foreground">You can now access all premium features. Manage your subscription anytime in your account settings.</p>

							<div className="flex flex-col sm:flex-row gap-3 justify-center">
								<Button asChild>
									<Link href="/dashboard">
										Start Using Premium Features
										<ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
								<Button variant="outline" asChild>
									<Link href="/subscription">Manage Subscription</Link>
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
