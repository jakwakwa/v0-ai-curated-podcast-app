"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PADDLE_PRODUCTS } from "@/lib/paddle"
import { useSubscriptionStore } from "@/lib/stores/subscription-store-paddlejs"

export function SubscriptionManagement() {
	const { status, plan, trialEndsAt, cancelAtPeriodEnd, nextBillDate, isLoading, error, cancelSubscription, resumeSubscription, updatePaymentMethod, updateSubscription } = useSubscriptionStore()

	const formatDate = (date: Date | null) => {
		if (!date) return ""
		return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date)
	}

	const getPlanDetails = () => {
		switch (plan) {
			case "free_slice":
				return {
					plan_id: "free_slice",
					price: "",
					price_id: "",
					features: ["Advanced Curation", "Priority Recommendations", "Custom Playlists", "14-day Trial"],
				}
			case "casual_listener":
				return {
					plan_id: "Casual Listener",
					// price: "$6.95/month",
					price_id: "",
					features: ["AI-Curated Podcasts", "Basic Recommendations", "14-day Trial"],
				}
			case "curate_control":
				return {
					plan_id: "Curate Control",
					// price: "$6.95/month",
					price_id: "",
					features: ["Advanced Curation", "Priority Recommendations", "Custom Playlists", "14-day Trial"],
				}
			default:
				return null
		}
	}

	const planDetails = getPlanDetails()

	if (isLoading) {
		return <div>Loading subscription details...</div>
	}

	if (error) {
		return <div className="text-red-500">Error: {error}</div>
	}

	if (!status || status === "inactive") {
		return (
			<Card>
				<CardHeader>
					<CardTitle>No Active Subscription</CardTitle>
					<CardDescription>Choose a plan to get started</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Button onClick={() => updateSubscription(PADDLE_PRODUCTS.FREE_SLICE)} className="w-full" variant="default">
						Subscribe to Free Slice
					</Button>
					<Button onClick={() => updateSubscription(PADDLE_PRODUCTS.CASUAL_LISTENER)} className="w-full" variant="default">
						Subscribe to Casual Listener
					</Button>
					<Button onClick={() => updateSubscription(PADDLE_PRODUCTS.CURATE_CONTROL)} className="w-full" variant="outline">
						Subscribe to Curate & Control
					</Button>

					<div className="pt-4 border-t">
						<p className="text-xs text-muted-foreground text-center mb-2">
							By subscribing, you agree to our{" "}
							<Link href="/terms" className="text-primary hover:underline">
								Terms of Service
							</Link>{" "}
							and{" "}
							<Link href="/privacy" className="text-primary hover:underline">
								Privacy Policy
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Your Subscription</CardTitle>
				<CardDescription>{status === "trialing" ? `Trial ends on ${formatDate(trialEndsAt)}` : `Next billing date: ${formatDate(nextBillDate)}`}</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{planDetails && (
					<div>
						<h3 className="text-lg font-semibold">{planDetails.name}</h3>
						<p className="text-sm text-gray-500">{planDetails.price}</p>
						<ul className="mt-2 space-y-1">
							{planDetails.features.map((feature, index) => (
								<li key={index} className="text-sm">
									✓ {feature}
								</li>
							))}
						</ul>
					</div>
				)}

				<div className="space-y-2">
					{cancelAtPeriodEnd ? (
						<>
							<p className="text-sm text-amber-600">Your subscription will cancel on {formatDate(nextBillDate)}</p>
							<Button onClick={resumeSubscription} className="w-full" variant="default">
								Resume Subscription
							</Button>
						</>
					) : (
						<Button onClick={cancelSubscription} variant="destructive" className="w-full">
							Cancel Subscription
						</Button>
					)}

					<Button onClick={updatePaymentMethod} variant="outline" className="w-full">
						Update Payment Method
					</Button>

					{plan === "casual_listener" && (
						<Button onClick={() => updateSubscription(PADDLE_PRODUCTS.CURATE_CONTROL)} className="w-full" variant="default">
							Upgrade to Curate & Control
						</Button>
					)}
				</div>

				<div className="pt-4 border-t">
					<p className="text-xs text-muted-foreground text-center mb-2">
						By subscribing, you agree to our{" "}
						<Link href="/terms" className="text-primary hover:underline">
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link href="/privacy" className="text-primary hover:underline">
							Privacy Policy
						</Link>
					</p>
				</div>
			</CardContent>
		</Card>
	)
}
