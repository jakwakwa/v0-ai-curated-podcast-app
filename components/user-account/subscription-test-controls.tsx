"use client"

import dynamic from "next/dynamic"
import { PAYMENT_CONFIG } from "@/config/ai"

const PaddleControls = dynamic(() => import("./subscription-test-controls-paddle").then(mod => mod.SubscriptionTestControlsPaddle), { ssr: false })

export function SubscriptionTestControls() {
	if (!PAYMENT_CONFIG.ENABLE_PADDLE) {
		return null
	}
	return <PaddleControls />
}
