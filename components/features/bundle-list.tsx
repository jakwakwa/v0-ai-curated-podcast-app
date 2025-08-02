"use client"

import { Lock } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { Bundle, Podcast } from "@/lib/types"

// Type for bundle with podcasts array from API
type BundleWithPodcasts = Bundle & { podcasts: Podcast[] }

interface BundleListProps {
	onBundleSelect: (bundle: BundleWithPodcasts) => void
}

export function BundleList({ onBundleSelect }: BundleListProps) {
	const [curatedBundles, setCuratedBundles] = useState<BundleWithPodcasts[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchCuratedBundles = useCallback(async () => {
		try {
			setIsLoading(true)
			setError(null)

			const response = await fetch("/api/curated-bundles")
			if (!response.ok) {
				throw new Error(`Failed to load PODSLICE Bundles. Server responded with status ${response.status}.`)
			}

			const data = await response.json()
			setCuratedBundles(data)
		} catch (error) {
			console.error("Error fetching PODSLICE Bundles:", error)
			setError(error instanceof Error ? error.message : "An unexpected error occurred while loading PODSLICE Bundles.")
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchCuratedBundles()
	}, [fetchCuratedBundles])

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[200px]">
				<p>Loading PODSLICE Bundles...</p>
			</div>
		)
	}

	if (error) {
		return (
			<div className="max-w-2xl mx-auto">
				<p>Unable to Load PODSLICE Bundles: {error}</p>
				<div className="mt-6 text-center">
					<Button onClick={fetchCuratedBundles} variant="outline">
						Try Again
					</Button>
				</div>
			</div>
		)
	}

	if (curatedBundles.length === 0) {
		return (
			<div className="max-w-2xl mx-auto">
				<p>No PODSLICE Bundles Available. Please check back later or contact support if this problem persists.</p>
				<div className="mt-6 text-center">
					<Button onClick={fetchCuratedBundles} variant="outline">
						Refresh
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-4 justify-center items-center w-full max-w-md">
			{curatedBundles.map(bundle => (
				<Card key={bundle.bundle_id} className="cursor-pointer hover:shadow-lg transition-shadow w-full" onClick={() => onBundleSelect(bundle)}>
					<CardContent className="p-2">
						<div className="flex flex-col">
							{/* Bundle info on the right */}
							<div className="flex flex-col w-full min-w-0">
								<div className="flex flex-row w-full min-w-0 rounded-lg gap-1">
									{/* Image on the left - fixed square dimensions */}
									<div className="flex-shrink-0 p-4">
										{bundle.image_url ? (
											<Image src={bundle.image_url} alt={bundle.name} width={80} height={80} className="w-20 h-20 object-cover rounded-lg" />
										) : (
											<div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
												<span className="text-muted-foreground text-xs">No Image</span>
											</div>
										)}
									</div>

									<div className="flex flex-col w-full min-w-0 py-4 items-start">
										{/* Bundle title - truncated */}
										<CardTitle className="text-lg font-semibold mb-2 truncate">{bundle.name}</CardTitle>
										{/* Bundle description - truncated with tooltip */}
										<div className="mb-3">
											<Tooltip>
												<TooltipTrigger asChild>
													<p className="text-sm text-muted-foreground line-clamp-2 leading-tight">
														{bundle.description}
														{bundle.description && bundle.description.length > 100 && <span className="font-bold text-primary ml-1">read more</span>}
													</p>
												</TooltipTrigger>
												<TooltipContent side="top" className="max-w-xs">
													<p>{bundle.description}</p>
												</TooltipContent>
											</Tooltip>
										</div>
									</div>
								</div>
							</div>
							<div className="flex flex-col rounded-lg w-full min-w-0 bg-background/50 border">
								{/* Podcasts list - truncated */}
								<div className="mb-0 p-4">
									<h5 className="font-medium mb-1 text-sm">Included Podcasts:</h5>
									<ul className="space-y-1 pt-2">
										{bundle.podcasts?.slice(0, 2).map(podcast => (
											<li key={podcast.podcast_id} className="text-sm text-muted-foreground truncate">
												{podcast.name}
											</li>
										))}
										{bundle.podcasts && bundle.podcasts.length > 2 && <li className="text-sm text-muted-foreground">+{bundle.podcasts.length - 2} more</li>}
									</ul>
								</div>

								{/* Fixed selection indicator */}
								<div className="flex items-center gap-2 text-sm text-muted-foreground p-4">
									<Lock size={12} />
									<span className="truncate">Fixed Selection</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
}
