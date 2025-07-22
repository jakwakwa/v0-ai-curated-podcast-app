"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Crown, Gift } from "lucide-react"
import Link from "next/link"

interface SubscriptionData {
	subscription: any
	plan: any
	hasActiveSubscription: boolean
}

export function SubscriptionStatus() {
	const { user, isLoaded } = useUser()
	const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (isLoaded && user) {
			fetchSubscriptionData()
		} else if (isLoaded) {
			setLoading(false)
		}
	}, [isLoaded, user])

	const fetchSubscriptionData = async () => {
		try {
			const response = await fetch("/api/subscription")
			if (response.ok) {
				const data = await response.json()
				setSubscriptionData(data)
			}
		} catch (error) {
			console.error("Error fetching subscription data:", error)
		} finally {
			setLoading(false)
		}
	}

	if (!isLoaded || loading || !user) {
		return null
	}

	const { plan, hasActiveSubscription } = subscriptionData || {}

	if (!hasActiveSubscription) {
		return (
			<div className="flex items-center gap-2">
				<Badge variant="secondary" className="flex items-center gap-1">
					<Gift className="h-3 w-3" />
					Free
				</Badge>
				<Button size="sm" asChild>
					<Link href="/pricing">
						<Zap className="mr-1 h-3 w-3" />
						Upgrade
					</Link>
				</Button>
			</div>
		)
	}

	const getPlanIcon = (planId: string) => {
		switch (planId) {
			case 'basic':
				return <Zap className="h-3 w-3" />
			case 'pro':
				return <Crown className="h-3 w-3" />
			case 'enterprise':
				return <Crown className="h-3 w-3" />
			default:
				return <Gift className="h-3 w-3" />
		}
	}

	const getPlanVariant = (planId: string) => {
		switch (planId) {
			case 'basic':
				return 'default'
			case 'pro':
				return 'default'
			case 'enterprise':
				return 'default'
			default:
				return 'secondary'
		}
	}

	return (
		<div className="flex items-center gap-2">
			<Badge variant={getPlanVariant(plan?.id)} className="flex items-center gap-1">
				{getPlanIcon(plan?.id)}
				{plan?.name || 'Free'}
			</Badge>
			<Button size="sm" variant="outline" asChild>
				<Link href="/subscription">
					Manage
				</Link>
			</Button>
		</div>
	)
}
