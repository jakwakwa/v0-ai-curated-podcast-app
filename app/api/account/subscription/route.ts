import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { getSubscriptionsByCustomer } from "@/lib/paddle-server/paddle"
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

		// Attempt enrichment with Paddle subscription period dates
		let current_period_start: Date | null = null
		let current_period_end: Date | null = null
		let externalSubscriptionId: string | null = null
		try {
			const paddleResp = await getSubscriptionsByCustomer(customer.id)
			const PaddleSubscriptionItemSchema = z.object({
				id: z.string().optional(),
				subscription_id: z.string().optional(),
				status: z.string().optional(),
				current_billing_period: z
					.object({
						starts_at: z.string().optional(),
						ends_at: z.string().optional(),
					})
					.optional(),
				started_at: z.string().optional(),
				next_billed_at: z.string().optional(),
			})
			const raw = Array.isArray(paddleResp?.data) ? paddleResp.data : Array.isArray(paddleResp) ? paddleResp : []
			const parsed = z.array(PaddleSubscriptionItemSchema).safeParse(raw)
			const subs = parsed.success ? parsed.data : []
			if (subs.length > 0) {
				const preferred = subs.find(s => s?.status === "active") ?? subs.find(s => s?.status === "trialing") ?? subs[0]
				externalSubscriptionId = preferred?.id ?? preferred?.subscription_id ?? null
				const starts = preferred?.current_billing_period?.starts_at || preferred?.started_at || null
				const ends = preferred?.current_billing_period?.ends_at || preferred?.next_billed_at || null
				current_period_start = starts ? new Date(starts) : null
				current_period_end = ends ? new Date(ends) : null
			}
		} catch {}

		const newSubscription = await prisma.subscription.create({
			data: {
				user_id: userId,
				paddle_subscription_id: externalSubscriptionId || transaction_id,
				paddle_price_id: priceId,
				status: "active",
				current_period_start,
				current_period_end,
			},
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
