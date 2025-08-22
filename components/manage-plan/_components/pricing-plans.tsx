"use client"

import { useUser } from "@clerk/nextjs"
import { type InitializePaddleOptions, initializePaddle, type Paddle } from "@paddle/paddle-js"
import { CircleCheck } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { usePaddlePrices } from "@/hooks/use-paddle-Prices"
import type { IBillingFrequency, PaddleCheckoutCompletedData, PlanTier } from "@/lib/types"
import { cn } from "@/lib/utils"
import { PriceTitle } from "./pricing/price-title"

// --- Component Props and Interfaces ---

type IPricingPlanProps = {
	paddleProductPlan: PlanTier[]
	onCheckoutCompleted: (data: PaddleCheckoutCompletedData) => void
	onCheckoutClosed?: () => void
}
interface IPriceProps {
	loading: boolean
	value: string | undefined // Updated to allow undefined as per corrected code logic
	priceSuffix: string
}

interface IFeatureListProps {
	tier: PlanTier
	loading: boolean
}

// --- Helper Components ---

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
		<div className="mt-2 flex flex-col px-8">
			{loading ? (
				<Skeleton className="h-[96px] w-full bg-border" />
			) : (
				<>
					<div className={cn("text-[40px] leading-[46px] tracking-[-1.6px] font-medium")}>{value ? value : "n/a"}</div>
					<div className={cn("font-medium leading-[12px] text-[12px]")}>{priceSuffix}</div>
				</>
			)}
		</div>
	)
}

// --- Main Pricing Plans Component ---

export function PricingPlans({ paddleProductPlan, onCheckoutCompleted, onCheckoutClosed }: IPricingPlanProps) {
	//  ALWAYS MONTHLY ( 30 days from datee of purchase  )
	const [frequency, _setFrequency] = useState<IBillingFrequency>({ value: "month", label: "Monthly", priceSuffix: "per user/month" })
	const [paddle, setPaddle] = useState<Paddle>()

	// Call the custom hook to get prices and loading state.
	// We've changed the country code from "USD" to "US" to fix the API error.
	const { prices, loading } = usePaddlePrices(paddle, "US")

	useEffect(() => {
		// Correctly accessing the client-side environment variable.
		const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN

		if (!clientToken) {
			console.error("Paddle Client Token is not set. Please ensure the NEXT_PUBLIC_PADDLE_CLIENT_TOKEN environment variable is configured correctly.")
			return
		}

		initializePaddle({
			environment: process.env.NEXT_PUBLIC_PADDLE_ENV || "sandbox",
			token: clientToken,
			eventCallback: (data: { name: string; data?: PaddleCheckoutCompletedData }) => {
				if (data.name === "checkout.completed" && data.data) {
					onCheckoutCompleted(data.data as PaddleCheckoutCompletedData)
				}
				if (data.name === "checkout.closed") {
					// Ensure membership state refresh when checkout is closed
					onCheckoutClosed?.()
				}
			},
		} as unknown as InitializePaddleOptions)
			.then((paddleInstance: Paddle | undefined) => {
				if (paddleInstance) {
					setPaddle(paddleInstance)
				}
			})
			.catch((error: Error) => {
				// Log any errors during initialization to prevent uncaught promises
				console.error("Failed to initialize Paddle:", error)
			})
	}, [onCheckoutCompleted, onCheckoutClosed])

	const { user } = useUser()
	const customerInfo = user?.primaryEmailAddress?.emailAddress ? { email: user.primaryEmailAddress.emailAddress } : undefined

	const openPaddleCheckout = (e: React.FormEvent, id: string) => {
		e.preventDefault()
		if (paddle && id) {
			paddle.Checkout.open({
				items: [
					{
						priceId: id,
						quantity: 1,
					},
				],
				...(customerInfo ? { customer: customerInfo } : {}),
			})
		}
	}

	return (
		<>
			{paddleProductPlan?.map(tier => (
				<Card key={tier.priceId} className={cn("rounded-lg bg-background/70  overflow-hidden flex-1")}>
					<div className={cn("flex gap-5 flex-col rounded-lg rounded-b-none pricing-card-border")}>
						<PriceTitle tier={tier} />
						<PriceAmount
							loading={loading}
							// This is the main fix: Use the tier's priceId to look up the correct price from the prices object.
							value={prices?.[tier.priceId]}
							priceSuffix={frequency.priceSuffix}
						/>
						<div className={"px-8"}>
							<Separator className={"bg-border"} />
						</div>
						<div className={"px-8 text-[16px] leading-[24px]"}>{tier.description}</div>
					</div>
					<div className={"px-8 mt-8"}>
						<Button onClick={e => openPaddleCheckout(e, tier.priceId)} className={"w-full"} variant={"secondary"}>
							Upgrade
						</Button>
					</div>
					<FeatureList tier={tier} loading={loading} />
				</Card>
			))}
		</>
	)
}
