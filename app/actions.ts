"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import prisma from "@/lib/prisma"
import type { FormState, UserCurationProfileWithRelations } from "@/lib/types"
import { auth, currentUser } from "@clerk/nextjs"
import { inngest } from "../inngest/client"



// TODO: use these exports in /api/admin/
// TODO: use these exports in /app/(protected)/admin/page.tsx
//
export async function fetchYouTubeVideoDetails(url: string) {
	try {
		// Extract video ID from YouTube URL
		const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/)
		const videoId = videoIdMatch ? videoIdMatch[1] : null

		if (!videoId) {
			throw new Error("Could not extract video ID from URL")
		}

		// Fetch video details using YouTube oEmbed API
		const response = await fetch(
			`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
		)

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
			where: { userId: userId, status: "Draft" },
		})

		if (!draftUserCurationProfile) {
			return { success: false, message: "Could not find a draft user curation profile." }
		}

		// Fetch YouTube video details
		const videoDetails = await fetchYouTubeVideoDetails(url)

		await prisma.source.create({
			data: {
				userCurationProfileId: draftUserCurationProfile.id,
				name: videoDetails.title,
				url: url,
				imageUrl: videoDetails.thumbnail,
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
// TODO: use these exports in /app/(protected)/build/page.tsx
export async function removePodcastSource(formData: FormData) {
	const { userId } = await auth()
	if (!userId) return

	const id = formData.get("id") as string
	try {
		const source = await prisma.source.findUnique({
			where: { id },
			include: { userCurationProfile: true },
		})
		if (source?.userCurationProfile?.userId === userId) {
			await prisma.source.delete({ where: { id } })
		}
	} catch (_error) {}

	revalidatePath("/build")
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
				where: { id: userCurationProfileId, userId: userId },
				data: {
					status: "Saved",
					name: "Source User Curation Profile",
				},
			}),
			prisma.userCurationProfile.create({
				data: {
					userId: userId,
					name: "New Weekly Curation",
					status: "Draft",
					createdAt: new Date(), // Explicitly set the current timestamp
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
export async function updatePodcastSourceName(id: string, newName: string): Promise<FormState> {
	const { userId } = await auth()
	if (!userId) {
		return { success: false, message: "Not authenticated." }
	}

	try {
		const source = await prisma.source.findUnique({
			where: { id },
			include: { userCurationProfile: true },
		})

		if (!source || source.userCurationProfile?.userId !== userId) {
			return { success: false, message: "Source not found or unauthorized." }
		}

		await prisma.source.update({
			where: { id },
			data: { name: newName },
		})

		revalidatePath("/build")
		return { success: true, message: "Show name updated successfully." }
	} catch (_error) {
		return { success: false, message: "Failed to update show name." }
	}
}


// TODO: use these exports in /app/(protected)/curated-bundles
// TODO: use these exports in /app/(protected)/dashboard/page.tsx
export async function getUserCurationProfileStatus(
	userCurationProfileId: string
): Promise<UserCurationProfileWithRelations | null> {
	const { userId } = await auth()
	if (!userId) {
		return null
	}
	try {
		const userCurationProfile = await prisma.userCurationProfile.findUnique({
			where: { id: userCurationProfileId, userId: userId },
			include: { sources: true, selectedBundle: { include: { bundlePodcasts: { include: { podcast: true } } } } }, // Include sources and selectedBundle
		})
		if (!userCurationProfile) return null

		// Transform the object to match UserCurationProfileWithRelations
		return {
			...userCurationProfile,
			status: userCurationProfile.status as UserCurationProfileWithRelations["status"],
			sources: userCurationProfile.sources.map(source => ({
				...source,
				imageUrl: source.imageUrl || "",
			})),
			selectedBundle: userCurationProfile.selectedBundle
				? {
						...userCurationProfile.selectedBundle,
						podcasts: userCurationProfile.selectedBundle.bundlePodcasts.map(bp => bp.podcast),
					}
				: null,
			episodes: [], // Add this line to include the episodes property
		}
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.error("Error fetching user curation profile status:", message) // Keep for server-side logging
		return null
	}
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
			where: { id: userCurationProfileId, userId: userId },
			data: {
				status: "Generated",
				generatedAt: new Date(),
			},
		})

		await inngest.send({
			name: "podcast/generate.requested",
			data: { user: { id: userId }, userCurationProfile: { id: userCurationProfileId } },
		})

		revalidatePath("/build")
		revalidatePath("/")
		return { success: true, message: "Podcast generation triggered." }
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.error("Error triggering podcast generation:", message)
		return { success: false, message: "Failed to trigger podcast generation." }
	}
}
