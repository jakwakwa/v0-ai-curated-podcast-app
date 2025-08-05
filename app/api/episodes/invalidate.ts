import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
	try {
		await prisma.$accelerate.invalidate({
			tags: ["findMany_episodes"],
		})
		return NextResponse.json({ success: true })
	} catch (_error) {
		return NextResponse.json({ error: "Failed to invalidate cache" }, { status: 500 })
	}
}
