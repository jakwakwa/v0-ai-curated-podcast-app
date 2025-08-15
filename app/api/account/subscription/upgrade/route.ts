import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
export const dynamic = "force-dynamic"

import { updateSubscription as paddleUpdate } from "@/lib/paddle-server/paddle"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
	try {
		const { userId } = await auth()
		if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

		const { price_id } = await request.json().catch(() => ({}))
		if (!price_id) return NextResponse.json({ error: "price_id required" }, { status: 400 })

		const sub = await prisma.subscription.findFirst({ where: { user_id: userId }, orderBy: { updated_at: "desc" } })
		if (!sub?.paddle_subscription_id) return NextResponse.json({ error: "No active subscription" }, { status: 400 })

		await paddleUpdate(sub.paddle_subscription_id, {
			items: [{ price_id, quantity: 1 }],
		})

		await prisma.subscription.update({
			where: { subscription_id: sub.subscription_id },
			data: { paddle_price_id: price_id },
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("[ACCOUNT_SUBSCRIPTION_UPGRADE]", error)
		return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
	}
}
