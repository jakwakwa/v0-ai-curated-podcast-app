import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getStorageReader, parseGcsUri } from "@/lib/gcs";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const episodes = await prisma.userEpisode.findMany({
			where: { user_id: userId },
			orderBy: { created_at: "desc" },
			cacheStrategy: {
				swr: 60,
				ttl: 300,
			},
		});

		const storageReader = getStorageReader();

		const episodesWithSignedUrls = await Promise.all(
			episodes.map(async episode => {
				let signedAudioUrl: string | null = null;
				if (episode.gcs_audio_url) {
					const parsed = parseGcsUri(episode.gcs_audio_url);
					if (parsed) {
						const [url] = await storageReader
							.bucket(parsed.bucket)
							.file(parsed.object)
							.getSignedUrl({ action: "read", expires: Date.now() + 15 * 60 * 1000 });
						signedAudioUrl = url;
					}
				}
				return { ...episode, signedAudioUrl };
			})
		);

		return NextResponse.json(episodesWithSignedUrls);
	} catch (error) {
		console.error("[USER_EPISODES_LIST_GET]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
