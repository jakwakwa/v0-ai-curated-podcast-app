"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import prisma from "@/lib/prisma"
import type { FormState } from "@/lib/types"
import { auth, currentUser } from "@clerk/nextjs/server"
import { inngest } from "../inngest/client"

async function fetchYouTubeVideoDetails(url: string) {
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
		const draftCollection = await prisma.collection.findFirst({
			where: { userId: userId, status: "Draft" },
		})

		if (!draftCollection) {
			return { success: false, message: "Could not find a draft collection." }
		}

		// Fetch YouTube video details
		const videoDetails = await fetchYouTubeVideoDetails(url)

		await prisma.source.create({
			data: {
				collectionId: draftCollection.id,
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

export async function removePodcastSource(formData: FormData) {
	const { userId } = await auth()
	if (!userId) return

	const id = formData.get("id") as string
	try {
		const source = await prisma.source.findUnique({
			where: { id },
			include: { collection: true },
		})
		if (source?.collection.userId === userId) {
			await prisma.source.delete({ where: { id } })
		}
	} catch (_error) {}

	revalidatePath("/build")
}

export async function saveCuration(formData: FormData) {
	const { userId } = await auth()
	if (!userId) return

	const collectionId = formData.get("collectionId") as string
	// Reverting to automatically generated name for the collection

	try {
		await prisma.$transaction([
			prisma.collection.update({
				where: { id: collectionId, userId: userId },
				data: {
					status: "Saved",
					name: `of Collection: ${new Date().toLocaleDateString("en-ZA", { timeZone: "Africa/Johannesburg" })}`, // Reverting to auto-generated name
				},
			}),
			prisma.collection.create({
				data: {
					userId: userId,
					name: "New Weekly Curation",
					status: "Draft",
				},
			}),
		])
	} catch (_error) {
		return
	}

	redirect("/")
}

export async function updatePodcastSourceName(id: string, newName: string): Promise<FormState> {
	const { userId } = await auth()
	if (!userId) {
		return { success: false, message: "Not authenticated." }
	}

	try {
		const source = await prisma.source.findUnique({
			where: { id },
			include: { collection: true },
		})

		if (!source || source.collection.userId !== userId) {
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

export async function createDraftCollection() {
	const { userId } = await auth()
	const user = await currentUser()

	if (!userId) {
		return
	}

	try {
		// Ensure the user exists in our database
		let dbUser = await prisma.user.findUnique({
			where: { id: userId },
		})

		if (!dbUser) {
			// If user doesn't exist in our DB, create them
			dbUser = await prisma.user.create({
				data: {
					id: userId,
					email: user?.emailAddresses?.[0]?.emailAddress || "", // Use primary email from Clerk
					name: user?.firstName || user?.username || "", // Use first name or username
					password: "", // Password is not stored for Clerk users
					// Add other fields if necessary from Clerk's user object
				},
			})
		}

		await prisma.collection.create({
			data: {
				userId: dbUser.id,
				name: "New Weekly Curation",
				status: "Draft",
			},
		})

		revalidatePath("/build")
	} catch (_error) {
		return
	}

	redirect("/build")
}

export async function getCollectionStatus(collectionId: string) {
	const { userId } = await auth()
	if (!userId) {
		return null
	}
	try {
		const collection = await prisma.collection.findUnique({
			where: { id: collectionId, userId: userId },
			include: { sources: true },
		})
		if (!collection) return null

		return {
			...collection,
			sources: collection.sources.map(source => ({
				...source,
				imageUrl: source.imageUrl || "",
			})),
		}
	} catch (_error) {
		return null
	}
}

export async function triggerPodcastGeneration(collectionId: string) {
	const { userId } = await auth()
	if (!userId) {
		return { success: false, message: "Not authenticated." }
	}

	try {
		await inngest.send({
			name: "podcast/generate.requested",
			data: { collectionId },
		})
		return { success: true, message: "Podcast generation initiated!" }
	} catch (_error) {
		return { success: false, message: "Failed to initiate podcast generation." }
	}
}
