import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"

export async function GET() {
	try {
		// First check if user is authenticated
		const { userId } = await auth()

		if (!userId) {
			// User is not authenticated
			return NextResponse.json({ isAdmin: false }, { status: 401 })
		}

		const adminStatus = await isAdmin()

		return NextResponse.json({ isAdmin: adminStatus })
	} catch (error) {
		console.error("Error checking admin status:", error)

		// More specific error handling
		if (error instanceof Error) {
			// Log the specific error message for debugging
			console.error("Admin check error details:", {
				message: error.message,
				stack: error.stack,
				name: error.name,
			})

			// If it's an authentication error, return 401
			if (error.message.includes("401") || error.message.includes("Unauthorized")) {
				return NextResponse.json({ isAdmin: false }, { status: 401 })
			}

			// If it's a user not found or similar issue, return false but with 200 status
			if (error.message.includes("User not found") || error.message.includes("not found")) {
				return NextResponse.json({ isAdmin: false })
			}
		}

		// For any other errors, return false instead of 500 to prevent UI errors
		return NextResponse.json({ isAdmin: false })
	}
}
