import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
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
			return NextResponse.json([])
		}

		// For now, return basic subscription history
		// In a full implementation, you would fetch detailed billing history from Paystack
		const billingHistory = [
			{
				id: currentSubscription.subscription_id,
				date: currentSubscription.created_at,
				amount: getPlanAmount(currentSubscription.paystack_plan_code || ""),
				status: currentSubscription.status,
				description: `Subscription to ${getPlanName(currentSubscription.paystack_plan_code || "")}`,
				plan_code: currentSubscription.paystack_plan_code,
			},
		]

		// If subscription was cancelled, add cancellation record
		if (currentSubscription.canceled_at) {
			billingHistory.push({
				id: `${currentSubscription.subscription_id}_cancel`,
				date: currentSubscription.canceled_at,
				amount: 0,
				status: "cancelled",
				description: "Subscription cancelled",
				plan_code: currentSubscription.paystack_plan_code,
			})
		}

		return NextResponse.json(billingHistory)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		console.error("[BILLING_HISTORY_GET]", message)
		return new NextResponse("Internal Error", { status: 500 })
	}
}

function getPlanAmount(planCode: string): number {
	const planAmounts: Record<string, number> = {
		[process.env.NEXT_PUBLIC_PAYSTACK_CASUAL_PLAN_CODE || ""]: 5.00,
		[process.env.NEXT_PUBLIC_PAYSTACK_PREMIUM_PLAN_CODE || ""]: 10.00,
	}

	return planAmounts[planCode] || 0
}

function getPlanName(planCode: string): string {
	const planNames: Record<string, string> = {
		[process.env.NEXT_PUBLIC_PAYSTACK_CASUAL_PLAN_CODE || ""]: "Casual Listener",
		[process.env.NEXT_PUBLIC_PAYSTACK_PREMIUM_PLAN_CODE || ""]: "Curate & Control",
	}

	return planNames[planCode] || "Unknown Plan"
}
