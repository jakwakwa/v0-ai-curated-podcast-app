import type { NextApiRequest, NextApiResponse } from "next"
import { updateSubscription } from "@/src/server/paddle"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end()

    const { planId, subscriptionId } = req.body
    if (!planId || !subscriptionId) return res.status(400).json({ message: "planId & subscriptionId required" })

    try {
        const data = await updateSubscription(subscriptionId, { items: [{ price_id: planId, quantity: 1 }] })
        return res.status(200).json(data)
    } catch (e) {
        console.error(e)
        return res.status(500).json({ message: "Unable to update subscription" })
    }
}