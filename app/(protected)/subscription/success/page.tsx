"use client"

import { ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { AppSpinner } from "@/components/ui/app-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSubscriptionStore } from "@/lib/stores/subscription-store"

export default function SubscriptionSuccessPage() {
	const { subscription, tiers, loadSubscription } = useSubscriptionStore()
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchSub = async () => {
			await loadSubscription()
			setLoading(false)
		}
		fetchSub()
	}, [loadSubscription])

	const currentPlan = tiers.find(tier => tier.paystackPlanCode === subscription?.paystackPlanCode)

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-12">
				<div className="flex justify-center items-center min-h-[400px]">
					<AppSpinner size="lg" label="Finalizing your subscription..." />
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
						<CardTitle className="text-3xl">Welcome to {currentPlan?.name || "Premium"}!</CardTitle>
						<CardDescription>Your subscription has been successfully activated.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="bg-muted p-4 rounded-lg">
							<h3 className="font-semibold mb-2">What's included in your plan:</h3>
							<ul className="text-sm space-y-1">
								{currentPlan?.features?.map((feature: string, index: number) => (
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
								<Button asChild variant="default">
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
