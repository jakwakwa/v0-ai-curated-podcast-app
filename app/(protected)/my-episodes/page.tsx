import type { Metadata } from "next";
import { H3 } from "@/components/ui/typography";
import { EpisodeList } from "./_components/episode-list";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
	return { title: "My Episodes", description: "All your completed, generated episodes." };
}

export default async function MyEpisodesPage({
	searchParams,
}: {
	searchParams?: Record<string, string | string[] | undefined>;
}) {
	// Accept several possible keys from email deep links
	const idParam = searchParams?.episodeId || searchParams?.id || searchParams?.episode_id;
	const initialEpisodeId = Array.isArray(idParam) ? idParam[0] : idParam;

	return (
		<div className="flex episode-card-wrapper mt-4 flex-col justify-center mx-auto w-screen md:w-screen max-w-full">
			<div className="mb-8">
				<H3 className="pl-3">My Episodes</H3>
			</div>
			<EpisodeList completedOnly initialEpisodeId={initialEpisodeId} />
		</div>
	);
}
