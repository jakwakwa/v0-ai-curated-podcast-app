import { StripeService } from "@/lib/stripe-service"
import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
	try {
		const { userId } = await auth()
		const user = await currentUser()

		if (!userId || !user) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const { planId, successUrl, cancelUrl } = await request.json()

		if (!planId || !successUrl || !cancelUrl) {
			return new NextResponse("Missing required parameters", { status: 400 })
		}

		const checkoutUrl = await StripeService.createCheckoutSession(
			userId,
			planId,
			successUrl,
			cancelUrl
		)

		return NextResponse.json({ checkoutUrl })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		console.error("[SUBSCRIPTION_CREATE_CHECKOUT_POST]", message)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
