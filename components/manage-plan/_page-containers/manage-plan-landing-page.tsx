import type React from "react"
import { useMemo } from "react"
import { PADDLE_PRODUCT_PLAN } from "@/config/paddle-config"
import { openCheckout } from "@/lib/paddle"
import { PricingPlans } from "../_components/pricing-plans"

const PricingPage: React.FC = () => {
	const plans = useMemo(() => {
		return PADDLE_PRODUCT_PLAN.map(prod => {
			return {
				priceId: prod.priceId,
				productPlan: prod.productPlan,
				price: prod.price,
			}
		})
	}, [])

	const handleSubscribe = async (priceId: string) => {
		try {
			await openCheckout(priceId)
		} catch (error) {
			console.error("Failed to open checkout:", error)
		}
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="sm:flex sm:flex-col sm:align-center">
				<h1 className="text-5xl font-extrabold text-gray-900 sm:text-center">Choose Your Plan</h1>
				<p className="mt-5 text-xl text-gray-500 sm:text-center">Start with a 14-day free trial. No credit card required.</p>
			</div>

			<PricingPlans handleSubscribe={handleSubscribe} plans={plans} />
		</div>
	)
}

export { PricingPage }
