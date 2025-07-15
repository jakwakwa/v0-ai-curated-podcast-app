import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export interface SubscriptionTier {
	id: string
	name: string
	price: number
	linkPriceId: string
	features: string[]
}

export const SUBSCRIPTION_TIERS = {
	TRIAL: {
		id: "trial",
		name: "Free Trial",
		price: 0,
		linkPriceId: null,
		features: ["1 week trial", "1 collection", "Weekly generation"],
	},
	PREMIUM: {
		id: "premium",
		name: "Premium",
		price: 99, // R99/month in ZAR
		linkPriceId: process.env.LINK_PREMIUM_PRICE_ID,
		features: ["Unlimited collections", "Weekly generation", "Priority support"],
	},
} as const

export class LinkService {
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
				linkPriceId: tier.linkPriceId,
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

	// Update subscription from Link webhook
	static async updateFromLinkWebhook(linkSubscription: any) {
		const subscription = await prisma.subscription.findFirst({
			where: { linkSubscriptionId: linkSubscription.id },
		})

		if (!subscription) {
			throw new Error(`Subscription not found for Link ID: ${linkSubscription.id}`)
		}

		return await prisma.subscription.update({
			where: { id: subscription.id },
			data: {
				status: linkSubscription.status,
				currentPeriodStart: new Date(linkSubscription.current_period_start * 1000),
				currentPeriodEnd: new Date(linkSubscription.current_period_end * 1000),
				canceledAt: linkSubscription.canceled_at ? new Date(linkSubscription.canceled_at * 1000) : null,
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
