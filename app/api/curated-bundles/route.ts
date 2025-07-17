import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const curatedBundles = await prisma.curatedBundle.findMany({
      where: { isActive: true },
      include: {
        bundlePodcasts: {
          include: { podcast: true },
        },
      },
      orderBy: { name: "asc" },
    });

    // Flatten the structure to include podcasts directly in the bundle object
    const bundlesWithPodcasts = curatedBundles.map((bundle) => ({
      ...bundle,
      podcasts: bundle.bundlePodcasts.map((bp) => bp.podcast),
    }));

    return NextResponse.json(bundlesWithPodcasts);
  } catch (error) {
    console.error("[CURATED_BUNDLES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
