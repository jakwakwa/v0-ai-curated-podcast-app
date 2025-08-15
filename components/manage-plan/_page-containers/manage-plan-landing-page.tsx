import type React from "react"
import { PRICING_TIER } from "@/config/paddle-config"
import { PricingPlans } from "../_components/pricing-plans"
import { Subscriptions } from "../_components/subscriptions/subscriptions"

const ManagPlanLandingPage: React.FC = () => {
	return (
		<div className="w-full max-w-7xl flex flex-col gap-6">
			<Subscriptions />
			<PricingPlans paddleProductPlan={PRICING_TIER} />
		</div>
	)
}

export { ManagPlanLandingPage }
