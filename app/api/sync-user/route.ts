import { NextResponse } from "next/server"

export async function GET() {
	return NextResponse.json({ message: "User sync completed - this route can be removed" })
}
