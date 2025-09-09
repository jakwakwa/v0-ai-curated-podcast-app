import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { EpisodeList } from "./_components/episode-list";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
	return { title: "My Episodes", description: "All your completed, generated episodes." };
}

export default async function MyEpisodesPage() {
	return (
		<div className="w-full space-y-8 pl-8">
			<PageHeader title="Ai Generated Episodes" description="Listen to your custom ai-generated podcast summary episodes." />
			<Suspense fallback={<div>Loading episodes...</div>}>
				<EpisodeList completedOnly />
			</Suspense>
		</div>
	);
}
