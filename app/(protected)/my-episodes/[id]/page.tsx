import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import EpisodeHeader from "@/components/features/episodes/episode-header";
import EpisodeShell from "@/components/features/episodes/episode-shell";
import KeyTakeaways from "@/components/features/episodes/key-takeaways";
import PlayAndShare from "@/components/features/episodes/play-and-share";
import { Separator } from "@/components/ui/separator";
import { getStorageReader, parseGcsUri } from "@/lib/inngest/utils/gcs";
import { extractKeyTakeaways, extractNarrativeRecap } from "@/lib/markdown/episode-text";
import { prisma } from "@/lib/prisma";
import type { UserEpisode } from "@/lib/types";

export const dynamic = "force-dynamic";

// Zod schema for validating the episode we shape
const UserEpisodeSchema = z.object({
	episode_id: z.string(),
	user_id: z.string(),
	episode_title: z.string(),
	youtube_url: z.string(),
	transcript: z.string().nullable().optional(),
	summary: z.string().nullable().optional(),
	gcs_audio_url: z.string().nullable().optional(),
	duration_seconds: z.number().nullable().optional(),
	status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED"]),
	created_at: z.date(),
	updated_at: z.date(),
});

type EpisodeWithSigned = UserEpisode & { signedAudioUrl: string | null };

async function getEpisodeWithSignedUrl(id: string, currentUserId: string): Promise<EpisodeWithSigned | null> {
	const episode = await prisma.userEpisode.findUnique({ where: { episode_id: id } });
	if (!episode || episode.user_id !== currentUserId) return null;

	let signedAudioUrl: string | null = null;
	if (episode.gcs_audio_url) {
		const parsed = parseGcsUri(episode.gcs_audio_url);
		if (parsed) {
			const reader = getStorageReader();
			const [url] = await reader
				.bucket(parsed.bucket)
				.file(parsed.object)
				.getSignedUrl({ action: "read", expires: Date.now() + 15 * 60 * 1000 });
			signedAudioUrl = url;
		}
	}

	const safe = UserEpisodeSchema.parse(episode) as UserEpisode;
	return { ...safe, signedAudioUrl };
}

// (Local markdown utilities removed in favor of shared helpers)

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
	const { id } = await params;
	const { userId } = await auth();
	if (!userId) return { title: "User Episode" };
	const ep = await getEpisodeWithSignedUrl(id, userId);
	if (!ep) return { title: "Episode not found" };
	return { title: ep.episode_title, description: ep.summary ?? undefined };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const { userId } = await auth();
	if (!userId) notFound();

	const episode = await getEpisodeWithSignedUrl(id, userId);
	if (!episode) notFound();

	const takeaways = extractKeyTakeaways(episode.summary);
	const _narrativeRecap = extractNarrativeRecap(episode.summary);
	const _hasSummary = Boolean(episode.summary);

	return (
		<EpisodeShell>
			<div>
				<EpisodeHeader
					title={episode.episode_title}
					createdAt={episode.created_at}
					durationSeconds={episode.duration_seconds ?? null}
					metaBadges={
						<span className="inline-flex">
							<span className="sr-only">status</span>
						</span>
					}
					rightLink={{ href: episode.youtube_url, label: "Youtube Url", external: true }}
				/>
				<div className="mt-4 my-8">
					<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-start">
						<PlayAndShare kind="user" episode={episode} signedAudioUrl={episode.signedAudioUrl} />
					</div>
					<Separator className="my-8" />
					<KeyTakeaways items={takeaways} />
				</div>
			</div>
		</EpisodeShell>
	);
}
