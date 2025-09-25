// @ts-nocheck

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; // Use the global client
import { withDatabaseTimeout } from "../../../lib/utils";

// Force this API route to always execute on each request (no ISR / caching)
export const dynamic = "force-dynamic";

// export const dynamic = "force-dynamic"
export const maxDuration = 60; // 1 minute for complex database queries

export async function GET(_request: Request) {
	try {
		const { userId } = await auth();

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Episodes should relate to podcasts; visibility via user's selected bundle membership
		const profile = await prisma.userCurationProfile.findFirst({
			where: { user_id: userId, is_active: true },
			include: { selectedBundle: { include: { bundle_podcast: true } } },
		});

		const podcastIdsInSelectedBundle = profile?.selectedBundle?.bundle_podcast.map(bp => bp.podcast_id) ?? [];

		const episodes = await withDatabaseTimeout(
			prisma.episode.findMany({
				where: {
					OR: [
						{ userProfile: { user_id: userId } },
						...(podcastIdsInSelectedBundle.length > 0 ? [{ podcast_id: { in: podcastIdsInSelectedBundle } }] : []),
						...(profile?.selectedBundle?.bundle_id ? [{ bundle_id: profile.selectedBundle.bundle_id }] : []),
					],
				},
				include: {
					podcast: true,
					userProfile: true,
				},
				orderBy: { created_at: "desc" },
			})
		);

		// Explicitly disable any downstream caching; add timestamp header to bust CDN layers if any
		return NextResponse.json(episodes, {
			headers: {
				"Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
				Pragma: "no-cache",
				Expires: "0",
				"X-Data-Timestamp": Date.now().toString(),
			},
		});
	} catch (error) {
		console.error("Episodes API: Error fetching episodes:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
