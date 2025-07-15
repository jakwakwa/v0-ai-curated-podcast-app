// Link API integration (you'll need to install the Link SDK)
import { Link } from "@link-sdk/node"

const link = new Link({
	secretKey: process.env.LINK_SECRET_KEY!,
	publishableKey: process.env.LINK_PUBLISHABLE_KEY!,
})

export class LinkPaymentService {
	// Create a customer
	static async createCustomer(email: string, name?: string) {
		return await link.customers.create({
			email,
			name,
			metadata: {
				source: "podcast-app",
			},
		})
	}

	// Create a subscription
	static async createSubscription(customerId: string, priceId: string) {
		return await link.subscriptions.create({
			customer: customerId,
			items: [{ price: priceId }],
			payment_behavior: "default_incomplete",
			payment_settings: { save_default_payment_method: "on_subscription" },
			expand: ["latest_invoice.payment_intent"],
		})
	}

	// Cancel a subscription
	static async cancelSubscription(subscriptionId: string) {
		return await link.subscriptions.cancel(subscriptionId)
	}

	// Create a checkout session
	static async createCheckoutSession(customerId: string, priceId: string, successUrl: string, cancelUrl: string) {
		return await link.checkout.sessions.create({
			customer: customerId,
			payment_method_types: ["card", "eft"], // Link supports EFT payments
			line_items: [{ price: priceId, quantity: 1 }],
			mode: "subscription",
			success_url: successUrl,
			cancel_url: cancelUrl,
			allow_promotion_codes: true,
		})
	}

	// Handle webhook events
	static async handleWebhook(event: any) {
		switch (event.type) {
			case "subscription.created":
			case "subscription.updated":
			case "subscription.deleted":
				return await LinkService.updateFromLinkWebhook(event.data.object)

			case "invoice.payment_succeeded":
				// Handle successful payment
				break

			case "invoice.payment_failed":
				// Handle failed payment
				break

			default:
				console.log(`Unhandled event type: ${event.type}`)
		}
	}
}
