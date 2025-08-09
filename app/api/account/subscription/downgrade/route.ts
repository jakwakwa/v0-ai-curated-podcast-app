import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// export const dynamic = "force-dynamic"

export async function POST(request: Request) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const body = await request.json()
		const { planCode } = body

		if (!planCode) {
			return new NextResponse("Plan code is required", { status: 400 })
		}

		// Get current subscription
		const currentSubscription = await prisma.subscription.findFirst({
			where: { user_id: userId },
			include: {
				user: true,
			},
			orderBy: { created_at: "desc" },
		})

		if (!currentSubscription) {
			return new NextResponse("No active subscription found", { status: 404 })
		}

		// For downgrade, we'll create a new subscription with the lower tier
		// The current subscription will be cancelled at the end of the billing period
		const paystackResponse = await fetch(`${process.env.PAYSTACK_API_URL}/transaction/initialize`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: currentSubscription.user.email,
				amount: getPlanAmount(planCode),
				callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?tab=subscription`,
				metadata: {
					plan_code: planCode,
					user_id: userId,
					action: "downgrade",
					current_subscription_id: currentSubscription.subscription_id,
				},
			}),
		})

		if (!paystackResponse.ok) {
			const errorData = await paystackResponse.json()
			console.error("Paystack downgrade error:", errorData)
			return new NextResponse("Failed to initialize downgrade transaction", { status: 500 })
		}

		const paystackData = await paystackResponse.json()

		return NextResponse.json({
			authorization_url: paystackData.data.authorization_url,
			reference: paystackData.data.reference,
		})
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		console.error("[SUBSCRIPTION_DOWNGRADE]", message)
		return new NextResponse("Internal Error", { status: 500 })
	}
}

function getPlanAmount(planCode: string): number {
	// Convert plan code to amount in kobo (smallest currency unit)
	const planAmounts: Record<string, number> = {
		[process.env.NEXT_PUBLIC_PAYSTACK_CASUAL_PLAN_CODE || ""]: 5000, // $5.00 in kobo
		[process.env.NEXT_PUBLIC_PAYSTACK_PREMIUM_PLAN_CODE || ""]: 10000, // $10.00 in kobo
	}

	return planAmounts[planCode] || 0
}
