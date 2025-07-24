import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Force this API route to be dynamic since it uses auth()
export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		// For now, return a simple response since Clerk handles subscriptions
		// This can be extended later when you implement a proper payment system
		return NextResponse.json({
			subscription: null,
			plan: {
				id: "free",
				name: "Free",
				price: 0,
				features: ["Basic podcast curation", "Limited episodes per week"],
			},
			hasActiveSubscription: false,
		})
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		console.error("[SUBSCRIPTION_GET]", message)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
