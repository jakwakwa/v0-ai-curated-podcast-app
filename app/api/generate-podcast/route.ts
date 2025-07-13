import { NextResponse } from "next/server"
import { inngest } from "../../../inngest/client";

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { collectionId } = body

    if (!collectionId) {
      return NextResponse.json({ message: "Collection ID is required." }, { status: 400 })
    }

    console.log(`Received request to generate podcast for collection: ${collectionId}`)

    // Send an event to Inngest to trigger the podcast generation workflow
    await inngest.send({
      name: "podcast/generate.requested",
      data: {
        collectionId,
      },
    });

    return NextResponse.json({
      message: "Podcast generation process started successfully.",
      collectionId,
    })
  } catch (error) {
    console.error("Error in POST /api/generate-podcast:", error);
    return NextResponse.json({ message: "Failed to start podcast generation.", error: (error as Error).message }, { status: 500 })
  }
}
