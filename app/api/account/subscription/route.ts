import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
export const dynamic = "force-dynamic"
export const revalidate = 0

import { prisma } from "@/lib/prisma"

export async function GET() {
	try {
		const { userId } = await auth()
		if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

		const subscription = await prisma.subscription.findFirst({
			where: { user_id: userId },
			orderBy: { updated_at: "desc" },
		})

		return NextResponse.json(subscription)
	} catch (error) {
		console.error("[ACCOUNT_SUBSCRIPTION_GET]", error)
		return NextResponse.json({ error: "Failed to load subscription" }, { status: 500 })
	}
}
