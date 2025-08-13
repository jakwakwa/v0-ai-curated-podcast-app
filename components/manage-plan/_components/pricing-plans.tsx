import { Button } from "@/components/ui/button"

interface IFPricingPlanProps {
	handleSubscribe: (priceId: string) => void
	plans: {
		priceId: string
		productPlan: string
		price?: string
	}[]
}
function PricingPlans(props: IFPricingPlanProps) {
	return (
		<>
			{props.plans.map(plan => (
				<div key={plan.priceId} className="mt-4 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto">
					<div className="border rounded-lg shadow-sm divide-y divide-gray-200">
						<div className="p-6">
							<h2 className="text-2xl font-semibold text-gray-900">{plan.productPlan}</h2>
							<p className="mt-4 text-gray-500">{plan.productPlan}.</p>
							<p className="mt-8">
								<span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
								<span className="text-base font-medium text-gray-500">/month</span>
							</p>
							<Button variant="default" onClick={() => props.handleSubscribe(plan.priceId)} className="mt-8 block w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700">
								Subscribe
							</Button>
						</div>
					</div>
				</div>
			))}
		</>
	)
}

export { PricingPlans }
