import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET() {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const subscription = await prisma.subscription.findFirst({
			where: { userId },
		})

		return NextResponse.json(subscription)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.error("[SUBSCRIPTION_GET]", message)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
