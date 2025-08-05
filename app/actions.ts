"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import type { FormState, UserCurationProfile } from "@/lib/types"
import { inngest } from "../inngest/client"

// TODO: use these exports in /api/admin/
// TODO: use these exports in /app/(protected)/admin/page.tsx
export async function fetchYouTubeVideoDetails(url: string) {
	try {
		// Extract video ID from YouTube URL
		const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/)
		const videoId = videoIdMatch ? videoIdMatch[1] : null

		if (!videoId) {
			throw new Error("Could not extract video ID from URL")
		}

		// Fetch video details using YouTube oEmbed API
		const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)

		if (!response.ok) {
			throw new Error(`Failed to fetch video details: ${response.status}`)
		}

		const data = await response.json()
		return {
			title: data.title,
			thumbnail: data.thumbnail_url,
		}
	} catch (_error) {
		return {
			title: "Unknown Video",
			thumbnail: "/placeholder.svg",
		}
	}
}

// TODO: use these exports in /api/admin/
// TODO: use these exports in /app/(protected)/admin/page.tsx
// TODO: use these exports in /app/(protected)/build/page.tsx
// TODO: use these exports in /app/(protected)/build/page.tsx
export async function addPodcastSource(_prevState: FormState, formData: FormData) {
	const { userId } = await auth()

	if (!userId) return { success: false, message: "Not authenticated" }

	const url = formData.get("url") as string
	// Updated URL validation for YouTube
	const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
	if (!(url && youtubeUrlRegex.test(url))) {
		return {
			success: false,
			message: "Please enter a valid YouTube video URL.",
		}
	}

	try {
		const draftUserCurationProfile = await prisma.userCurationProfile.findFirst({
			where: { user_id: userId, status: "Draft" },
		})

		if (!draftUserCurationProfile) {
			return { success: false, message: "Could not find a draft user curation profile." }
		}

		// Fetch YouTube videox details
		const videoDetails = await fetchYouTubeVideoDetails(url)

		await prisma.podcast.create({
			// @ts-ignore
			data: {
				name: videoDetails.title,
				url: url,
				image_url: videoDetails.thumbnail,
				description: null,
			},
		})

		revalidatePath("/build")
		return { success: true, message: "Source added to your draft." }
	} catch (_error) {
		return { success: false, message: "Failed to add source to database." }
	}
}

// TODO: use these exports in /api/admin/
// TODO: use these exports in /app/(protected)/admin/page.tsx
// TODO: use these exports in /app/(protected)/build/page.tsx
export async function removePodcastSource() {
	// TODO: Fix this function after the database schema migration is complete
	console.log("removePodcastSource temporarily disabled")
}

// TODO: use these exports in /api/admin/
export async function saveCuration(formData: FormData) {
	const { userId } = await auth()
	if (!userId) return

	const userCurationProfileId = formData.get("userCurationProfileId") as string
	// Reverting to automatically generated name for the user curation profile

	try {
		await prisma.$transaction([
			prisma.userCurationProfile.update({
				where: { user_id: userCurationProfileId, profile_id: userId },
				data: {
					status: "Saved",
					name: "Source User Curation Profile",
				},
			}),
			prisma.userCurationProfile.create({
				// TODO: FIX LATER
				// @ts-ignore
				data: {
					user_id: userId,
					name: "New Weekly Curation",
					status: "Draft",
					created_at: new Date(), // Explicitly set the current timestamp
				},
			}),
		])
	} catch (_error) {
		return
	}

	revalidatePath("/")
	redirect("/")
}

// TODO: use these exports in /api/admin/
// TODO: use these exports in /app/(protected)/admin/page.tsx
// TODO: use these exports in /app/(protected)/build/page.tsx
// TODO: use these exports in /app/(protected)/build/page.tsx
export async function updatePodcastSourceName(_id: string, _newName: string): Promise<FormState> {
	// TODO: Fix this function after the database schema migration is complete
	return { success: false, message: "Function temporarily disabled during migration." }
}

// TODO: use these exports in /app/(protected)/curated-bundles
// TODO: use these exports in /app/(protected)/dashboard/page.tsx
export async function getUserCurationProfileStatus(_userCurationProfileId: string): Promise<UserCurationProfile | null> {
	// TODO: Fix this function after the database schema migration is complete
	return null
}

// TODO: use these exports in /app/(protected)/dashboard/page.tsx
// TODO: use these exports in /app/(protected)/curated-bundles/page.tsx
// TODO: use these exports in /app/(protected)/admin/page.tsx
// TODO: use these exports in /app/(protected)/build/page.tsx
// TODO: use these exports in /app/(protected)/build/page.tsx
export async function triggerPodcastGeneration(userCurationProfileId: string) {
	const { userId } = await auth()
	if (!userId) {
		return { success: false, message: "Not authenticated." }
	}

	try {
		// Update the user curation profile status and set generatedAt timestamp
		await prisma.userCurationProfile.update({
			where: { user_id: userCurationProfileId, profile_id: userId },
			data: {
				status: "Generated",
				generated_at: new Date(),
			},
		})

		await inngest.send({
			name: "podcast/generate-gemini-tts.requested",
			data: { collectionId: userCurationProfileId },
		})

		revalidatePath("/build")
		revalidatePath("/")
		return { success: true, message: "Podcast generation triggered." }
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		console.error("Error triggering podcast generation:", message)
		return { success: false, message: "Failed to trigger podcast generation." }
	}
}

export async function createDraftUserCurationProfile() {
	const { userId } = await auth()

	if (!userId) {
		throw new Error("Not authenticated")
	}

	try {
		// Check if user already has a draft profile
		const existingDraft = await prisma.userCurationProfile.findFirst({
			where: { user_id: userId, status: "Draft" },
		})

		if (existingDraft) {
			// If draft already exists, just redirect to the build page
			redirect("/build")
			return
		}

		// Create new draft user curation profile

		await prisma.userCurationProfile.create({
			// @ts-ignore
			data: {
				user_id: userId,
				name: "New Weekly Curation",
				status: "Draft",
				created_at: new Date(),
			},
		})

		revalidatePath("/build")
		redirect("/build")
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		console.error("Error creating draft user curation profile:", message)
		throw new Error("Failed to create draft user curation profile")
	}
}
