"use client"
import type { Paddle } from "@paddle/paddle-js"
import { CircleCheck } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { PRICING_TIER } from "@/config/paddle-config"
import { usePaddlePrices } from "@/hooks/use-paddle-Prices"
import type { IBillingFrequency, PlanTier } from "@/lib/types"
import { cn } from "@/lib/utils"

type IFPricingPlanProps = {
	paddleProductPlan: PlanTier[]
}

function PricingPlans({ paddleProductPlan }: IFPricingPlanProps) {
	// TODO: We only use monthly billing. so we can actually remove billingfrequency
	// const [_frequency, _setFrequency] = useState<IBillingFrequency>(BillingFrequency[0])
	const [paddle, _setPaddle] = useState<Paddle | undefined>(undefined)
	//  TODO:

	const { prices, loading } = usePaddlePrices(paddle, "United States")

	useEffect(() => {
		console.log("click")
		console.log(loading)
	}, [loading])
	const _handleSub = (_param: string) => {}
	return (
		<>
			{paddleProductPlan?.map(plan => (
				<Card key={plan.priceId} className="w-full flex flex-col max-w-[300px]">
					<div className="border-1 border-[#99999946] rounded-lg shadow-sm divide-y divide-gray-200">
						<div className="p-6">
							<div>
								<h2 className="text-2xl font-semibold text-foreground-secondary">{plan.productTitle}</h2>
							</div>
							<div className={"px-8 text-[16px] leading-[24px]"}>{plan.description}</div>
							<span className="text-4xl font-extrabold text-accent">{prices[0]}</span>
							<span className="text-base font-medium text-gray-500">/month</span>
							<div className={"px-8"}>
								<Separator className={"bg-border"} />
							</div>
							<div className={"px-8 mt-8"}>
								<Button className={"w-full"} variant={"secondary"} asChild={true}>
									{/* <Link href={`/checkout/${tier.priceId}`}>started</Link> */}
								</Button>
							</div>
							{/* <Button variant="secondary" onClick={} className="mt-8 block w-full text-white rounded-md py-2 px-4 hover:bg-blue-700">
								Subscribe Now
							</Button> */}
							{/* <FeaturesList tier={plan} loading={loading} priceMap={plan} value={""} priceSuffix={""} /> */}
						</div>
					</div>
				</Card>
			))}
		</>
	)
}

export { PricingPlans }

interface Props {
	loading: boolean
	frequency: IBillingFrequency
	priceMap: Record<string, string>
}

export function PriceCards({ loading, frequency, priceMap }: Props) {
	const _billingFrequency = { value: "month", label: "Monthly", priceSuffix: "per user/month" }
	return (
		<div className="isolate mx-auto grid grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
			{PRICING_TIER?.map(tier => (
				<Card key={tier.planId} className={cn("rounded-lg bg-background/70 backdrop-blur-[6px] overflow-hidden")}>
					<div className={cn("flex gap-5 flex-col rounded-lg rounded-b-none pricing-card-border")}>
						<CardTitle>{!tier ? tier : "not implemented"}</CardTitle>
						<PriceAmount loading={loading} tier={tier} priceMap={priceMap} value={frequency.value} priceSuffix={frequency.priceSuffix} frequency={"monthly"} />

						<div className={"px-8 text-[16px] leading-[24px]"}>{tier.description}</div>
					</div>
					<div className={"px-8 mt-8"}>
						<Button className={"w-full"} variant={"secondary"} asChild={true}>
							<Link href={`/checkout/${tier.priceId}`}>started</Link>
						</Button>
					</div>
					<FeaturesList tier={tier} loading={loading} frequency={frequency} priceMap={priceMap} value={""} priceSuffix={""} />
				</Card>
			))}
		</div>
	)
}

interface Props {
	loading: boolean
	tier: PlanTier
	priceMap: Record<string, string>
	value: string
	priceSuffix: string
}

export function PriceAmount({ loading, priceMap, priceSuffix, tier, value }: Props) {
	return (
		<div className="mt-6 flex flex-col px-8">
			{loading ? (
				<Skeleton className="h-[96px] w-full bg-border" />
			) : (
				<>
					<div className={cn("text-[80px] leading-[96px] tracking-[-1.6px] font-medium")}>{priceMap[tier.priceId[Number(value)]].replace(/\.00$/, "")}</div>
					<div className={cn("font-medium leading-[12px] text-[12px]")}>{priceSuffix}</div>
				</>
			)}
		</div>
	)
}

interface Props {
	tier: PlanTier
}

export function FeaturesList({ tier }: Props) {
	return (
		<ul className={"p-8 flex flex-col gap-4"}>
			{tier.features.map((feature: string) => (
				<li key={feature} className="flex gap-x-3">
					<CircleCheck className={"h-6 w-6 text-muted-foreground"} />
					<span className={"text-base"}>{feature}</span>
				</li>
			))}
		</ul>
	)
}
