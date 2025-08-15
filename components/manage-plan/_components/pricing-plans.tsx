"use client"

import { CircleCheck } from "lucide-react"
import { ReactElement, ReactEventHandler, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { PRICING_TIER } from "@/config/paddle-config"
import { usePaddlePrices } from "@/hooks/use-paddle-Prices"
import type { IBillingFrequency, PlanTier } from "@/lib/types"
import { cn } from "@/lib/utils"
import { initializePaddle, InitializePaddleOptions, Paddle } from "@paddle/paddle-js";
import { PriceTitle } from "./pricing/price-title"
import Link from "next/link"

type IPricingPlanProps = {
	paddleProductPlan: PlanTier[]
}
interface IPriceProps {
	loading: boolean
	value: string
	priceSuffix: string
}

interface IFeatureListProps {
	tier: PlanTier
	loading: boolean
}

export function FeatureList({ tier, loading }: IFeatureListProps) {
	return (
		<div className="mt-6 flex flex-col px-8">
			{loading ? (
				<Skeleton className="h-[96px] w-full bg-border" />
			) : (
				<ul className={"p-8 flex flex-col gap-4"}>
					{tier.features.map((feature: string) => (
						<li key={feature} className="flex gap-x-3">
							<CircleCheck className={"h-6 w-6 text-muted-foreground"} />
							<span className={"text-base"}>{feature}</span>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}




export function PriceAmount({ loading, priceSuffix, value }: IPriceProps) {
	return (
		<div className="mt-6 flex flex-col px-8">
			{loading ? (
				<Skeleton className="h-[96px] w-full bg-border" />
			) : (
				<>
					<div className={cn("text-[80px] leading-[96px] tracking-[-1.6px] font-medium")}>{value.replace(/\.00$/, "")}</div>
					<div className={cn("font-medium leading-[12px] text-[12px]")}>{priceSuffix}</div>
				</>
			)}
		</div>
	)
}


function PricingPlans({ paddleProductPlan }: IPricingPlanProps) {

	//  ALWAYS MONTHLY ( 30 days from datee of purchase  )
	const [frequency, setFrequency] = useState<IBillingFrequency>({ value: 'month', label: 'Monthly', priceSuffix: 'per user/month' });
	const [paddle, setPaddle] = useState<Paddle>();
	const { prices, loading } = usePaddlePrices(paddle, "USD");
	const [checkoutPlan, setCheckoutPlan] = useState<{ priceId: string }>();

	// example freeslice define items


	useEffect(() => {
		initializePaddle({
			environment: process.env.PADDLE_ENV!, // e.g., "sandbox" or "production"
			token: process.env.PADDLE_CLIENT_TOKEN!,
			seller: Number(process.env.PADDLE_SELLER_ID),
		} as unknown as InitializePaddleOptions).then(
			(paddleInstance: Paddle | undefined) => {
				if (paddleInstance) {
					setPaddle(paddleInstance);
				}
			}
		);
	}, []);

	let customerInfo = {
		email: "sam@example.com",
		address: {
			countryCode: "US",
			postalCode: "10021"
		}
	};

	const openPaddleCheckout = (e: ReactEventHandler, id: string) => {
		e.preventDefault()

		setCheckoutPlan(id)
		return paddle?.Checkout.open({
			items:
				[{
					priceId: checkoutPlan?.priceId,
					quantity: 1
				}]
			,
			customer: customer
		});
	};

	return (
		<>
			{paddleProductPlan?.map(tier => (

				<div key={tier.priceId} className={cn('rounded-lg bg-background/70 backdrop-blur-[6px] overflow-hidden')}>
					<div className={cn('flex gap-5 flex-col rounded-lg rounded-b-none pricing-card-border')}>

						<PriceTitle tier={tier} />
						<PriceAmount
							loading={loading}
							value={frequency.value}
							priceSuffix={frequency.priceSuffix}
						/>
						<div className={'px-8'}>
							<Separator className={'bg-border'} />
						</div>
						<div className={'px-8 text-[16px] leading-[24px]'}>{tier.description}</div>
					</div>
					<div className={'px-8 mt-8'}>

						<Button onClick={(e) => openPaddleCheckout(e, tier.priceId)} className={'w-full'} variant={'secondary'} asChild={true}>
							Get started
						</Button>
					</div>
					<FeatureList tier={tier} loading={loading} />
				</div>

			))}
		</>
	)
}

export { PricingPlans }


interface Props {
	loading: boolean
	frequency: IBillingFrequency
	priceId: string
}

export function PriceCards({ loading, frequency, priceId }: Props) {
	let customerInfo = {
		email: "sam@example.com",
		address: {
			countryCode: "US",
			postalCode: "10021"
		}
	};
	const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);



	return (
		<div className="isolate mx-auto grid grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
			{PRICING_TIER?.map(tier => (
				<Card key={tier.planId} className={cn("rounded-lg bg-background/70 backdrop-blur-[6px] overflow-hidden")}>
					<div className={cn("flex gap-5 flex-col rounded-lg rounded-b-none pricing-card-border")}>
						<CardTitle>{!tier ? tier : "not implemented"}</CardTitle>

						{/* PRiCE AMOUNT */}
						<div className={cn("text-[80px] leading-[96px] tracking-[-1.6px] font-medium")}>{frequency.value.replace(/\.00$/, "")}</div>
						<div className={cn("font-medium leading-[12px] text-[12px]")}>{frequency.priceSuffix}</div>

						<div className={"px-8 text-[16px] leading-[24px]"}>{tier.description}</div>
					</div>

					<FeatureList tier={tier} loading={loading} />
				</Card>
			))}
		</div>
	)
}

