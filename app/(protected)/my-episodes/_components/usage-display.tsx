"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Body, H2 } from "@/components/ui/typography";
import { PRICING_TIER } from "@/config/paddle-config";
import { useUserEpisodesStore } from "@/lib/stores/user-episodes-store";

export function UsageDisplay() {
	// const [usage, setUsage] = useState({ count: 0, limit: EPISODE_LIMIT })
	const [isLoading, setIsLoading] = useState(true);
	// const subscription = useSubscriptionStore(state => state.subscription)

	// ALWAYS CURATE_CONTROL PLAN
	const episodeLimit = PRICING_TIER.find(tier => tier.planId === "CURATE_CONTROL")?.episodeLimit || 20;

	const fetchCompletedEpisodeCount = useUserEpisodesStore(state => state.fetchCompletedEpisodeCount);
	const completedEpisodeCount = useUserEpisodesStore(state => state.completedEpisodeCount);
	const usage = { count: completedEpisodeCount, limit: episodeLimit };

	useEffect(() => {
		fetchCompletedEpisodeCount();
	}, [fetchCompletedEpisodeCount]);

	useEffect(() => {
		setIsLoading(false); // set loading to false when user episodes are fetched
	}, []);

	if (isLoading) {
		return <Skeleton className="h-24 w-full" />;
	}

	return (
		<Card variant="glass" className="bg-bundle-card w-3/4">
			<div className="w-full flex flex-col p-2 gap-3">
				<H2 className="text-secondary-foreground">Monthly Usage</H2>

				<Body className="font-normal">
					You have generated <span className="font- text-accent-foreground bg-[#5727AB] rounded-full w-[11px] h-[13px] py-[14px] px-[15px] inline-flex justify-center items-center mx-2">{usage.count} </span>of your {usage.limit} monthly episodes
				</Body>
			</div>

		</Card>
	);
}
