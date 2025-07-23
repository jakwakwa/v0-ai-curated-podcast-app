import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { inngest } from "@/inngest/client"
import { requireAdmin } from "@/lib/admin"
import prisma from "@/lib/prisma"

interface EpisodeSource {
	id: string
	name: string
	url: string
	showId?: string
}

interface AdminGenerationRequest {
	bundleId: string
	title: string
	description?: string
	sources: EpisodeSource[]
}

export async function POST(request: NextRequest) {
	try {
		// Check admin permissions first
		await requireAdmin()

		const body: AdminGenerationRequest = await request.json()
		const { bundleId, title, description, sources } = body

		// Validate input
		if (!(bundleId && title && sources) || sources.length === 0) {
			return NextResponse.json({ message: "Missing required fields: bundleId, title, and sources" }, { status: 400 })
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

		// Validate YouTube URLs
		const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
		for (const source of sources) {
			if (!youtubeUrlRegex.test(source.url)) {
				return NextResponse.json({ message: `Invalid YouTube URL for source: ${source.name}` }, { status: 400 })
			}
		}

		// Create a temporary admin "curation profile" for this generation
		const adminCurationProfile = {
			id: `admin-${bundleId}-${Date.now()}`,
			name: title,
			description,
			sources: sources.map(source => ({
				id: source.id,
				name: source.name,
				url: source.url,
				imageUrl: null,
				createdAt: new Date().toISOString(),
			})),
			bundleId,
		}

		// Trigger the admin podcast generation workflow
		await inngest.send({
			name: "podcast/admin-generate.requested",
			data: {
				adminCurationProfile,
				bundleId,
				episodeTitle: title,
				episodeDescription: description,
			},
		})

		return NextResponse.json({
			message: "Admin episode generation started successfully",
			bundleId,
			title,
			sourcesCount: sources.length,
		})
	} catch (error) {
		console.error("Error in admin generate bundle episode:", error)

		if (error instanceof Error && error.message === "Admin access required") {
			return NextResponse.json({ message: "Admin access required" }, { status: 403 })
		}

		return NextResponse.json({ message: "Internal server error" }, { status: 500 })
	}
}
