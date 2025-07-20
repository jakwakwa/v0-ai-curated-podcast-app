import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(
	// biome-ignore lint/correctness/noUnusedFunctionParameters: <expected unused>
	// biome-ignore lint/correctness/noUnusedVariables: <expected>
	request: Request
) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const curatedBundles = await prisma.curatedBundle.findMany({
			where: { isActive: true },
			include: {
				bundlePodcasts: {
					include: { podcast: true },
				},
			},
			orderBy: { name: "asc" },
		})

		// Flatten the structure to include podcasts directly in the bundle object
		const bundlesWithPodcasts = curatedBundles.map(bundle => ({
			...bundle,
			podcasts: bundle.bundlePodcasts.map(bp => bp.podcast),
		}))

		return NextResponse.json(bundlesWithPodcasts)
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: <error debugging>
		console.error("[CURATED_BUNDLES_GET]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
