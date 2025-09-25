import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import PlayAndShare from "./_components/play-and-share.client";
import { getStorageReader, parseGcsUri } from "@/lib/gcs";
import { prisma } from "@/lib/prisma";
import type { Episode } from "@/lib/types";

export const dynamic = "force-dynamic";

// Schema for validating the Episode we expose (subset of fields we need)
const EpisodeSchema = z.object({
  episode_id: z.string(),
  podcast_id: z.string(),
  bundle_id: z.string().nullable().optional(),
  profile_id: z.string().nullable().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  audio_url: z.string(),
  image_url: z.string().nullable().optional(),
  duration_seconds: z.number().nullable().optional(),
  published_at: z.date().nullable().optional(),
  created_at: z.date(),
  week_nr: z.date().nullable().optional(),
});

type EpisodeWithSigned = Episode & { signedAudioUrl: string | null };

function extractGcsFromHttp(url: string): { bucket: string; object: string } | null {
  try {
    const u = new URL(url);
    if (u.hostname === "storage.googleapis.com" || u.hostname === "storage.cloud.google.com") {
      const path = u.pathname.replace(/^\//, "");
      const slash = path.indexOf("/");
      if (slash > 0) {
        const bucket = path.slice(0, slash);
        const object = path.slice(slash + 1);
        return { bucket, object };
      }
    }
  } catch {
    /* ignore */
  }
  return null;
}

async function getEpisodeWithAccess(id: string, currentUserId: string): Promise<EpisodeWithSigned | null> {
  // Load episode + minimal relations
  const episode = await prisma.episode.findUnique({
    where: { episode_id: id },
    include: { userProfile: { select: { user_id: true } }, podcast: true },
  });
  if (!episode) return null;

  // Authorization logic mirrors /api/episodes/[id]/play route
  const profile = await prisma.userCurationProfile.findFirst({
    where: { user_id: currentUserId, is_active: true },
    include: { selectedBundle: { include: { bundle_podcast: true } } },
  });
  const podcastIdsInSelectedBundle = profile?.selectedBundle?.bundle_podcast.map(bp => bp.podcast_id) ?? [];
  const selectedBundleId = profile?.selectedBundle?.bundle_id ?? null;

  const isOwnedByUser = episode.userProfile?.user_id === currentUserId; // user-generated personalized episode
  const isInSelectedBundleByPodcast = podcastIdsInSelectedBundle.includes(episode.podcast_id);
  const isDirectlyLinkedToSelectedBundle = !!selectedBundleId && episode.bundle_id === selectedBundleId;
  const authorized = isOwnedByUser || isInSelectedBundleByPodcast || isDirectlyLinkedToSelectedBundle;
  if (!authorized) return null;

  let signedAudioUrl: string | null = null;
  const parsedGs = parseGcsUri(episode.audio_url);
  const parsedHttp = parsedGs ? null : extractGcsFromHttp(episode.audio_url);
  if (parsedGs || parsedHttp) {
    const { bucket, object } = parsedGs ?? parsedHttp!;
    const reader = getStorageReader();
    try {
      const [url] = await reader
        .bucket(bucket)
        .file(object)
        .getSignedUrl({ action: "read", expires: Date.now() + 15 * 60 * 1000 });
      signedAudioUrl = url;
    } catch (e) {
      console.error("Failed to sign episode audio URL", e);
    }
  }

  const safe = EpisodeSchema.parse(episode) as Episode; // runtime validation
  return { ...safe, signedAudioUrl };
}

// Extract up to 5 bullet points of plain text like user episodes (uses description field)
function extractKeyTakeaways(markdown?: string | null): string[] {
  if (!markdown) return [];
  const lines = markdown.split(/\r?\n/);
  const bullets: string[] = [];
  for (const line of lines) {
    if (bullets.length >= 5) break;
    const trimmed = line.trim();
    let item: string | null = null;
    if (trimmed.startsWith("-") || trimmed.startsWith("*") || /^\d+\./.test(trimmed)) {
      item = trimmed.replace(/^(-|\*|\d+\.)\s*/, "");
    } else {
      const boldMatch = trimmed.match(/^\*\*(.+?)\*\*:?\s*(.*)$/);
      if (boldMatch) {
        const title = boldMatch[1].trim();
        const rest = (boldMatch[2] || "").trim();
        item = rest ? `${title}: ${rest}` : title;
      }
    }
    if (item) {
      const cleanItem = item.replace(/\*/g, "").trim();
      if (cleanItem) bullets.push(cleanItem);
    }
  }
  return bullets;
}

// Normalizes raw LLM markdown (description) similar to user episode summary normalization
function normalizeSummaryMarkdown(input: string | null | undefined): string {
  if (!input) return "";
  const lines = input.split(/\r?\n/).map(line => {
    let trimmed = line.trim();
    if (/^\*+\s*Key\s+(Highlights|Takeaways):?\*+\s*$/i.test(trimmed)) {
      return `### Key ${trimmed.match(/Highlights/i) ? "Highlights" : "Takeaways"}`;
    }
    if (/^Here'?s a summary of the content:?\s*$/i.test(trimmed)) {
      return "### Summary";
    }
    if (trimmed.startsWith("*") && !trimmed.startsWith("* ")) {
      trimmed = trimmed.replace(/^\*/, "* ");
    }
    if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
      return trimmed.replace(/\*/g, "");
    }
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      const coreText = trimmed.substring(2, trimmed.length - 2);
      if (!coreText.includes("*")) return coreText;
    }
    if ((trimmed.match(/\*\*/g) || []).length % 2 === 1 && trimmed.endsWith("**")) {
      return trimmed.slice(0, -2).trimEnd();
    }
    return trimmed;
  });
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return { title: "Episode" };
  const ep = await getEpisodeWithAccess(id, userId);
  if (!ep) return { title: "Episode not found" };
  return { title: ep.title, description: ep.description ?? undefined };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) notFound();
  const episode = await getEpisodeWithAccess(id, userId);
  if (!episode) notFound();

  const takeaways = extractKeyTakeaways(episode.description);

  return (
    <div className="episode-card-wrapper p-12 w-full max-w-5xl mx-auto space-y-6">
      <div>
        <div className="flex flex-col gap-2">
          <div className="text-xl font-semibold text-shadow-lg text-shadow-slate-900 md:text-2xl">{episode.title}</div>
          <div className="text-sm text-[#8A97A5D4]/80 episode-p pr-[10%] mb-1">
            <div className="flex flex-wrap items-center gap-2 my-2">
              {episode.duration_seconds ? <Badge variant="secondary">{Math.round((episode.duration_seconds || 0) / 60)} min</Badge> : null}
              <Badge variant="secondary">{new Date(episode.created_at).toLocaleString()}</Badge>
              <div className="text-xs text-muted-foreground break-words border-1 border-[#dcd4df36] rounded px-2 py-0 flex gap-2 items-center">
                <a className="no-underline hover:underline" href="/episodes" rel="noreferrer">Back to Episodes</a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 mb-4">
          <PlayAndShare episode={episode} signedAudioUrl={episode.signedAudioUrl} />
        </div>
        <div className="mt-4 my-8">
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
          {episode.description ? (
            <div className="prose prose-invert text-base px-6 my-8 leading-[1.8] max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{normalizeSummaryMarkdown(episode.description)}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No description available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
