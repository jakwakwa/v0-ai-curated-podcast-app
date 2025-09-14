import type { Metadata } from "next";
import { H3 } from "@/components/ui/typography";
import { EpisodeList } from "./_components/episode-list";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
	return { title: "My Episodes", description: "All your completed, generated episodes." };
}

export default async function MyEpisodesPage() {
	return (
		<div className="flex episode-card-wrapper bg-primary-card flex-col justify-center mx-auto w-screen md:w-screen max-w-full mt-0">
			<H3 className="pl-3">My Episodes</H3>
			<EpisodeList completedOnly />
		</div>

	);
}
