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
		<Card className="bg-[#060506] border rounded-none p-8 min-w-1/3">
			<div className="w-full flex flex-col gap-3">
				<H2 className=" text-lg text-primary-foreground">Monthly Usage</H2>

				<Body className="font-normal">
					You have generated <br /> <strong>{usage.count}</strong> of your <strong>{usage.count}</strong> monthly episodes

				</Body>
				<Body className="text-amber-600">
					{usage.count === usage.limit ? <div><span className="mr-3">⚠️</span>Limit reached for the month </div> : ""}
				</Body>
			</div>

		</Card>
	);
}
