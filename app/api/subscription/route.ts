import { StripeService } from "@/lib/stripe-service"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET() {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const subscription = await StripeService.getUserSubscription(userId)
		const plan = await StripeService.getUserPlan(userId)
		const hasActiveSubscription = await StripeService.hasActiveSubscription(userId)

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
