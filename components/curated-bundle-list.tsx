"use client"

import { Lock } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import type { Bundle, Podcast } from "@/lib/types"

// Type for bundle with podcasts array from API
type BundleWithPodcasts = Bundle & { podcasts: Podcast[] }

interface CuratedBundleListProps {
	onBundleSelect: (bundle: BundleWithPodcasts) => void
}

export function CuratedBundleList({ onBundleSelect }: CuratedBundleListProps) {
	const [curatedBundles, setCuratedBundles] = useState<BundleWithPodcasts[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchCuratedBundles = async () => {
		try {
			setIsLoading(true)
			setError(null)

			const response = await fetch("/api/curated-bundles")
			if (!response.ok) {
				throw new Error(`Failed to load PodSlice Bundles. Server responded with status ${response.status}.`)
			}

			const data = await response.json()
			setCuratedBundles(data)
		} catch (error) {
			console.error("Error fetching PodSlice Bundles:", error)
			setError(error instanceof Error ? error.message : "An unexpected error occurred while loading PodSlice Bundles.")
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchCuratedBundles()
	}, [])

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[200px]">
				{/* AppSpinner component was removed, so this will be a placeholder or removed if not needed */}
				<p>Loading PodSlice Bundles...</p>
			</div>
		)
	}

	if (error) {
		return (
			<div className="max-w-2xl mx-auto">
				{/* Alert component was removed, so this will be a placeholder or removed if not needed */}
				<p>Unable to Load PodSlice Bundles: {error}</p>
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
				{/* Alert component was removed, so this will be a placeholder or removed if not needed */}
				<p>No PodSlice Bundles Available. Please check back later or contact support if this problem persists.</p>
				<div className="mt-6 text-center">
					<Button onClick={fetchCuratedBundles} variant="outline">
						Refresh
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{curatedBundles.map(bundle => (
				<Card key={bundle.bundle_id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onBundleSelect(bundle)}>
					{bundle.image_url && <Image src={bundle.image_url} alt={bundle.name} className="w-full h-48 object-cover rounded-t-lg" width={200} height={200} />}
					<CardContent className="p-4">
						<CardTitle className="text-lg font-semibold mb-2">{bundle.name}</CardTitle>
						<div className="mb-4">
							<h5 className="font-medium mb-2">Included Podcasts:</h5>
							<ul className="space-y-1">
								{bundle.podcasts?.slice(0, 3).map(podcast => (
									<li key={podcast.podcast_id} className="text-sm text-muted-foreground">
										{podcast.name}
									</li>
								))}
								{bundle.podcasts && bundle.podcasts.length > 3 && <li className="text-sm text-muted-foreground">+{bundle.podcasts.length - 3} more</li>}
							</ul>
						</div>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Lock size={12} />
							Fixed Selection
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
}
