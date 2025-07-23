import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

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

		// Check if user already exists in local database
		const existingUser = await prisma.user.findUnique({
			where: { id: userId },
		})

		if (existingUser) {
			// User exists - update their info in case it changed
			const updatedUser = await prisma.user.update({
				where: { id: userId },
				data: {
					name: clerkUser.fullName || clerkUser.firstName || "Unknown",
					email: clerkUser.emailAddresses[0]?.emailAddress || "unknown@example.com",
					image: clerkUser.imageUrl || null,
					emailVerified: clerkUser.emailAddresses[0]?.verification?.status === "verified" ? new Date() : null,
				},
			})

			return NextResponse.json({
				message: "User updated successfully",
				user: updatedUser,
				isNew: false,
			})
		}

		// User doesn't exist - create new user record
		const newUser = await prisma.user.create({
			data: {
				id: userId,
				name: clerkUser.fullName || clerkUser.firstName || "Unknown",
				email: clerkUser.emailAddresses[0]?.emailAddress || "unknown@example.com",
				password: "clerk_managed", // Placeholder since Clerk manages auth
				image: clerkUser.imageUrl || null,
				emailVerified: clerkUser.emailAddresses[0]?.verification?.status === "verified" ? new Date() : null,
			},
		})

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
