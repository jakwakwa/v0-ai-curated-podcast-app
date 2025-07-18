import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST() {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		// Check if user already has an active subscription or trial
		const existingSubscription = await prisma.subscription.findFirst({
			where: { userId },
		})

		if (existingSubscription) {
			return new NextResponse("User already has a subscription or trial", { status: 400 })
		}

		// Create a new trial subscription (1 week trial)
		const newTrial = await prisma.subscription.create({
			data: {
				userId,
				status: "trialing",
				trialStart: new Date(),
				trialEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
			},
		})

		return NextResponse.json(newTrial, { status: 201 })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.error("[SUBSCRIPTION_TRIAL_POST]", message)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
