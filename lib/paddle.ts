import { initializePaddle as initPaddle } from "@paddle/paddle-js"
import { getEnv } from "@/utils/helpers"

export const initializePaddle = async () => {
	const paddle = await initPaddle({
		environment: getEnv("NODE_ENV") === "production" ? "production" : "sandbox",
		token: getEnv("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN") || "",
	})

	return paddle
}

export const openCheckout = async (priceId: string) => {
	const paddle = await initializePaddle()

	if (!paddle) {
		throw new Error("Failed to initialize Paddle")
	}

	try {
		paddle.Checkout.open({
			items: [
				{
					priceId: priceId,
					quantity: 1,
				},
			],
		})
	} catch (error) {
		console.error("Error opening checkout:", error)
		throw error
	}
}
