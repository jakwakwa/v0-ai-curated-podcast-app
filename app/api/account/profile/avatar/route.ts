import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const formData = await request.formData()
		const file = formData.get("avatar") as File

		if (!file) {
			return new NextResponse("No file provided", { status: 400 })
		}

		// Validate file type
		if (!file.type.startsWith("image/")) {
			return new NextResponse("File must be an image", { status: 400 })
		}

		// Validate file size (max 5MB)
		const maxSize = 5 * 1024 * 1024 // 5MB
		if (file.size > maxSize) {
			return new NextResponse("File size must be less than 5MB", { status: 400 })
		}

		// For now, we'll simulate avatar upload
		// In production, you would upload to a service like Cloudinary, AWS S3, etc.
		const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}&size=200`

		// Update user avatar in database
		await prisma.user.update({
			where: { user_id: userId },
			data: {
				image: avatarUrl,
				updated_at: new Date(),
			},
		})

		return NextResponse.json({
			avatarUrl,
			message: "Avatar updated successfully",
		})
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		console.error("[AVATAR_UPLOAD]", message)
		return new NextResponse("Internal Error", { status: 500 })
	}
}

export async function DELETE() {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		// Remove avatar from database
		await prisma.user.update({
			where: { user_id: userId },
			data: {
				image: null,
				updated_at: new Date(),
			},
		})

		return NextResponse.json({
			message: "Avatar removed successfully",
		})
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		console.error("[AVATAR_DELETE]", message)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
