import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const episodes = await prisma.episode.findMany({
      where: {
        userCurationProfile: { userId }
      },
      include: {
        source: true,
        userCurationProfile: {
          include: {
            sources: true,
            selectedBundle: {
              include: {
                bundlePodcasts: {
                  include: { podcast: true }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(episodes);
  } catch (error) {
    console.error("[EPISODES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
