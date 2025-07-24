import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { isOrgAdmin } from "@/lib/organization-roles"
import { prisma } from "@/lib/prisma"

// Force this API route to be dynamic since it uses auth()
export const dynamic = "force-dynamic"

export async function GET() {
	try {
		const { userId } = await auth()
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const isAdmin = await isOrgAdmin()
		if (!isAdmin) {
			return new NextResponse("Forbidden", { status: 403 })
		}

		// Simple query to test Prisma Client
		const userCount = await prisma.user.count()

		return NextResponse.json({
			status: "ok",
			isAdmin: true,
			userCount,
			timestamp: new Date().toISOString(),
		})
	} catch (error) {
		console.error("Error in /api/admin/check:", error)
		return new NextResponse("Internal Server Error", { status: 500 })
	}
}
