import { NextResponse } from "next/server"
import { isAdmin } from "./admin"

export async function requireAdminMiddleware() {
	try {
		const adminStatus = await isAdmin()

		if (!adminStatus) {
			console.log("Admin access denied - user is not admin")
			return NextResponse.json({ error: "Admin access required" }, { status: 403 })
		}

		console.log("Admin access granted")
		return null // Continue to the route handler
	} catch (error) {
		console.error("Error in admin middleware:", error)
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}
