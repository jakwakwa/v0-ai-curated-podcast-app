import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function POST(_request: Request) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		// Get current subscription
		const currentSubscription = await prisma.subscription.findFirst({
			where: { user_id: userId },
			orderBy: { created_at: "desc" },
		})

		if (!currentSubscription) {
			return new NextResponse("No active subscription found", { status: 404 })
		}

		if (!currentSubscription.paystack_subscription_code) {
			return new NextResponse("No Paystack subscription code found", { status: 400 })
		}

		// Cancel subscription with Paystack
		const paystackResponse = await fetch(`${process.env.PAYSTACK_API_URL}/subscription/disable`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				code: currentSubscription.paystack_subscription_code,
			}),
		})

		if (!paystackResponse.ok) {
			const errorData = await paystackResponse.json()
			console.error("Paystack cancellation error:", errorData)
			return new NextResponse("Failed to cancel subscription", { status: 500 })
		}

		// Update local subscription status
		await prisma.subscription.update({
			where: { subscription_id: currentSubscription.subscription_id },
			data: {
				status: "canceled",
				canceled_at: new Date(),
				updated_at: new Date(),
			},
		})

		return NextResponse.json({
			message: "Subscription cancelled successfully",
			status: "canceled",
		})
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		console.error("[SUBSCRIPTION_CANCEL]", message)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
