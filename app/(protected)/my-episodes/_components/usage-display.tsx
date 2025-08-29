"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PRICING_TIER } from "@/config/paddle-config"
import { useUserEpisodesStore } from "@/lib/stores/user-episodes-store"

export function UsageDisplay() {
	// const [usage, setUsage] = useState({ count: 0, limit: EPISODE_LIMIT })
	const [isLoading, setIsLoading] = useState(true)
	// const subscription = useSubscriptionStore(state => state.subscription)

	// ALWAYS CURATE_CONTROL PLAN
	const episodeLimit = PRICING_TIER.find(tier => tier.planId === "CURATE_CONTROL")?.episodeLimit || 16;

	const fetchCompletedEpisodeCount = useUserEpisodesStore(state => state.fetchCompletedEpisodeCount)
	const completedEpisodeCount = useUserEpisodesStore(state => state.completedEpisodeCount)
	const usage = { count: completedEpisodeCount, limit: episodeLimit }

	useEffect(() => {
		fetchCompletedEpisodeCount()
	}, [fetchCompletedEpisodeCount])

	useEffect(() => {
		setIsLoading(false) // set loading to false when user episodes are fetched
	}, [])

	if (isLoading) {
		return <Skeleton className="h-24 w-full" />
	}

	return (
		<Card variant="default">
			<CardHeader>
				<CardTitle>Episode Usage</CardTitle>
			</CardHeader>
			<CardContent>
				<p>
					You have used {usage.count} of your {usage.limit} monthly episodes.
				</p>

			</CardContent>
		</Card>
	)
}
