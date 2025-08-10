import { NextResponse } from "next/server"
import { requireAdminMiddleware } from "@/lib/admin-middleware"

export async function GET() {
	const adminCheck = await requireAdminMiddleware()
	if (adminCheck) return adminCheck
	return NextResponse.json({ message: "Test route - can be removed" })
}
