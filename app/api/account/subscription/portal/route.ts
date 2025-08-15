import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
export const dynamic = "force-dynamic"

import { createCustomerPortalSession } from "@/lib/paddle-server/paddle"
import { prisma } from "@/lib/prisma"

type Body = { action: "update" | "cancel" }

export async function POST(request: Request) {
	try {
		const { userId } = await auth()
		if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

		const { action }: Partial<Body> = await request.json().catch(() => ({}))
		if (action !== "update" && action !== "cancel") {
			return NextResponse.json({ error: "Invalid action" }, { status: 400 })
		}

		const sub = await prisma.subscription.findFirst({ where: { user_id: userId }, orderBy: { updated_at: "desc" }, select: { paddle_subscription_id: true } })
		if (!sub?.paddle_subscription_id) return NextResponse.json({ error: "No active subscription" }, { status: 400 })

		// Assume we store Paddle customer id on the user table as paddle_customer_id
		const user = await prisma.user.findUnique({ where: { user_id: userId }, select: { paddle_customer_id: true } })
		const customerId = user?.paddle_customer_id as unknown as string | undefined
		if (!customerId) return NextResponse.json({ error: "Missing paddle customer id" }, { status: 400 })

		const session = await createCustomerPortalSession(customerId, [sub.paddle_subscription_id])
		const urls = session?.urls || session?.data?.urls
		if (!urls) return NextResponse.json({ error: "No portal URLs" }, { status: 400 })

		const url = action === "cancel" ? urls.subscriptions?.[0]?.cancel : urls.general?.overview
		if (!url) return NextResponse.json({ error: "Requested URL not available" }, { status: 400 })

		return NextResponse.json({ url })
	} catch (error) {
		console.error("[ACCOUNT_SUBSCRIPTION_PORTAL]", error)
		return NextResponse.json({ error: "Failed to create portal link" }, { status: 500 })
	}
}
