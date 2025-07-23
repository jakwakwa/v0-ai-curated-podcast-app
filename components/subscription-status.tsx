"use client"

import { useAuth, useUser } from "@clerk/nextjs"
import { Crown, Gift, Zap } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function SubscriptionStatus() {
	const { user, isLoaded } = useUser()
	const { has } = useAuth()

	if (!(isLoaded && user)) {
		return null
	}

	// Check if user has any premium features
	const hasPremiumFeatures = has?.({ feature: "weekly_combo" }) || has?.({ feature: "custom_curation_profiles" })

	// Determine plan based on features
	const getPlanData = () => {
		if (has?.({ feature: "custom_curation_profiles" })) {
			return { name: "Curate & Control", id: "profile_curator", icon: <Crown className="h-3 w-3" /> }
		}
		if (has?.({ feature: "weekly_combo" })) {
			return { name: "Casual Listener", id: "casual-user", icon: <Zap className="h-3 w-3" /> }
		}
		return { name: "FreeSlice", id: "free_user", icon: <Gift className="h-3 w-3" /> }
	}

	const planData = getPlanData()

	if (!hasPremiumFeatures) {
		return (
			<div className="flex items-center gap-2">
				<Badge variant="secondary" className="flex items-center gap-1">
					{planData.icon}
					{planData.name}
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

	return (
		<div className="flex items-center gap-2">
			<Badge variant="default" className="flex items-center gap-1">
				{planData.icon}
				{planData.name}
			</Badge>
			<Button size="sm" variant="outline" asChild>
				<Link href="/pricing">Manage</Link>
			</Button>
		</div>
	)
}
