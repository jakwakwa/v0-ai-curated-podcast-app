import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { isOrgAdmin } from "@/lib/organization-roles"

// Force this API route to be dynamic since it uses auth()
export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const { userId } = await auth()

		if (!userId) {
			return NextResponse.json({ isAdmin: false }, { status: 401 })
		}

		const adminStatus = await isOrgAdmin()

		return NextResponse.json({ isAdmin: adminStatus })
	} catch (error) {
		console.error("Error checking admin status:", error)

		if (error instanceof Error) {
			if (error.message.includes("401") || error.message.includes("Unauthorized")) {
				return NextResponse.json({ isAdmin: false }, { status: 401 })
			}

			if (error.message.includes("User not found") || error.message.includes("not found")) {
				return NextResponse.json({ isAdmin: false })
			}
		}

		return NextResponse.json({ isAdmin: false })
	}
}
