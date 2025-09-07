import type { PlanGate } from "@/types/prisma-fallback"
import { PRICING_TIER } from "@/config/paddle-config"

function planGateToDbString(plan: PlanGate): string {
	return plan.toLowerCase()
}

export function priceIdToPlanType(priceId: string | null | undefined): string | null {
	if (!priceId) return null
	const tier = PRICING_TIER.find(t => t.priceId === priceId)
	if (!tier) return null
	return planGateToDbString(tier.planId)
}
