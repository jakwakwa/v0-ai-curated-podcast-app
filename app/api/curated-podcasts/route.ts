import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const curatedPodcasts = await prisma.curatedPodcast.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(curatedPodcasts);
  } catch (error) {
    console.error("[CURATED_PODCASTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 