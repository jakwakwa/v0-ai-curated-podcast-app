import type { NextApiRequest, NextApiResponse } from "next"
import { updateSubscription } from "@/src/server/paddle"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end()
    const { subscriptionId } = req.body
    if (!subscriptionId) return res.status(400).json({ message: "subscriptionId required" })

    try {
        const data = await updateSubscription(subscriptionId, { status: "active", cancel_at_period_end: false })
        return res.status(200).json(data)
    } catch (e) {
        console.error(e)
        return res.status(500).json({ message: "Unable to resume subscription" })
    }
}