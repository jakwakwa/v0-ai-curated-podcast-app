import type { NextApiRequest, NextApiResponse } from "next"
import { getSubscription } from "@/src/server/paddle"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).end()

    try {
        // TODO: Replace with real lookup for current user
        const subscriptionId = req.query.subscriptionId as string | undefined || process.env.DEMO_SUBSCRIPTION_ID
        if (!subscriptionId) return res.status(400).json({ message: "subscriptionId missing" })

        const data = await getSubscription(subscriptionId)
        return res.status(200).json(data)
    } catch (e) {
        console.error(e)
        return res.status(500).json({ message: "Unable to fetch subscription" })
    }
}