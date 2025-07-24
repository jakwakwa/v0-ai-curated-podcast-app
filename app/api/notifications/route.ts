import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prismaEdge } from "@/lib/prisma-edge"

export const runtime = "edge" // Use edge runtime for better performance

export async function GET(_request: Request) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const notifications = await prismaEdge.notification.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
		})

		return NextResponse.json(notifications)
	} catch (error) {
		console.error("[NOTIFICATIONS_GET]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}

export async function DELETE(_request: Request) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		await prismaEdge.notification.deleteMany({
			where: {
				userId,
				isRead: true,
			},
		})

		return NextResponse.json({ message: "Read notifications cleared" })
	} catch (error) {
		console.error("[NOTIFICATIONS_DELETE]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
