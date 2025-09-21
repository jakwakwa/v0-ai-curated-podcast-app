import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { getStorageReader, parseGcsUri } from "@/lib/gcs";
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

function extractKeyTakeaways(markdown?: string | null): string[] {
	if (!markdown) return [];
	const lines = markdown.split(/\r?\n/);
	const bullets: string[] = [];
	for (const line of lines) {
		const trimmed = line.trim();
		if (trimmed.startsWith("-") || trimmed.startsWith("*") || /^\d+\./.test(trimmed)) {
			const item = trimmed.replace(/^(-|\*|\d+\.)\s*/, "").trim();
			if (item) bullets.push(item);
			continue;
		}
		// Also treat lines that begin with bold label as bullets, e.g. **Topic:** detail
		const boldMatch = trimmed.match(/^\*\*(.+?)\*\*:?\s*(.*)$/);
		if (boldMatch) {
			const title = boldMatch[1].trim();
			const rest = (boldMatch[2] || "").trim();
			const item = rest ? `${title}: ${rest}` : title;
			bullets.push(item);
			continue;
		}
		if (bullets.length >= 5) break;
	}
	return bullets;
}

function normalizeSummaryMarkdown(input: string): string {
	const lines = input.split(/\r?\n/).map(line => {
		const trimmed = line.trim();
		// Normalize noisy headings with stray asterisks
		if (/^\*+?\s*Key\s+Highlights:?\*+?$/i.test(trimmed) || /^Key\s+Highlights:?\s*$/i.test(trimmed)) {
			return "### Key Highlights";
		}
		if (/^\*+?\s*Key\s+Takeaways:?\*+?$/i.test(trimmed) || /^Key\s+Takeaways:?\s*$/i.test(trimmed)) {
			return "### Key Takeaways";
		}
		if (/^Here'?s a summary of the content:?\s*$/i.test(trimmed)) {
			return "### Summary";
		}
		// Convert leading "*Word" (no space) into a bullet
		if (/^\*(\S)/.test(trimmed)) {
			return `- ${trimmed.slice(1).trimStart()}`;
		}
		// Remove unmatched trailing '**' at EOL (common LLM artifact)
		const starPairs = (trimmed.match(/\*\*/g) || []).length;
		if (starPairs === 1 && trimmed.endsWith("**")) {
			return trimmed.slice(0, -2).trimEnd();
		}
		return line;
	});

	return lines.join("\n").replace(/\n{3,}/g, "\n\n");
}

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

	// Normalize for the audio player: set gcs_audio_url to signed URL when available
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
					<div className="text-xl md:text-2xl">{episode.episode_title}</div>
					<div className="text-sm text-[#8A97A5D4]/80 episode-p pr-[10%] mb-1">
						<div className="flex flex-wrap items-center gap-2">
							<Badge variant="outline">{episode.status}</Badge>
							{episode.duration_seconds ? <Badge variant="secondary">{Math.round(episode.duration_seconds / 60)} min</Badge> : null}
							<Badge variant="secondary">{new Date(episode.created_at).toLocaleString()}</Badge>
						</div>
					</div>
				</div>
				<div className="space-y-4">
					<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
						<div className="text-sm text-muted-foreground break-words">
							<span className="font-medium">Source:</span>{" "}
							<a className="underline" href={episode.youtube_url} target="_blank" rel="noreferrer">
								{episode.youtube_url}
							</a>
						</div>
						<PlayAndShare episode={playableEpisode} canPlay={episode.status === "COMPLETED" && !!episode.signedAudioUrl} />
					</div>


					{takeaways.length > 0 ? (
						<div className="mt-4">
							<h3 className="text-base font-semibold mb-2 text-[#d59be5]">Key Takeaways</h3>
							<ul className="list-disc pl-6 space-y-1 text-[#c0e9d1]">
								{takeaways.map((t, i) => (
									<li key={i}>{t}</li>
								))}
							</ul>
						</div>
					) : null}

					{episode.summary ? (
						<div className="prose prose-invert text-sm leading-relaxed max-w-none">
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
