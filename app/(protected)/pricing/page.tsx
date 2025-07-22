"use client"

import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckIcon } from "lucide-react"
import { SUBSCRIPTION_PLANS } from "@/lib/stripe-client"

export default function PricingPage() {
	const { user, isLoaded } = useUser()
	const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

	const handleSubscribe = async (planId: string) => {
		if (!user) {
			// Redirect to sign in
			window.location.href = "/sign-in"
			return
		}

		setLoadingPlan(planId)

		try {
			const response = await fetch("/api/subscription/create-checkout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					planId,
					successUrl: `${window.location.origin}/subscription/success`,
					cancelUrl: `${window.location.origin}/pricing`,
				}),
			})

			const data = await response.json()

			if (response.ok && data.checkoutUrl) {
				window.location.href = data.checkoutUrl
			} else {
				throw new Error(data.error || "Failed to create checkout session")
			}
		} catch (error) {
			console.error("Error creating checkout session:", error)
			alert("Failed to start checkout process. Please try again.")
		} finally {
			setLoadingPlan(null)
		}
	}

	const plans = Object.values(SUBSCRIPTION_PLANS).filter(plan => plan.id !== 'free')

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold tracking-tight mb-4">
					Choose Your Plan
				</h1>
				<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
					Unlock the full potential of AI-powered podcast curation with our flexible subscription plans.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
				{plans.map((plan) => (
					<Card
						key={plan.id}
						className={`relative ${
							plan.id === "pro" ? "border-2 border-primary shadow-lg scale-105" : ""
						}`}
					>
						{plan.id === "pro" && (
							<Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
								Most Popular
							</Badge>
						)}
						<CardHeader className="text-center">
							<CardTitle className="text-2xl">{plan.name}</CardTitle>
							<CardDescription className="text-sm">
								{plan.description}
							</CardDescription>
							<div className="mt-4">
								<span className="text-4xl font-bold">
									${(plan.price / 100).toFixed(2)}
								</span>
								<span className="text-muted-foreground">/{plan.interval}</span>
							</div>
						</CardHeader>
						<CardContent>
							<ul className="space-y-3">
								{plan.features.map((feature, index) => (
									<li key={index} className="flex items-center gap-3">
										<CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
										<span className="text-sm">{feature}</span>
									</li>
								))}
							</ul>
						</CardContent>
						<CardFooter>
							<Button
								className="w-full"
								onClick={() => handleSubscribe(plan.id)}
								disabled={loadingPlan === plan.id || !isLoaded}
								variant={plan.id === "pro" ? "default" : "outline"}
							>
								{loadingPlan === plan.id
									? "Processing..."
									: `Get ${plan.name}`}
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>

			<div className="mt-16 text-center">
				<h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
					<div className="text-left">
						<h3 className="font-semibold mb-2">Can I change my plan anytime?</h3>
						<p className="text-sm text-muted-foreground">
							Yes, you can upgrade or downgrade your plan at any time through your account settings.
						</p>
					</div>
					<div className="text-left">
						<h3 className="font-semibold mb-2">Is there a free trial?</h3>
						<p className="text-sm text-muted-foreground">
							All paid plans come with a 7-day free trial. No credit card required to start.
						</p>
					</div>
					<div className="text-left">
						<h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
						<p className="text-sm text-muted-foreground">
							We accept all major credit cards through our secure Stripe payment system.
						</p>
					</div>
					<div className="text-left">
						<h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
						<p className="text-sm text-muted-foreground">
							Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing cycle.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
