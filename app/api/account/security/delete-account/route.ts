import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const body = await request.json()
		const { confirmation, reason } = body

		// Validate confirmation
		if (confirmation !== "DELETE_MY_ACCOUNT") {
			return new NextResponse("Invalid confirmation text", { status: 400 })
		}

		// In a real implementation, you would:
		// 1. Cancel any active subscriptions
		// 2. Delete user data from external services
		// 3. Send confirmation email
		// 4. Log the deletion for audit purposes
		// 5. Finally delete from database

		// For now, we'll simulate the deletion process
		await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing time

		// Delete user from database (cascade will handle related records)
		await prisma.user.delete({
			where: { user_id: userId },
		})

		return NextResponse.json({
			success: true,
			message: "Account deleted successfully",
		})
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		console.error("[ACCOUNT_DELETE]", message)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
