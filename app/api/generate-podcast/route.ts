import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { collectionId } = body

    if (!collectionId) {
      return NextResponse.json({ message: "Collection ID is required." }, { status: 400 })
    }

    console.log(`Received request to generate podcast for collection: ${collectionId}`)

    // Simulate triggering the external AI workflow with the specific collection
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log(`AI workflow for collection ${collectionId} triggered successfully.`)

    return NextResponse.json({
      message: "Podcast generation process started successfully.",
      workflowId: `wf-${collectionId}-${Date.now()}`,
    })
  } catch (error) {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 })
  }
}
