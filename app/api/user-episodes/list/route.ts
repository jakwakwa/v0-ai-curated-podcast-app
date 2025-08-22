import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { ensureBucketName, getStorageReader } from "@/lib/gcs"
import { prisma } from "@/lib/prisma"

export async function GET(_request: Request) {
	try {
		const { userId } = await auth()
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const episodes = await prisma.userEpisode.findMany({
			where: { user_id: userId },
			orderBy: { created_at: "desc" },
		})

		const storageReader = getStorageReader()
		const bucketName = ensureBucketName()

		const episodesWithSignedUrls = await Promise.all(
			episodes.map(async episode => {
				let signedAudioUrl: string | null = null
				if (episode.gcs_audio_url) {
					// GCS URL is in gs://<bucket>/<object> format
					const objectName = episode.gcs_audio_url.replace(`gs://${bucketName}/`, "")
					const [url] = await storageReader
						.bucket(bucketName)
						.file(objectName)
						.getSignedUrl({
							action: "read",
							expires: Date.now() + 15 * 60 * 1000, // 15 minutes
						})
					signedAudioUrl = url
				}
				return { ...episode, signedAudioUrl }
			})
		)

		return NextResponse.json(episodesWithSignedUrls)
	} catch (error) {
		console.error("[USER_EPISODES_LIST_GET]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
