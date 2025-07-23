// @ts-nocheck
// Temporarily disabled type checking for this file as it's not needed yet but code should be preserved

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export interface SubscriptionTier {
	id: string
	name: string
	price: number
	linkPriceId: string | null // Changed to allow null for trial
	features: string[]
}

export const SUBSCRIPTION_TIERS = {
	TRIAL: {
		id: "trial",
		name: "Free Trial",
		price: 0,
		linkPriceId: null,
		features: ["1 week trial", "1 user curation profile", "Weekly generation"],
	},
	PREMIUM: {
		id: "premium",
		name: "Premium",
		price: 99, // R99/month in ZAR
		linkPriceId: process.env.LINK_PREMIUM_PRICE_ID || null, // Ensure it's explicitly null if undefined
		features: ["Unlimited user curation profiles", "Weekly generation", "Priority support"],
	},
} as const

// biome-ignore lint/complexity/noStaticOnlyClass: Static class pattern used for service organization
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
		const subscription = await LinkService.getUserSubscription(userId)

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
	// biome-ignore lint/suspicious/noExplicitAny: PayMongo webhook payload type is not strongly typed
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
		const subscription = await LinkService.getUserSubscription(userId)

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

	// Create a PayMongo checkout link for premium subscription
	static async createCheckoutSession(_userId: string, _returnUrl: string) {
		const ENABLE_LINK_INTEGRATION = process.env.ENABLE_LINK_INTEGRATION === "true"
		if (!ENABLE_LINK_INTEGRATION) {
			throw new Error("Link.com integration is currently disabled.")
		}

		const premiumTier = SUBSCRIPTION_TIERS.PREMIUM
		if (!premiumTier.linkPriceId) {
			throw new Error("LINK_PREMIUM_PRICE_ID is not configured.")
		}

		// In PayMongo, a 'Link' represents a reusable payment page or a one-time payment link.
		// For subscriptions, you typically use 'Plans' and 'Subscriptions' directly, or a checkout session that links to a plan.
		// Given the project's use of 'linkPriceId', we'll simulate a checkout using a 'Link' for a fixed amount.
		// A more robust integration would involve PayMongo's Subscriptions API.

		const amountInCents = premiumTier.price * 100 // Convert to cents

		const PAYMONGO_SECRET_KEY = process.env.LINK_API_KEY // Using LINK_API_KEY for PayMongo Secret Key
		const PAYMONGO_BASE_URL = "https://api.paymongo.com/v1"

		if (!PAYMONGO_SECRET_KEY) {
			throw new Error("PayMongo API key is not set.")
		}

		try {
			const response = await fetch(`${PAYMONGO_BASE_URL}/links`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString("base64")}`,
				},
				body: JSON.stringify({
					data: {
						type: "link",
						attributes: {
							amount: amountInCents,
							currency: "PHP", // Assuming PHP as per PayMongo docs for SA
							description: "Premium Subscription Upgrade",
							// Success and cancel URLs are usually handled by the client-side redirect after the link is generated
							// PayMongo Links don't directly take success/cancel URLs in creation; it's the checkout_url that redirects
							// We pass returnUrl to the API route, which then needs to redirect the user to checkout_url
						},
					},
				}),
			})

			const data = await response.json()

			if (!response.ok) {
				console.error("PayMongo Link creation failed:", data)
				throw new Error(
					`Failed to create PayMongo Link: ${
						// biome-ignore lint/suspicious/noExplicitAny: PayMongo error structure is not typed
						data.errors ? data.errors.map((e: any) => e.detail).join(", ") : "Unknown error"
					}`
				)
			}

			return data.data.attributes.checkout_url // Return the URL to redirect the user
		} catch (error) {
			console.error("Error creating PayMongo Link:", error)
			throw error
		}
	}
}
