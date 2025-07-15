import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2023-10-16",
})

export class StripeService {
	// Create a customer
	static async createCustomer(email: string, name?: string) {
		return await stripe.customers.create({
			email,
			name,
			metadata: {
				source: "podcast-app",
			},
		})
	}

	// Create a subscription
	static async createSubscription(customerId: string, priceId: string) {
		return await stripe.subscriptions.create({
			customer: customerId,
			items: [{ price: priceId }],
			payment_behavior: "default_incomplete",
			payment_settings: { save_default_payment_method: "on_subscription" },
			expand: ["latest_invoice.payment_intent"],
		})
	}

	// Cancel a subscription
	static async cancelSubscription(subscriptionId: string) {
		return await stripe.subscriptions.cancel(subscriptionId)
	}

	// Create a checkout session
	static async createCheckoutSession(customerId: string, priceId: string, successUrl: string, cancelUrl: string) {
		return await stripe.checkout.sessions.create({
			customer: customerId,
			payment_method_types: ["card"],
			line_items: [{ price: priceId, quantity: 1 }],
			mode: "subscription",
			success_url: successUrl,
			cancel_url: cancelUrl,
			allow_promotion_codes: true,
		})
	}
}
