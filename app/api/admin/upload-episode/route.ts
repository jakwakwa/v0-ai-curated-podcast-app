import { auth } from "@clerk/nextjs/server"
import { Storage } from "@google-cloud/storage"
import { NextResponse } from "next/server"
import { requireAdminMiddleware } from "@/lib/admin-middleware"
import { prisma } from "@/lib/prisma"
import { withUploadTimeout } from "@/lib/utils"

// Force this API route to be dynamic since it uses auth()
// export const dynamic = "force-dynamic"
export const runtime = "nodejs" // Required for file system access
export const maxDuration = 300 // 5 minutes for file uploads

// Lazily initialize Google Cloud Storage uploader. Supports both JSON and key file path.
let _storageUploader: Storage | undefined

function looksLikeJson(value: string | undefined): boolean {
    if (!value) return false
    const trimmed = value.trim()
    return trimmed.startsWith("{") || trimmed.startsWith("[") || trimmed.includes('"type"')
}

function getUploaderRaw(): string | undefined {
    return (
        process.env.GCS_UPLOADER_KEY_JSON ||
        process.env.GCS_UPLOADER_KEY ||
        process.env.GCS_UPLOADER_KEY_PATH
    )
}

function getStorageUploader(): Storage {
    if (_storageUploader) return _storageUploader
    const raw = getUploaderRaw()
    if (!raw) {
        // Do not leak env var names or values beyond this message
        throw new Error("Google Cloud credentials for uploader are not configured")
    }
    try {
        if (looksLikeJson(raw)) {
            _storageUploader = new Storage({ credentials: JSON.parse(raw) })
        } else {
            _storageUploader = new Storage({ keyFilename: raw })
        }
        return _storageUploader
    } catch (err) {
        throw new Error("Failed to initialize Google Cloud Storage uploader")
    }
}

async function uploadContentToBucket(bucketName: string, data: Buffer, destinationFileName: string) {
	try {
        const storage = getStorageUploader()
        const [exists] = await storage.bucket(bucketName).exists()

		if (!exists) {
			console.error("ERROR: Bucket does not exist:", bucketName)
			throw new Error(`Bucket ${bucketName} does not exist`)
		}

        await withUploadTimeout(storage.bucket(bucketName).file(destinationFileName).save(data))
		return { success: true, fileName: destinationFileName }
	} catch (error) {
        console.error("Upload error")
        // Avoid leaking sensitive path/JSON in error messages
        throw new Error("Failed to upload content")
	}
}

export async function POST(request: Request) {
	try {
		// First check admin status
		const adminCheck = await requireAdminMiddleware()
		if (adminCheck) {
			return adminCheck // Return error response if not admin
		}

		// If we get here, user is admin
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const formData = await request.formData()
		const bundleId = formData.get("bundleId") as string
		const title = formData.get("title") as string
		const description = formData.get("description") as string
		const image_url = formData.get("image_url") as string | null
		const file = formData.get("file") as File
		const audioUrl = formData.get("audioUrl") as string | null

		console.log("Upload episode request:", {
			bundleId,
			title,
			hasDescription: !!description,
			hasImageUrl: !!image_url,
			hasFile: !!file,
			hasAudioUrl: !!audioUrl,
			fileName: file?.name,
		})

		// Validate that either file or audioUrl is provided
		if (!(bundleId && title && (file || audioUrl))) {
			console.log("Validation failed:", {
				bundleId: !!bundleId,
				title: !!title,
				file: !!file,
				audioUrl: !!audioUrl,
			})
			return NextResponse.json(
				{
					message: "Missing required fields. Please provide either a file upload or an audio URL.",
				},
				{ status: 400 }
			)
		}

		// Verify bundle exists
		const bundle = await prisma.bundle.findUnique({
			where: { bundle_id: bundleId },
			include: {
				bundle_podcast: {
					include: { podcast: true },
				},
			},
		})

		if (!bundle) {
			console.log("Bundle not found:", bundleId)
			return NextResponse.json({ message: "Bundle not found" }, { status: 404 })
		}

		if (bundle.bundle_podcast.length === 0) {
			console.log("Bundle has no podcasts:", bundleId)
			return NextResponse.json({ message: "Bundle has no podcasts. Please add podcasts to the bundle first." }, { status: 400 })
		}

		console.log("Bundle found:", {
			bundleId: bundle.bundle_id,
			name: bundle.name,
			podcastCount: bundle.bundle_podcast.length,
		})

		let finalAudioUrl: string

		// Handle file upload to GCS
		if (file) {
			// Convert file to buffer
			const buffer = Buffer.from(await file.arrayBuffer())

			// Generate filename following the same pattern as functions.ts
			const audioFileName = `podcasts/${bundleId}-${Date.now()}.mp3`

			// Upload to the same Google Cloud Storage bucket
			const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME!
			const uploadResult = await uploadContentToBucket(bucketName, buffer, audioFileName)

			if (!uploadResult.success) {
				return NextResponse.json({ message: "Failed to upload file to storage" }, { status: 500 })
			}

			// Create the full URL following the same pattern as functions.ts
			finalAudioUrl = `https://storage.cloud.google.com/${bucketName}/${audioFileName}`
		} else {
			// Use the provided audio URL directly
			finalAudioUrl = audioUrl!
		}

		// Create episode in DB following the same pattern as the admin generation function
		const currentWeek = new Date()
		currentWeek.setHours(0, 0, 0, 0) // Start of day

		// Use the first podcast from the bundle as the podcast reference
		const firstPodcast = bundle.bundle_podcast[0]?.podcast

		console.log("Creating episode with:", {
			title,
			audioUrl: finalAudioUrl,
			bundleId,
			podcastId: firstPodcast?.podcast_id,
			hasFirstPodcast: !!firstPodcast,
		})

		const episode = await prisma.episode.create({
			data: {
				episode_id: `episode_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				title,
				description: description || "",
				audio_url: finalAudioUrl,
				image_url: image_url || bundle.image_url || null,
				published_at: new Date(),
				week_nr: currentWeek,
				bundle_id: bundleId,
				podcast_id: firstPodcast?.podcast_id || bundle.bundle_podcast[0]?.podcast_id,
			},
		})

		console.log("Episode created successfully:", episode.episode_id)

		return NextResponse.json({
			success: true,
			episode,
			message: "Episode uploaded successfully",
		})
	} catch (error) {
		console.error("Error uploading episode:", error)

		if (error instanceof Error && (error.message.includes("Organization role required") || error.message === "Admin access required")) {
			return NextResponse.json({ message: "Admin access required" }, { status: 403 })
		}

		return NextResponse.json({ message: "Internal server error" }, { status: 500 })
	}
}
