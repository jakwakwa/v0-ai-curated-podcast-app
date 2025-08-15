import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const checkoutCompletedSchema = z.object({
	transaction_id: z.string(),
	status: z.string(),
	customer: z.object({
		id: z.string(),
	}),
	items: z.array(
		z.object({
			price_id: z.string(),
		})
	),
	// Add other fields as necessary
})

export async function POST(request: Request) {
	try {
		const { userId } = await auth()
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}
		const body = await request.json()
		const parsedBody = checkoutCompletedSchema.safeParse(body)
		if (!parsedBody.success) {
			return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
		}

		const { transaction_id, customer, items } = parsedBody.data
		const priceId = items[0]?.price_id

		if (!priceId) {
			return NextResponse.json({ error: "Missing price_id in request" }, { status: 400 })
		}
		await prisma.user.update({ where: { user_id: userId }, data: { paddle_customer_id: customer.id } })
		const subscriptionData = {
			user_id: userId,
			paddle_subscription_id: transaction_id,
			paddle_price_id: priceId,
			status: "active",
		}
		const newSubscription = await prisma.subscription.create({
			data: subscriptionData,
		})

		return NextResponse.json(newSubscription, { status: 201 })
	} catch (error) {
		console.error("[SUBSCRIPTION_POST]", error)
		return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
	}
}

export async function GET() {
	try {
		const { userId } = await auth()
		if (!userId) {
			return new Response("Unauthorized", { status: 401 })
		}
		const subscription = await prisma.subscription.findFirst({
			where: { user_id: userId },
			orderBy: { created_at: "desc" },
		})
		if (!subscription) {
			return new Response(null, { status: 204 })
		}
		return NextResponse.json(subscription)
	} catch (error) {
		console.error("Failed to fetch subscription", error)
		return new Response("Internal Server Error", { status: 500 })
	}
}
