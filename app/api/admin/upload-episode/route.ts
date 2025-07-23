import { Storage } from "@google-cloud/storage"
import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import prisma from "@/lib/prisma"

export const runtime = "nodejs" // Required for file system access

// Initialize Google Cloud Storage with the same configuration as functions.ts
const uploaderKeyPath = process.env.GCS_UPLOADER_KEY_PATH

if (!uploaderKeyPath) {
	throw new Error("GCS_UPLOADER_KEY_PATH environment variable is not set.")
}

const storageUploader = new Storage({
	keyFilename: uploaderKeyPath,
})

async function uploadContentToBucket(bucketName: string, data: Buffer, destinationFileName: string) {
	try {
		const [exists] = await storageUploader.bucket(bucketName).exists()

		if (!exists) {
			console.error("ERROR: Bucket does not exist:", bucketName)
			throw new Error(`Bucket ${bucketName} does not exist`)
		}

		await storageUploader.bucket(bucketName).file(destinationFileName).save(data)
		return { success: true, fileName: destinationFileName }
	} catch (error) {
		console.error("Upload error:", (error as Error).message)
		throw new Error(`Failed to upload content: ${error}`)
	}
}

export async function POST(request: Request) {
	try {
		await requireAdmin()

		const formData = await request.formData()
		const bundleId = formData.get("bundleId") as string
		const title = formData.get("title") as string
		const description = formData.get("description") as string
		const file = formData.get("file") as File

		if (!(bundleId && title && file)) {
			return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
		}

		// Verify bundle exists
		const bundle = await prisma.bundle.findUnique({
			where: { id: bundleId },
			include: {
				podcasts: {
					include: { podcast: true },
				},
			},
		})

		if (!bundle) {
			return NextResponse.json({ message: "Bundle not found" }, { status: 404 })
		}

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
		const audioUrl = `https://storage.cloud.google.com/${bucketName}/${audioFileName}`

		// Create episode in DB following the same pattern as the admin generation function
		const currentWeek = new Date()
		currentWeek.setHours(0, 0, 0, 0) // Start of day

		// Use the first podcast from the bundle as the podcast reference
		const firstPodcast = bundle.podcasts[0]?.podcast

		const episode = await prisma.episode.create({
			data: {
				title,
				description: description || "",
				audioUrl,
				imageUrl: bundle.imageUrl || null,
				publishedAt: new Date(),
				weekNr: currentWeek,
				bundleId: bundleId,
				podcastId: firstPodcast?.id || bundle.podcasts[0]?.podcastId,
			},
		})

		return NextResponse.json({
			success: true,
			episode,
			message: "Episode uploaded successfully",
		})
	} catch (error) {
		console.error("Error uploading episode:", error)

		if (error instanceof Error && error.message === "Admin access required") {
			return NextResponse.json({ message: "Admin access required" }, { status: 403 })
		}

		return NextResponse.json({ message: "Internal server error" }, { status: 500 })
	}
}
