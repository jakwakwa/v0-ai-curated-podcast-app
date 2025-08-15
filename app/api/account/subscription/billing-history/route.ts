import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"

export async function GET() {
	try {
		const { userId } = await auth()
		if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

		const sub = await prisma.subscription.findFirst({ where: { user_id: userId }, orderBy: { updated_at: "desc" } })
		if (!sub?.paddle_subscription_id) return NextResponse.json([])

		// Placeholder: return empty array for now
		return NextResponse.json([])
	} catch (error) {
		console.error("[ACCOUNT_SUBSCRIPTION_BILLING_HISTORY]", error)
		return NextResponse.json({ error: "Failed to load billing history" }, { status: 500 })
	}
}
