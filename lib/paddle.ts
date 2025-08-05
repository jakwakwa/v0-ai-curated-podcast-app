import { initializePaddle as initPaddle } from "@paddle/paddle-js"

export const PADDLE_PRODUCTS = {
    CASUAL_LISTENER: "pri_01k1dwyqfvnwf8w7rk1gc1y634",
    CURATE_CONTROL: "pri_01k1w1gye963q3nea8ctpbgehz",
} as const

export const initializePaddle = async () => {
    if (!process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN) {
        throw new Error("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN env var missing")
    }

    const paddle = await initPaddle({
        environment: process.env.NODE_ENV === "production" ? "production" : "sandbox",
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
    })

    return paddle
}

export const openCheckout = async (priceId: string) => {
    const paddle = await initializePaddle()

    try {
        await paddle.Checkout.open({
            items: [
                {
                    priceId,
                    quantity: 1,
                },
            ],
        })
    } catch (error) {
        console.error("Error opening checkout:", error)
        throw error
    }
}