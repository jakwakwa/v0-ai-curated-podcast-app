import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { inngest } from "@/inngest/client"
import { requireOrgAdmin } from "@/lib/organization-roles"
import { prisma } from "@/lib/prisma"

// Force this API route to be dynamic since it uses requireOrgAdmin() which calls auth()
export const dynamic = 'force-dynamic'

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
	image_url?: string
	sources: EpisodeSource[]
}

export async function POST(request: NextRequest) {
	try {
		// Check admin permissions first
		await requireOrgAdmin()

		const body: AdminGenerationRequest = await request.json()
		const { bundleId, title, description, image_url, sources } = body

		if (!bundleId || !title || !sources || sources.length === 0) {
			return NextResponse.json({ error: "Missing required fields: bundleId, title, and sources" }, { status: 400 })
		}

		// Validate that the bundle exists
		const bundle = await prisma.bundle.findUnique({
			where: { bundle_id: bundleId },
		})

		if (!bundle) {
			return NextResponse.json({ error: "Bundle not found" }, { status: 404 })
		}

		// Send event to Inngest for background processing
		await inngest.send({
			name: "admin/generate-bundle-episode",
			data: {
				bundleId,
				title,
				description,
				image_url,
				sources,
			},
		})

		return NextResponse.json({
			success: true,
			message: "Episode generation started successfully",
			bundleId,
			title,
		})
	} catch (error) {
		console.error("[ADMIN_GENERATE_BUNDLE_EPISODE]", error)

		if (error instanceof Error && error.message.includes("admin role required")) {
			return NextResponse.json({ error: "Admin access required" }, { status: 403 })
		}

		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}
