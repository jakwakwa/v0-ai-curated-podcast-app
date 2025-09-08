import { PlanGate, type Prisma } from "@prisma/client"
import { AlertCircle, Lock } from "lucide-react"
import { unstable_noStore as noStore } from "next/cache"
import Image from "next/image"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { H3, Typography } from "@/components/ui/typography"
import { prisma } from "@/lib/prisma"
import type { Bundle, Podcast } from "@/lib/types"
import { CuratedBundlesFilters } from "./_components/filters.client"

type BundleWithPodcasts = Bundle & { podcasts: Podcast[] }

export const dynamic = "force-dynamic"

export default async function CuratedBundlesPage({ searchParams }: { searchParams?: { q?: string; min_plan?: string } }) {
	noStore()

	let curatedBundles: BundleWithPodcasts[] = []
	let error: string | null = null

	try {
		const q = searchParams?.q?.toString().trim()
		const minPlanParam = searchParams?.min_plan?.toString().trim()
		const minPlanFilter = minPlanParam && (Object.values(PlanGate) as string[]).includes(minPlanParam) ? (minPlanParam as keyof typeof PlanGate) : undefined

		const where: Prisma.BundleWhereInput = {
			is_active: true,
			...(q
				? {
					OR: [{ name: { contains: q, mode: "insensitive" } }, { bundle_podcast: { some: { podcast: { name: { contains: q, mode: "insensitive" } } } } }],
				}
				: {}),
			...(minPlanFilter ? { min_plan: PlanGate[minPlanFilter] } : {}),
		}

		const bundles = await prisma.bundle.findMany({
			where,
			include: {
				bundle_podcast: { include: { podcast: true } },
			},
			orderBy: { created_at: "desc" },
		})

		curatedBundles = bundles.map(b => ({
			...(b as unknown as Bundle),
			podcasts: b.bundle_podcast.map(bp => bp.podcast as unknown as Podcast),
		}))
	} catch (e) {
		error = e instanceof Error ? e.message : "Failed to load PODSLICE Bundles."
	}

	return (
		<div className=" w-full	 episode-card-wrapper  overflow-x-hidden">
			<PageHeader
				title="Explore our Bundles"
				description="Choose from our pre-curated podcast bundles. Each bundle is a fixed selection of 5 carefully selected shows and cannot be modified once selected. You can also Notificationscreate your own bundles with your own selection of shows."
			/>

			{/* Filters */}

			<CuratedBundlesFilters />

			{!!error && (
				<div className="max-w-2xl mx-auto mt-8">
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Unable to Load PODSLICE Bundles</AlertTitle>
						<AlertDescription className="mt-2">{error}</AlertDescription>
					</Alert>
					<div className="mt-6 text-center">
						<Button asChild variant="outline">
							<Link href="/curated-bundles">Try Again</Link>
						</Button>
					</div>
				</div>
			)}
			{curatedBundles.length === 0 ? (
				<div className="max-w-2xl mx-auto mt-8">
					<Alert>
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>No PODSLICE Bundles Available</AlertTitle>
						<AlertDescription className="mt-2">There are no PODSLICE Bundles available at the moment. Please check back later or contact support if this problem persists.</AlertDescription>
					</Alert>
					{/* <div className="mt-6 text-center">
						<Button asChild variant="default">
							<Link href="/curated-bundles">Refresh</Link>
						</Button>
					</div> */}
				</div>
			) : (
				<div className="relative transition-all duration-200 text-card-foreground episode-card-wrapper-dark p-0 w-full overflow-y-scroll z-1 grid grid-cols-1 md:grid-cols-2 gap-5 h-full max-h-[250px]  ">
					{curatedBundles.map(bundle => (
						<Card variant="default" key={bundle.bundle_id} className="h-auto flex flex-col px-4 episode-card shadow-lg h-[250px] w-full">
							<CardHeader className=" w-full py-4">
								<div className="w-full flex flex-row gap-3">
									<div className="flex items-start gap-3 text-sm font-normal tracking-wide flex-col w-full max-w-[240px]">
										<H3 className="text-[1rem] text-secondary-foreground font-black font-sans mt-2 mb-3 leading-9 text-shadow-sm tracking-tight uppercase leading-tight mb-0 truncate">
											{bundle.name}
										</H3>

										<Badge variant="outline" size="sm" className="font-normal tracking-wide">
											<Lock size={8} className="mr-2" />
											<Typography className="text-xxs">Fixed Podcast Shows</Typography>
										</Badge>

										<CardContent className="bg-cardglass mx-auto shadow-sm rounded-md w-full p-3 m-0 pb-8 mt-2">
											<ul className="list-none p-0 m-0 flex flex-col gap-1.5">
												{bundle.podcasts.slice(1).map((podcast: Podcast) => (
													<li key={podcast.podcast_id} className="flex w-full justify-end gap-0">
														<div className="w-full flex flex-col gap-0">
															<Typography as="p" className="text-md font-bold uppercase leading-normal tracking-tight my-0 px-1 mx-0 opacity-80">
																{podcast.name}
															</Typography>
														</div>
													</li>
												))}
											</ul>
										</CardContent>
									</div>

									<div className="flex items-center gap-2 text-sm font-normal tracking-wide w-full">
										<div className="relative my-2 rounded-lg outline-4 overflow-hidden w-full min-w-[100px] h-28">
											{bundle.image_url && <Image className="w-full" src={bundle.image_url} alt={bundle.name} width={160} height={190} objectFit="cover" />}
										</div>
									</div>
								</div>
							</CardHeader>
						</Card>
					))}
				</div>
			)}
		</div>
	)
}
