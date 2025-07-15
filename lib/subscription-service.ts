import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export interface SubscriptionTier {
	id: string
	name: string
	price: number
	stripePriceId: string
	features: string[]
}

export const SUBSCRIPTION_TIERS = {
	TRIAL: {
		id: "trial",
		name: "Free Trial",
		price: 0,
		stripePriceId: null,
		features: ["1 week trial", "1 collection", "Weekly generation"],
	},
	PREMIUM: {
		id: "premium",
		name: "Premium",
		price: 9.99,
		stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID,
		features: ["Unlimited collections", "Weekly generation", "Priority support"],
	},
} as const

export class SubscriptionService {
	// Create a new subscription (trial or paid)
	static async createSubscription(userId: string, tierId: string) {
		const tier = SUBSCRIPTION_TIERS[tierId as keyof typeof SUBSCRIPTION_TIERS]

		if (!tier) {
			throw new Error(`Invalid subscription tier: ${tierId}`)
		}

		const now = new Date()
		const trialEnd = tierId === "trial" ? new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) : null

		return await prisma.subscription.create({
			data: {
				userId,
				status: tierId === "trial" ? "trialing" : "active",
				trialStart: tierId === "trial" ? now : null,
				trialEnd,
				currentPeriodStart: now,
				currentPeriodEnd: trialEnd || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
				stripePriceId: tier.stripePriceId,
			},
		})
	}

	// Get user's current subscription
	static async getUserSubscription(userId: string) {
		return await prisma.subscription.findFirst({
			where: { userId },
			orderBy: { createdAt: "desc" },
		})
	}

	// Check if user has active subscription
	static async hasActiveSubscription(userId: string): Promise<boolean> {
		const subscription = await this.getUserSubscription(userId)

		if (!subscription) return false

		const now = new Date()

		// Check if trial is still active
		if (subscription.status === "trialing" && subscription.trialEnd && subscription.trialEnd > now) {
			return true
		}

		// Check if paid subscription is active
		if (subscription.status === "active" && subscription.currentPeriodEnd && subscription.currentPeriodEnd > now) {
			return true
		}

		return false
	}

	// Update subscription from Stripe webhook
	static async updateFromStripeWebhook(stripeSubscription: any) {
		const subscription = await prisma.subscription.findFirst({
			where: { stripeSubscriptionId: stripeSubscription.id },
		})

		if (!subscription) {
			throw new Error(`Subscription not found for Stripe ID: ${stripeSubscription.id}`)
		}

		return await prisma.subscription.update({
			where: { id: subscription.id },
			data: {
				status: stripeSubscription.status,
				currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
				currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
				canceledAt: stripeSubscription.canceled_at ? new Date(stripeSubscription.canceled_at * 1000) : null,
			},
		})
	}

	// Cancel subscription
	static async cancelSubscription(userId: string) {
		const subscription = await this.getUserSubscription(userId)

		if (!subscription) {
			throw new Error("No subscription found")
		}

		return await prisma.subscription.update({
			where: { id: subscription.id },
			data: {
				status: "canceled",
				canceledAt: new Date(),
			},
		})
	}
}
