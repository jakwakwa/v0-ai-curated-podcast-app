import type { User } from "@clerk/nextjs/server"
import { auth, currentUser } from "@clerk/nextjs/server"

// Admin user IDs - you should replace these with your actual admin user IDs from Clerk
const ADMIN_USER_IDS = [
	"user_2znO9fTWcCGHg3N7GmyyCA8730S",
	// Add your Clerk user ID here - you can find this in Clerk Dashboard
	// Example: "user_2abc123def456ghi"
]

// Admin email addresses - alternative way to check admin status
const ADMIN_EMAILS = [
	"jakwakwa@gmail.com",
	// Example: "admin@yourdomain.com"
]

export async function isAdmin(): Promise<boolean> {
	try {
		const { userId } = await auth()

		if (!userId) {
			return false
		}

		// Check if user ID is in admin list first (fastest check)
		if (ADMIN_USER_IDS.includes(userId)) {
			return true
		}

		// Only fetch user details if we need to check email
		let user: User | null = null
		try {
			user = await currentUser()
		} catch (userError: unknown) {
			console.error("Error fetching current user for admin check:", userError)
			// If we can't fetch user details but have userId, still check development mode
			if (process.env.NODE_ENV === "development") {
				return true
			}
			return false
		}

		if (!user) {
			// User ID exists but couldn't fetch user details
			if (process.env.NODE_ENV === "development") {
				return true
			}
			return false
		}

		// Check if user email is in admin list
		const primaryEmail = user.emailAddresses?.[0]?.emailAddress
		if (primaryEmail && ADMIN_EMAILS.includes(primaryEmail)) {
			return true
		}

		// For development/testing purposes - you can remove this later
		if (process.env.NODE_ENV === "development") {
			// Temporarily allow all authenticated users as admin in development
			// Remove this in production!
			return true
		}

		return false
	} catch (error) {
		console.error("Error checking admin status:", error)
		// Return false instead of throwing error for authentication issues
		return false
	}
}

export async function requireAdmin() {
	const adminStatus = await isAdmin()
	if (!adminStatus) {
		throw new Error("Admin access required")
	}
}
