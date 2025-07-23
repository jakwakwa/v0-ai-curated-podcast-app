import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { StripeService } from "@/lib/stripe-service"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
	const body = await request.text()
	const signature = request.headers.get("stripe-signature")!

	let event: Stripe.Event

	try {
		event = StripeService.verifyWebhookSignature(body, signature, webhookSecret)
	} catch (error) {
		console.error("Webhook signature verification failed:", error)
		return new NextResponse("Invalid signature", { status: 400 })
	}

	try {
		switch (event.type) {
			case "customer.subscription.created":
			case "customer.subscription.updated": {
				const subscription = event.data.object as Stripe.Subscription
				await StripeService.handleSubscriptionSuccess(subscription)
				console.log(`Subscription ${event.type}:`, subscription.id)
				break
			}

			case "customer.subscription.deleted": {
				const deletedSubscription = event.data.object as Stripe.Subscription
				await StripeService.handleSubscriptionDeletion(deletedSubscription)
				console.log("Subscription deleted:", deletedSubscription.id)
				break
			}

			case "invoice.payment_succeeded": {
				const invoice = event.data.object as Stripe.Invoice
				console.log("Payment succeeded for invoice:", invoice.id)
				// You can add additional logic here for successful payments
				break
			}

			case "invoice.payment_failed": {
				const failedInvoice = event.data.object as Stripe.Invoice
				console.log("Payment failed for invoice:", failedInvoice.id)
				// You might want to send email notifications or update subscription status
				break
			}

			case "checkout.session.completed": {
				const session = event.data.object as Stripe.Checkout.Session
				if (session.mode === "subscription" && session.subscription) {
					console.log("Checkout session completed:", session.id)
					// The subscription.created event will handle the subscription setup
				}
				break
			}

			default:
				console.log(`Unhandled event type: ${event.type}`)
		}

		return NextResponse.json({ received: true })
	} catch (error) {
		console.error("Error processing webhook:", error)
		return new NextResponse("Webhook processing failed", { status: 500 })
	}
}
