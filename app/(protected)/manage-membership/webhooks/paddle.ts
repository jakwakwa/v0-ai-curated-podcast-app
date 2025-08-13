import type { NextApiRequest, NextApiResponse } from "next"
import { getTransaction } from "@/lib/paddle-server/paddle"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" })
	}

	try {
		const { data } = req.body

		// Handle different webhook events
		switch (data.event_type) {
			case "subscription.created": {
				// Handle new subscription
				const _transaction = await getTransaction(data.transaction_id)
				// TODO: Update user's subscription status in your database
				break
			}

			case "subscription.updated":
				// Handle subscription updates
				// TODO: Update subscription details in your database
				break

			case "subscription.canceled":
				// Handle subscription cancellation
				// TODO: Update user's subscription status in your database
				break

			case "transaction.completed":
				// Handle successful payment
				// TODO: Update payment status in your database
				break

			case "transaction.failed":
				// Handle failed payment
				// TODO: Handle failed payment (notify user, retry logic, etc.)
				break
		}

		res.status(200).json({ message: "Webhook processed successfully" })
	} catch (error) {
		console.error("Webhook processing error:", error)
		res.status(500).json({ message: "Error processing webhook" })
	}
}
