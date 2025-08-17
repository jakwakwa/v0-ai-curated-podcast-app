import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// export const dynamic = "force-dynamic"
export const maxDuration = 60 // 1 minute for user sync operations

export async function POST() {
	try {
		// Get user from Clerk auth
		const { userId } = await auth()

		if (!userId) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
		}

		// Get full user details from Clerk
		const clerkUser = await currentUser()
		if (!clerkUser) {
			return NextResponse.json({ error: "User not found in Clerk" }, { status: 404 })
		}

		// Check if a user record exists by id or by email (tolerate legacy rows)
		const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress || undefined
		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [{ user_id: userId }, ...(primaryEmail ? [{ email: primaryEmail }] : [])],
			},
		})

		if (existingUser) {
			// User exists - update their info in case it changed
			const updatedUser = await prisma.user.update({
				where: { user_id: existingUser.user_id },
				data: {
					name: clerkUser.fullName || clerkUser.firstName || "Unknown",
					email: clerkUser.emailAddresses[0]?.emailAddress || existingUser.email,
					image: clerkUser.imageUrl || null,
					email_verified: clerkUser.emailAddresses[0]?.verification?.status === "verified" ? new Date() : null,
					updated_at: new Date(),
				},
			})

			return NextResponse.json({
				message: "User updated successfully",
				user: updatedUser,
				isNew: false,
			})
		}

		// User doesn't exist - create new user record (tolerate unique email race)
		let newUser: Awaited<ReturnType<typeof prisma.user.create>> | undefined
		try {
			newUser = await prisma.user.create({
				data: {
					user_id: userId,
					name: clerkUser.fullName || clerkUser.firstName || "Unknown",
					email: clerkUser.emailAddresses[0]?.emailAddress || "unknown@example.com",
					password: "clerk_managed", // Placeholder since Clerk manages auth
					image: clerkUser.imageUrl || null,
					email_verified: clerkUser.emailAddresses[0]?.verification?.status === "verified" ? new Date() : null,
					updated_at: new Date(),
				},
			})
		} catch {
			return NextResponse.json({ message: "User already exists", isNew: false })
		}

		return NextResponse.json({
			message: "User created successfully",
			user: newUser,
			isNew: true,
		})
	} catch (error) {
		console.error("Error syncing user:", error)
		return NextResponse.json({ error: "Failed to sync user" }, { status: 500 })
	}
}
