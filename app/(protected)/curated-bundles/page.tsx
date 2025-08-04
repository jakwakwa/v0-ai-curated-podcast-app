"use client"

import { AlertCircle, Lock, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AppSpinner } from "@/components/ui/app-spinner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { Body } from "@/components/ui/typography"
import type { Bundle, Podcast } from "@/lib/types"

type BundleWithPodcasts = Bundle & { podcasts: Podcast[] }

export default function CuratedBundlesPage() {
	const [curatedBundles, setCuratedBundles] = useState<BundleWithPodcasts[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [_playingEpisodeId, _setPlayingEpisodeId] = useState<string | null>(null)
	const [_portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

	// Find the portal container on mount
	useEffect(() => {
		const container = document.getElementById("global-audio-player")
		setPortalContainer(container)
	}, [])

	const fetchCuratedBundles = useCallback(async () => {
		try {
			setIsLoading(true)
			setError(null)

			// Fetch both bundles and episodes in parallel
			const [bundlesResponse, _episodesResponse] = await Promise.all([fetch("/api/curated-bundles"), fetch("/api/episodes")])

			if (!bundlesResponse.ok) {
				throw new Error(`Failed to load PODSLICE Bundles. Server responded with status ${bundlesResponse.status}.`)
			}

			const bundlesData = await bundlesResponse.json()

			setCuratedBundles(bundlesData)
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
			<div className="p-8 max-w-[1200px] mx-auto">
				<div className="flex items-center justify-center min-h-[400px]">
					<AppSpinner size="lg" label="Loading Bundles..." />
				</div>
			</div>
		)
	}
	return (
		<div className="wrapper">
			<PageHeader
				title="Explore our Bundles"
				description="Choose from our pre-curated podcast bundles. Each bundle is a fixed selection of 5 carefully selected shows and cannot be modified once selected. You can also create your own bundles with your own selection of shows."
			/>

			{error && (
				<div className="max-w-2xl mx-auto mt-8">
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Unable to Load PODSLICE Bundles</AlertTitle>
						<AlertDescription className="mt-2">{error}</AlertDescription>
					</Alert>
					<div className="mt-6 text-center">
						<Button onClick={fetchCuratedBundles} variant="outline">
							<RefreshCw className="h-4 w-4 mr-2" />
							Try Again
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
					<div className="mt-6 text-center">
						<Button onClick={fetchCuratedBundles} variant="outline">
							<RefreshCw className="h-4 w-4 mr-2" />
							Refresh
						</Button>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
					{curatedBundles.map(bundle => (
						<Card key={bundle.bundle_id} className="h-auto flex flex-col max-h-[400px]">
							<CardHeader className="px-6 pb-2 pt-4 border-b border-border">
								<div className="w-full flex flex-col gap-3">
									<div className="flex flex-col gap-3">
										<CardTitle className="text-2xl font-semibold leading-8 tracking-tight mb-0">{bundle.name}</CardTitle>
										<CardDescription className="text-base leading-6 font-normal tracking-wide text-foreground/80 mb-0">{bundle.description}</CardDescription>
									</div>
									<div className="relative border-2 border-white block rounded-lg overflow-hidden w-full h-32">
										{bundle.image_url && <Image src={bundle.image_url} alt={bundle.name} className="object-cover w-full h-full" fill />}
									</div>

									<div className="flex items-center justify-between gap-3 text-2xl font-semibold p-4">
										<Badge variant="outline" size="sm" className="text-sm leading-tight font-normal tracking-wide">
											{bundle.podcasts.length} Podcasts
										</Badge>
										<div className="flex items-center gap-2 text-sm leading-tight font-normal tracking-wide">
											<Lock size={12} />
											<span>Fixed Selection</span>
										</div>
									</div>
								</div>
							</CardHeader>

							<CardContent className="py-1 px-6 overflow-y-auto">
								<Body className="text-2xl font-semibold leading-8 tracking-tight mb-4">Included Podcasts:</Body>
								<ul className="list-none p-0 m-0 flex flex-col gap-4">
									{bundle.podcasts.map(podcast => (
										<li key={podcast.podcast_id} className="flex items-center w-full justify-end gap-4 py-2 px-4 w-full border border-border rounded-lg bg-gray-900/80">
											<div className="w-full flex flex-col gap-1">
												<span className="text-lg font-semibold leading-7 tracking-tight opacity-80">{podcast.name}</span>
												<p className="text-muted-foreground text-sm leading-relaxed opacity-70">{podcast.description}</p>
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
