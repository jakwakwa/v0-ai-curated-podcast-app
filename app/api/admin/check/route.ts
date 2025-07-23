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

		// If it's an authentication error, return 401
		if (error instanceof Error && error.message.includes("401")) {
			return NextResponse.json({ isAdmin: false }, { status: 401 })
		}

		return NextResponse.json({ isAdmin: false }, { status: 500 })
	}
}
