import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

interface RouteParams {
	params: Promise<{ id: string }>
}

export async function DELETE(
	// biome-ignore lint/correctness/noUnusedFunctionParameters: <expected unused>
	// biome-ignore lint/correctness/noUnusedVariables: <expected>
	request: NextRequest,
	{ params }: RouteParams
) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const { id } = await params

		if (!id) {
			return new NextResponse("Notification ID is required", { status: 400 })
		}

		const deletedNotification = await prisma.notification.delete({
			where: { id, userId },
		})

		if (!deletedNotification) {
			return new NextResponse("Notification not found or unauthorized", { status: 404 })
		}

		return NextResponse.json({ message: "Notification deleted successfully" })
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: <error debugging>
		console.error("[NOTIFICATION_DELETE]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
