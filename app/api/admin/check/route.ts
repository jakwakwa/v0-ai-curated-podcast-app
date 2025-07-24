import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { isOrgAdmin } from "@/lib/organization-roles"
import { prisma } from "@/lib/prisma"

// Force this API route to be dynamic since it uses auth()
export const dynamic = "force-dynamic"

export async function GET() {
	try {
		// Add debugging for API route execution
		if (process.env.DEBUG?.includes("prisma")) {
			console.log("🔍 API route: /api/admin/check started")
			console.log("🔍 Prisma client available:", !!prisma)
		}

		const { userId } = await auth()
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const isAdmin = await isOrgAdmin()
		if (!isAdmin) {
			return new NextResponse("Forbidden", { status: 403 })
		}

		// Test Prisma connection
		if (process.env.DEBUG?.includes("prisma")) {
			console.log("🔍 Testing Prisma connection...")
		}

		// Simple query to test Prisma Client
		const userCount = await prisma.user.count()

		if (process.env.DEBUG?.includes("prisma")) {
			console.log("✅ Prisma connection successful, user count:", userCount)
		}

		return NextResponse.json({
			status: "ok",
			isAdmin: true,
			userCount,
			timestamp: new Date().toISOString(),
		})
	} catch (error) {
		console.error("❌ Error in /api/admin/check:", error)

		if (process.env.DEBUG?.includes("prisma")) {
			console.log("🔍 Error details:", {
				name: error instanceof Error ? error.name : "Unknown",
				message: error instanceof Error ? error.message : String(error),
				stack: error instanceof Error ? error.stack : undefined,
			})
		}

		return new NextResponse("Internal Server Error", { status: 500 })
	}
}
