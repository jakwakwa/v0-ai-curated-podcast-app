import { StripeService } from "@/lib/stripe-service"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const { returnUrl } = await request.json()

		if (!returnUrl) {
			return new NextResponse("Return URL is required", { status: 400 })
		}

		const subscription = await StripeService.getUserSubscription(userId)

		if (!subscription?.linkCustomerId) {
			return new NextResponse("No active subscription found", { status: 404 })
		}

		const portalUrl = await StripeService.createBillingPortalSession(
			subscription.linkCustomerId,
			returnUrl
		)

		return NextResponse.json({ url: portalUrl })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		console.error("[SUBSCRIPTION_BILLING_PORTAL_POST]", message)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
