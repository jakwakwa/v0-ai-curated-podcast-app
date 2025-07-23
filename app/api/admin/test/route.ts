import { NextResponse } from "next/server"

export async function GET() {
	return NextResponse.json({ message: "Test route - can be removed" })
}
