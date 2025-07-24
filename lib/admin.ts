import type { User } from "@clerk/nextjs/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function isAdmin(): Promise<boolean> {
	try {
		const { userId } = await auth()

		if (!userId) {
			return false
		}

		// Check database for admin status
		const user = await prisma.user.findUnique({
			where: { user_id: userId },
			select: { is_admin: true },
		})

		if (user?.is_admin) {
			return true
		}

		// Fallback: Check if user ID is in admin list (for backward compatibility)
		const ADMIN_USER_IDS = [
			"user_2znO9fTWcCGHg3N7GmyyCA8730S",
			// Add your Clerk user ID here - you can find this in Clerk Dashboard
			// Example: "user_2abc123def456ghi"
		]

		if (ADMIN_USER_IDS.includes(userId)) {
			return true
		}

		// Fallback: Check if user email is in admin list (for backward compatibility)
		const ADMIN_EMAILS = [
			"jakwakwa@gmail.com",
			// Example: "admin@yourdomain.com"
		]

		// Only fetch user details if we need to check email
		let clerkUser: User | null = null
		try {
			clerkUser = await currentUser()
		} catch (userError: unknown) {
			console.error("Error fetching current user for admin check:", userError)
			return false
		}

		if (!clerkUser) {
			return false
		}

		// Check if user email is in admin list
		const primaryEmail = clerkUser.emailAddresses?.[0]?.emailAddress
		if (primaryEmail && ADMIN_EMAILS.includes(primaryEmail)) {
			return true
		}

		// No development override - only explicitly listed users are admins
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
