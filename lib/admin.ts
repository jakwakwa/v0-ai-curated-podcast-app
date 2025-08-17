import { auth } from "@clerk/nextjs/server"

export async function isAdmin(): Promise<boolean> {
	try {
		const { userId } = await auth()
		if (!userId) return false
		const ADMIN_USER_ID = (process.env.ADMIN_USER_ID || "").trim()
		return ADMIN_USER_ID.length > 0 && userId === ADMIN_USER_ID
	} catch (error) {
		console.error("Error checking admin status:", error)
		return false
	}
}

export async function requireAdmin() {
	const adminStatus = await isAdmin()
	if (!adminStatus) {
		throw new Error("Admin access required")
	}
}
