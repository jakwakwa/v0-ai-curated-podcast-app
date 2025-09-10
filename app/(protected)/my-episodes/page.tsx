import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { EpisodeList } from "./_components/episode-list";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
	return { title: "My Episodes", description: "All your completed, generated episodes." };
}

export default async function MyEpisodesPage() {
	return (
		<div className="w-full space-y-0 pl-2 ">
			<PageHeader title="Ai Generated Episodes" description="Listen to your custom ai-generated podcast summary episodes." />
			<div className="bg-primary-card">
				<EpisodeList completedOnly />
			</div>
		</div>
	);
}
