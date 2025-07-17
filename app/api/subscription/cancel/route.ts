import { LinkService } from "@/lib/link-service"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST() {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		await LinkService.cancelSubscription(userId)

		return NextResponse.json({ message: "Subscription canceled successfully" })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.error("[SUBSCRIPTION_CANCEL_POST]", message)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
