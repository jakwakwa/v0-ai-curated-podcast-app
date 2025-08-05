import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const { userId, tags } = body
		
		// Invalidate user-specific episode cache
		const tagsToInvalidate = tags || (userId ? [`user_episodes_${userId}`] : ["active_bundles"])
		
		await prisma.$accelerate.invalidate({
			tags: tagsToInvalidate,
		})
		
		return NextResponse.json({ 
			success: true, 
			invalidated: tagsToInvalidate 
		})
	} catch (_error) {
		return NextResponse.json({ error: "Failed to invalidate cache" }, { status: 500 })
	}
}
