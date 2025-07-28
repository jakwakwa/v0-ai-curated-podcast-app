
// @ts-nocheck
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Force this API route to be dynamic since it uses auth()
export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const subscription = await prisma.subscription.findFirst({
			where: { userId: userId },
			orderBy: {
				createdAt: 'desc',
			},
		})

		return NextResponse.json(subscription)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		console.error("[SUBSCRIPTION_GET]", message)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
