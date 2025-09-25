import { auth } from "@clerk/nextjs/server";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getStorageReader, parseGcsUri } from "@/lib/gcs";
import { extractKeyTakeaways, normalizeSummaryMarkdown } from "@/lib/markdown/episode-text";
import { prisma } from "@/lib/prisma";
import type { UserEpisode } from "@/lib/types";
import PlayAndShare from "./_components/play-and-share.client";

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

	const playableEpisode: UserEpisode = {
		episode_id: episode.episode_id,
		user_id: episode.user_id,
		episode_title: episode.episode_title,
		youtube_url: episode.youtube_url,
		transcript: episode.transcript ?? null,
		summary: episode.summary ?? null,
		gcs_audio_url: episode.signedAudioUrl ?? episode.gcs_audio_url ?? null,
		duration_seconds: episode.duration_seconds ?? null,
		status: episode.status,
		created_at: episode.created_at,
		updated_at: episode.updated_at,
	};

	return (
		<div className="episode-card-wrapper p-12 w-full max-w-5xl mx-auto space-y-6">
			<div>
				<div className="flex flex-col gap-2">
					<div className="text-xl font-semibold text-shadow-lg text-shadow-slate-900 md:text-2xl">{episode.episode_title}</div>
					<div className="text-sm text-[#8A97A5D4]/80 episode-p pr-[10%] mb-1">
						<div className="flex flex-wrap items-center gap-2 my-2">
							<Badge variant="outline">{episode.status}</Badge>
							{episode.duration_seconds ? <Badge variant="secondary">{Math.round(episode.duration_seconds / 60)} min</Badge> : null}
							<Badge variant="secondary">{new Date(episode.created_at).toLocaleString()}</Badge>
							<div className="text-xs text-muted-foreground break-words border-1 border-[#dcd4df36] rounded px-2 py-0 flex gap-2 items-center">
								<a className="no-underline hover:underline" href={episode.youtube_url} target="_blank" rel="noreferrer">
									Youtube Url
								</a>
								<span className="font-medium uppercase text-[0.6rem] text-[#9be5c9]">
									<ExternalLink width={13} />
								</span>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-4 my-8">
					<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-start">
						<PlayAndShare episode={playableEpisode} canPlay={episode.status === "COMPLETED" && !!episode.signedAudioUrl} />
					</div>
					<Separator className="my-8" />
					{takeaways.length > 0 ? (
						<div className="mt-4">
							<h3 className="text-base font-semibold mb-2 text-[rgb(133,239,177)]">Key Takeaways</h3>
							<ul className="list-disc pl-6 space-y-1 text-[#c0e9d1]">
								{takeaways.map((t, i) => (
									<li key={i}>{t}</li>
								))}
							</ul>
						</div>
					) : null}

					<Separator className="my-8" />

					{episode.summary ? (
						<div className="prose prose-invert text-base px-6 my-8 leading-[1.8] max-w-none">
							<ReactMarkdown remarkPlugins={[remarkGfm]}>{normalizeSummaryMarkdown(episode.summary)}</ReactMarkdown>
						</div>
					) : (
						<p className="text-sm text-muted-foreground">No summary available.</p>
					)}
				</div>
			</div>
		</div>
	);
}
