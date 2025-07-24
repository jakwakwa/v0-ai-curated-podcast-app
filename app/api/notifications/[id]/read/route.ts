import { auth } from "@clerk/nextjs/server"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

interface RouteParams {
	params: Promise<{ id: string }>
}

export async function PATCH(_request: NextRequest, { params }: RouteParams) {
	const { id } = await params
	const authResult = await auth()
	const userId = authResult?.userId

	if (!userId) {
		return new NextResponse("Unauthorized", { status: 401 })
	}

	if (!id) {
		return new NextResponse("Notification ID is required", { status: 400 })
	}

	const updatedNotification = await prisma.notification.update({
		where: { notification_id: id, user_id: userId },
		data: { is_read: true },
	})

	if (!updatedNotification) {
		return new NextResponse("Notification not found or unauthorized", { status: 404 })
	}

	return NextResponse.json(updatedNotification)
}
