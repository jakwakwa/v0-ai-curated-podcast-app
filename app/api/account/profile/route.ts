import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// export const dynamic = "force-dynamic"

export async function GET() {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		// Get user profile from database
		const user = await prisma.user.findUnique({
			where: { user_id: userId },
			select: {
				name: true,
				email: true,
				image: true,
				created_at: true,
				updated_at: true,
			},
		})

		if (!user) {
			return new NextResponse("User not found", { status: 404 })
		}

		return NextResponse.json({
			name: user.name || "",
			email: user.email,
			avatar: user.image,
			createdAt: user.created_at,
			updatedAt: user.updated_at,
		})
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		console.error("[PROFILE_GET]", message)
		return new NextResponse("Internal Error", { status: 500 })
	}
}

export async function PATCH(request: Request) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const body = await request.json()
		const { name, email } = body

		// Validate input
		if (!name || typeof name !== "string" || name.trim().length === 0) {
			return new NextResponse("Name is required", { status: 400 })
		}

		if (!email || typeof email !== "string" || !email.includes("@")) {
			return new NextResponse("Valid email is required", { status: 400 })
		}

		// Check if email is already taken by another user
		const existingUser = await prisma.user.findFirst({
			where: {
				email: email,
				user_id: { not: userId },
			},
		})

		if (existingUser) {
			return new NextResponse("Email is already taken", { status: 409 })
		}

		// Update user profile
		const updatedUser = await prisma.user.update({
			where: { user_id: userId },
			data: {
				name: name.trim(),
				email: email.toLowerCase().trim(),
				updated_at: new Date(),
			},
			select: {
				name: true,
				email: true,
				image: true,
				created_at: true,
				updated_at: true,
			},
		})

		return NextResponse.json({
			name: updatedUser.name,
			email: updatedUser.email,
			avatar: updatedUser.image,
			createdAt: updatedUser.created_at,
			updatedAt: updatedUser.updated_at,
		})
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		console.error("[PROFILE_UPDATE]", message)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
