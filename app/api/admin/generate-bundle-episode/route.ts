import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import { requireAdminMiddleware } from "@/lib/admin-middleware";
import { prisma } from "@/lib/prisma";

// Force this API route to be dynamic since it uses requireOrgAdmin() which calls auth()
// export const dynamic = "force-dynamic"
export const maxDuration = 60; // 1 minute should be enough for Inngest job dispatch

interface EpisodeSource {
	id: string; // references existing Episode or UserEpisode id used as transcription source
	name: string;
	url: string;
	showId?: string;
}

interface AdminGenerationRequest {
	bundleId: string;
	podcastId: string;
	title: string; // will be applied to first (or only) generated episode unless overridden later
	description?: string;
	image_url?: string; // currently unused here but preserved for future enrichment
	sources: EpisodeSource[]; // at least one source required
}

export async function POST(request: Request) {
	try {
		// First check admin status
		const adminCheck = await requireAdminMiddleware();
		if (adminCheck) {
			return adminCheck; // Return error response if not admin
		}

		// If we get here, user is admin
		const { userId } = await auth();

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const body: AdminGenerationRequest = await request.json();
		const { bundleId, podcastId, title, sources } = body;

		if (!(bundleId && podcastId && title && sources) || sources.length === 0) {
			return NextResponse.json({ error: "Missing required fields: bundleId, podcastId, title, and sources" }, { status: 400 });
		}

		// Validate that the bundle exists (and fetch podcasts)
		const bundle = await prisma.bundle.findUnique({
			where: { bundle_id: bundleId },
			include: { bundle_podcast: true },
		});

		if (!bundle) {
			return NextResponse.json({ error: "Bundle not found" }, { status: 404 });
		}

		// Validate that the selected podcast is part of the bundle
		const isMember = bundle.bundle_podcast.some(bp => bp.podcast_id === podcastId);
		if (!isMember) {
			return NextResponse.json({ error: "Selected podcast is not in the chosen bundle" }, { status: 400 });
		}

		// Emit one generation request per source (could be batched later if needed)
		for (const [index, source] of sources.entries()) {
			await inngest.send({
				name: "admin.episode.generate.requested",
				data: {
					sourceEpisodeId: source.id,
					podcastId,
					adminUserId: userId,
					title: sources.length === 1 ? title : `${title} (Part ${index + 1})`,
				},
			});
		}

		return NextResponse.json({ success: true, message: "Admin episode generation dispatched", count: sources.length });
	} catch (error) {
		console.error("Admin generate bundle episode error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
