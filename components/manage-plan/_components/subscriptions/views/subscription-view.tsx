"use client"

import { useEffect, useState } from "react"
import { useShallow } from "zustand/shallow"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PRICING_TIER } from "@/config/paddle-config"
import { useSubscriptionStore } from "@/lib/stores/subscription-store-paddlejs"

export function SubscriptionView() {
	const { subscription, setSubscription } = useSubscriptionStore(useShallow(state => ({ subscription: state.subscription, setSubscription: state.setSubscription })))
	const [isSubmitting, setIsSubmitting] = useState(false)

	useEffect(() => {
		const fetchSubscription = async () => {
			try {
				const res = await fetch("/api/account/subscription", { cache: "no-store" })
				if (!res.ok) return
				const data = await res.json()
				setSubscription(data)
			} catch { }
		}
		fetchSubscription()
	}, [setSubscription])

	const openPortal = async (action: "update" | "cancel") => {
		setIsSubmitting(true)
		try {
			const res = await fetch("/api/account/subscription/portal", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action }),
			})
			if (!res.ok) return
			const { url } = await res.json()
			if (url) window.location.href = url
		} finally {
			setIsSubmitting(false)
		}
	}

	const currentPlan = PRICING_TIER.find(p => p.priceId === subscription?.paddle_price_id)

	return (
		<Card className={"bg-background/50 backdrop-blur-[24px] border-border p-6 col-span-12 md:col-span-8"}>
			<CardHeader className="p-0 space-y-0">
				<CardTitle className="flex justify-between items-center pb-2">
					<span className={"text-xl font-medium"}>Subscription</span>
					{subscription?.status && (
						<Badge variant="secondary" size="sm">
							{subscription.status}
						</Badge>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent className={"p-0 space-y-4"}>
				<div className="text-base leading-6 text-secondary">Current plan: {currentPlan?.productTitle ?? "Free Slice"}</div>
				<Separator className="my-2" />
				<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
					<div className="text-sm text-muted-foreground">Manage your subscription in Paddle</div>
					<div className="flex gap-2">
						<Button variant="outline" disabled={isSubmitting} onClick={() => openPortal("update")}>
							Change / Manage Plan
						</Button>
						<Button variant="outline" disabled={isSubmitting} onClick={() => openPortal("cancel")}>
							Cancel Plan
						</Button>
					</div>
				</div>
			</CardContent>
			<CardFooter className="p-0 pt-4"></CardFooter>
		</Card>
	)
}
