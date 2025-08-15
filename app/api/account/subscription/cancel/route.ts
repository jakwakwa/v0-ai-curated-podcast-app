import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
export const dynamic = "force-dynamic"

import { cancelSubscription as paddleCancel } from "@/lib/paddle-server/paddle"
import { prisma } from "@/lib/prisma"

export async function POST() {
	try {
		const { userId } = await auth()
		if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

		const sub = await prisma.subscription.findFirst({ where: { user_id: userId }, orderBy: { updated_at: "desc" } })
		if (!sub?.paddle_subscription_id) return NextResponse.json({ error: "No active subscription" }, { status: 400 })

		await paddleCancel(sub.paddle_subscription_id)

		await prisma.subscription.update({
			where: { subscription_id: sub.subscription_id },
			data: { cancel_at_period_end: true },
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("[ACCOUNT_SUBSCRIPTION_CANCEL]", error)
		return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 })
	}
}
