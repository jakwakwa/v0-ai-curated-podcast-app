import { StripeService, SUBSCRIPTION_PLANS } from "@/lib/stripe-service"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET() {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		// Fetch subscription once and derive other values from it (optimization)
		const subscription = await StripeService.getUserSubscription(userId)
		const hasActiveSubscription = StripeService.isSubscriptionActive(subscription)
		
		// Determine plan from subscription data to avoid another DB call
		let plan
		if (hasActiveSubscription && subscription) {
			// Find plan by price ID
			const foundPlan = Object.values(SUBSCRIPTION_PLANS).find(
				p => p.stripePriceId === subscription.linkPriceId
			)
			plan = foundPlan || SUBSCRIPTION_PLANS.FREE
		} else {
			plan = SUBSCRIPTION_PLANS.FREE
		}

		return NextResponse.json({
			subscription,
			plan,
			hasActiveSubscription
		})
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		console.error("[SUBSCRIPTION_GET]", message)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
