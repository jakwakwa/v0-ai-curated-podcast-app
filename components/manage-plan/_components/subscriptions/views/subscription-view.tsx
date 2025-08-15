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
	const [_isSubmitting, _setIsSubmitting] = useState(false)
	const [_isSyncing, setIsSyncing] = useState(false)
	const [isForceSyncing, setIsForceSyncing] = useState(false)

	useEffect(() => {
		const fetchSubscription = async () => {
			try {
				const res = await fetch("/api/account/subscription", { cache: "no-store" })
				if (!res.ok) return

				// Handle 204 No Content case (no subscription found)
				if (res.status === 204) {
					setSubscription(null)
					return
				}

				const data = await res.json()
				setSubscription(data)
			} catch { }
		}
		fetchSubscription()
	}, [setSubscription])

	const _syncMembership = async () => {
		setIsSyncing(true)
		try {
			console.log("Starting subscription sync...")

			// First try to sync with Paddle
			const syncRes = await fetch("/api/account/subscription/sync", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			})

			if (syncRes.ok) {
				const syncData = await syncRes.json()
				console.log("Sync successful:", syncData)
			} else {
				const syncError = await syncRes.json()
				console.log("Sync endpoint error:", syncError)
			}

			// Then fetch the updated subscription data
			const res = await fetch("/api/account/subscription", { cache: "no-store" })
			if (!res.ok) {
				console.error("Failed to fetch subscription after sync:", res.status, res.statusText)
				return
			}

			// Handle 204 No Content case (no subscription found)
			if (res.status === 204) {
				console.log("No subscription found after sync")
				setSubscription(null)
				return
			}

			const data = await res.json()
			console.log("Subscription data after sync:", data)
			setSubscription(data)
		} catch (error) {
			console.error("Failed to sync membership:", error)
		} finally {
			setIsSyncing(false)
		}
	}

	const syncPaddleWithDb = async () => {
		setIsForceSyncing(true)
		try {
			const res = await fetch("/api/account/subscription/sync-paddle", { method: "POST" })
			if (!res.ok) {
				try {
					const err = await res.json()
					console.error("Force sync failed:", err)
				} catch { }
				return
			}
			const after = await fetch("/api/account/subscription", { cache: "no-store" })
			if (after.ok && after.status !== 204) {
				const data = await after.json()
				setSubscription(data)
			}
		} catch (e) {
			console.error("Error during force sync:", e)
		} finally {
			setIsForceSyncing(false)
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
					<div className="flex gap-2"></div>
				</div>
			</CardContent>
			<CardFooter className="p-0 pt-4">
				<Button onClick={syncPaddleWithDb} variant="outline" size="sm" disabled={isForceSyncing} className="w-full">
					{isForceSyncing ? "Syncing from Paddle..." : "Force Sync from Paddle"}
				</Button>
			</CardFooter>
		</Card>
	)
}
