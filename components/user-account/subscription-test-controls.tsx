"use client"

import { PAYMENT_CONFIG } from "@/config/ai"
import dynamic from "next/dynamic"

// Dynamically import the test control components
const PaystackControls = dynamic(() => import("./subscription-test-controls.paystack.disabled").then(mod => mod.SubscriptionTestControls), { ssr: false })

const PaddleControls = dynamic(() => import("./subscription-test-controls-paddle").then(mod => mod.SubscriptionTestControlsPaddle), { ssr: false })

export function SubscriptionTestControls() {
	// Show no controls if both providers are disabled
	if (!(PAYMENT_CONFIG.ENABLE_PADDLE || PAYMENT_CONFIG.ENABLE_PAYSTACK)) {
		return null
	}

	// Show the appropriate controls based on the active provider and enabled state
	if (PAYMENT_CONFIG.ACTIVE_PROVIDER === "paddle" && PAYMENT_CONFIG.ENABLE_PADDLE) {
		return <PaddleControls />
	}

	if (PAYMENT_CONFIG.ACTIVE_PROVIDER === "paystack" && PAYMENT_CONFIG.ENABLE_PAYSTACK) {
		return <PaystackControls />
	}

	return null
}
