import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { StripeService } from "@/lib/stripe-service"

export async function POST(request: Request) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const { planId, successUrl, cancelUrl } = await request.json()

		if (!(planId && successUrl && cancelUrl)) {
			return new NextResponse("Missing required parameters", { status: 400 })
		}

		const checkoutUrl = await StripeService.createCheckoutSession(userId, planId, successUrl, cancelUrl)

		return NextResponse.json({ checkoutUrl })
	} catch (error) {
		console.error("[SUBSCRIPTION_UPGRADE_POST]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
