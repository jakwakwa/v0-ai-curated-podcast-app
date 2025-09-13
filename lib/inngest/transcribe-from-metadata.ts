import { z } from "zod";
import { writeEpisodeDebugLog } from "@/lib/debug-logger";
import { prisma } from "@/lib/prisma";
// URL-only mandate: removed external audio discovery
import { inngest } from "./client";

type MetadataPayload = {
	userEpisodeId: string;
	title: string;
	podcastName?: string;
	youtubeUrl: string;
	generationMode?: "single" | "multi";
	voiceA?: string;
	voiceB?: string;
};

// AssemblyAI helpers removed — AssemblyAI is no longer used as a fallback.

// --- Audio resolution helpers -------------------------------------------------
function isYouTubeUrl(url: string): boolean {
	try {
		const { hostname } = new URL(url);
		const host = hostname.toLowerCase();
		return host === "youtu.be" || host.endsWith(".youtu.be") || host === "youtube.com" || host.endsWith(".youtube.com");
	} catch {
		return false;
	}
}

// Note: No direct-audio URL detection is needed per URL-only mandate

// NOTE: duplicate YouTube extraction removed; use shared util if needed elsewhere

export const enqueueTranscriptionJob = inngest.createFunction(
	{ id: "enqueue-transcription-job", name: "Enqueue Transcription Job", retries: 2 },
	{ event: "user.episode.metadata.requested" },
	async ({ event, step }) => {
		const payload = event.data as MetadataPayload;
		const { userEpisodeId, title, podcastName, youtubeUrl, generationMode, voiceA, voiceB } = payload;

		const inputSchema = z.object({
			userEpisodeId: z.string().min(1),
			title: z.string().min(2),
			podcastName: z.string().optional(),
			youtubeUrl: z.string().url(),
		});
		const parsed = inputSchema.safeParse({ userEpisodeId, title, podcastName, youtubeUrl });
		if (!parsed.success) throw new Error(parsed.error.message);

		// 1) Mark processing
		await step.run("mark-processing", async () => {
			await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { status: "PROCESSING" } });
			await writeEpisodeDebugLog(userEpisodeId, { step: "status", status: "start", message: "PROCESSING" });
		});

		// 2) URL-only: require YouTube URL
		if (!(youtubeUrl && isYouTubeUrl(youtubeUrl))) {
			await step.run("mark-failed-no-url", async () => {
				await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { status: "FAILED" } });
				await writeEpisodeDebugLog(userEpisodeId, { step: "resolve-src", status: "fail", message: "Missing or invalid YouTube URL" });
			});
			return { message: "Missing or invalid YouTube URL", userEpisodeId };
		}

		const srcUrl: string = youtubeUrl;

		// Store the resolved url (direct audio or YouTube) for traceability
		await step.run("store-src-url", async () => {
			await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { youtube_url: srcUrl } });
			await writeEpisodeDebugLog(userEpisodeId, { step: "resolve-src", status: "success", meta: { srcUrl } });
		});

		// 3) Dispatch event-driven saga and let it orchestrate providers and fallbacks
		const jobId = `ue-${userEpisodeId}-${Date.now()}`;
		await writeEpisodeDebugLog(userEpisodeId, { step: "saga", status: "info", message: "sending transcription.job.requested", meta: { jobId } });
		await step.sendEvent("start-saga", {
			name: "transcription.job.requested",
			data: { jobId, userEpisodeId, srcUrl, generationMode, voiceA, voiceB },
		});
		await writeEpisodeDebugLog(userEpisodeId, { step: "saga", status: "success", message: "sent transcription.job.requested", meta: { jobId } });

		await writeEpisodeDebugLog(userEpisodeId, { step: "saga", status: "info", meta: { jobId, state: "queued" } });
		return { message: "Transcription saga dispatched", userEpisodeId, jobId };
	}
);

export type { MetadataPayload };
