import type React from "react"
import { PRICING_TIER } from "@/config/paddle-config"
import { PricingPlans } from "../_components/pricing-plans"

const ManagPlanLandingPage: React.FC = () => {
	return (
		<div className="w-full max-w-7xl flex flex-row gap-6">
			<PricingPlans paddleProductPlan={PRICING_TIER} />
		</div>
	)
}

export { ManagPlanLandingPage }
