import { AlertCircle, Lock } from "lucide-react"
import { unstable_noStore as noStore } from "next/cache"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { Body, Typography } from "@/components/ui/typography"
import { prisma } from "@/lib/prisma"
import type { Bundle, Podcast } from "@/lib/types"

type BundleWithPodcasts = Bundle & { podcasts: Podcast[] }

export const dynamic = "force-dynamic"

export default async function CuratedBundlesPage() {
	noStore()

	let curatedBundles: BundleWithPodcasts[] = []
	let error: string | null = null

	try {
		const bundles = await prisma.bundle.findMany({
			where: { is_active: true },
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
		<div className="wrapper mt-4">
			<PageHeader
				title="Explore our Bundles"
				description="Choose from our pre-curated podcast bundles. Each bundle is a fixed selection of 5 carefully selected shows and cannot be modified once selected. You can also create your own bundles with your own selection of shows."
			/>

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
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-1 mb-0">
					{curatedBundles.map(bundle => (
						<Card key={bundle.bundle_id} className="h-auto flex flex-col max-h-[500px] bg-card" variant="bundle">
							<CardHeader className="px-6 pb-2 pt-4 border-b border-border">
								<div className="w-full flex flex-col gap-3">
									<div className="flex flex-col gap-3">
										<CardTitle className="text-[1.2rem] text-secondary-foreground font-bold my-2 leading-8 tracking-tight leading-tight mb-0 truncate">{bundle.name}</CardTitle>
										<p className="text-[0.7rem] pb-4  leading-6 font-normal tracking-tight leading-[1] line-clamp-2 max-h-[3rem] truncate text-foreground/80 mb-0">{bundle.description}</p>
									</div>
									{/* <div className="relative border-2 border-lines-light bg-black block rounded-lg overflow-hidden w-full h-24">
										{bundle.image_url && <Image src={bundle.image_url} alt={bundle.name} className="object-cover w-full h-full" fill />}
									</div> */}

									<div className="flex items-center justify-between gap-3 text-2xl font-semibold p-0 pb-2">
										<Badge variant="outline" size="sm" className="text-sm leading-tight font-normal tracking-wide">
											{bundle.podcasts.length} Podcasts
										</Badge>
										<div className="flex items-center gap-2 text-sm leading-tight font-normal tracking-wide">
											<Lock size={12} />
											<span className="text-sm">Fixed Selection</span>
										</div>
									</div>
								</div>
							</CardHeader>

							<CardContent className="py-1 px-4 mx-auto overflow-y-auto">
								<Body className="text-2xl font-inter text-accent-foreground italic font-semibold leading-8 h-auto tracking-tight mb-4">Included:</Body>
								<ul className="list-none p-0 m-0 flex flex-col rounded-xl bg-[#000]/50 max-h-[20rem] overflow-y-auto">
									{bundle.podcasts.map((podcast: Podcast) => (
										<li key={podcast.podcast_id} className="flex items-center w-full justify-end gap-4 py-2 px-2 md:px-4 w-full border-1 border-dark/10  rounded-lg">
											<div className="w-full flex flex-col gap-1">
												<Typography as="h5" className="text-body font-semibold leading-7 tracking-tight my-1 opacity-80">
													{podcast.name}
												</Typography>
												<Typography as="p" className="text-muted-foreground text-sm leading-relaxed opacity-90 line-clamp-4 max-h-[5rem] leading-[1.2]">
													{podcast.description}
												</Typography>
											</div>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	)
}
