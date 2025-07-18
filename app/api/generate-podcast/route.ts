import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { inngest } from "../../../inngest/client"

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const { collectionId } = body

		if (!collectionId) {
			return NextResponse.json({ message: "Collection ID is required." }, { status: 400 })
		}

		await inngest.send({
			name: "podcast/generate.requested",
			data: {
				collectionId,
			},
		})

		revalidatePath("/")

		return NextResponse.json({
			message: "Podcast generation process started successfully.",
			collectionId,
		})
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: <expect>
		console.error("Error in POST /api/generate-podcast:", error)
		return NextResponse.json(
			{
				message: "Failed to start podcast generation.",
				error: (error as Error).message,
			},
			{ status: 500 }
		)
	}
}
