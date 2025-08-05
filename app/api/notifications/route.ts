import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Cache notifications for 15 minutes - notifications are typically viewed frequently but don't change often
export const revalidate = 900 // 15 minutes in seconds

export async function GET(_request: Request) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const notifications = await prisma.notification.findMany({
			where: { user_id: userId },
			orderBy: { created_at: "desc" },
			cacheStrategy: {
				ttl: 900, // 15 minutes
				swr: 300, // 5 minutes stale while revalidate
				tags: [`user_notifications_${userId}`],
			},
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

		await prisma.notification.deleteMany({
			where: { user_id: userId },
		})

		return NextResponse.json({ message: "Read notifications cleared" })
	} catch (error) {
		console.error("[NOTIFICATIONS_DELETE]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
