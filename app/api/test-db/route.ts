import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
	try {
		console.log("Testing database connection...");

		// Test basic database connection
		const episodeCount = await prisma.episode.count();
		console.log("Database connection successful, episode count:", episodeCount);

		// Get a few episodes without any user filtering
		const episodes = await prisma.episode.findMany({
			take: 5,
			include: {
				podcast: true,
			},
			orderBy: { created_at: "desc" },
		});

		return NextResponse.json({
			success: true,
			episodeCount,
			sampleEpisodes: episodes,
			message: "Database connection working",
		});
	} catch (error) {
		console.error("Database test error:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
				stack: error instanceof Error ? error.stack : undefined,
			},
			{ status: 500 }
		);
	}
}
