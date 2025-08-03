"use client"

import { AlertCircle, Lock, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { EpisodeList } from "@/components/episode-list"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AppSpinner } from "@/components/ui/app-spinner"
import AudioPlayer from "@/components/ui/audio-player"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import type { Bundle, Episode, Podcast } from "@/lib/types"

// CSS module migrated to Tailwind classes

// Type for bundle with podcasts array from API
type BundleWithPodcasts = Bundle & { podcasts: Podcast[] }

// AKA PODSLICE BUNDLES
export default function CuratedBundlesPage() {
	const [curatedBundles, setCuratedBundles] = useState<BundleWithPodcasts[]>([])
	const [episodes, setEpisodes] = useState<Episode[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [playingEpisodeId, setPlayingEpisodeId] = useState<string | null>(null)
	const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

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
			const [bundlesResponse, episodesResponse] = await Promise.all([fetch("/api/curated-bundles"), fetch("/api/episodes")])

			if (!bundlesResponse.ok) {
				throw new Error(`Failed to load PODSLICE Bundles. Server responded with status ${bundlesResponse.status}.`)
			}

			const bundlesData = await bundlesResponse.json()
			const episodesData = episodesResponse.ok ? await episodesResponse.json() : []

			setCuratedBundles(bundlesData)

			// Filter episodes that belong to bundles
			const bundleEpisodes = episodesData.filter((episode: Episode) => episode.bundle_id)
			setEpisodes(bundleEpisodes)
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

	const handlePlayEpisode = (episodeId: string) => {
		setPlayingEpisodeId(episodeId)
	}

	const handleClosePlayer = () => {
		setPlayingEpisodeId(null)
	}

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
			<PageHeader title="PODSLICE Bundles" description="Choose from our pre-curated podcast bundles. Each bundle contains 5 carefully selected shows and cannot be modified once selected." />

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
				<>
					<div className="flex gap-8 mt-8">
						{curatedBundles.map(bundle => (
							<Card key={bundle.bundle_id} className="transition-all duration-200 ease-in-out h-full flex flex-col hover:-translate-y-1 hover:shadow-lg">
								<CardHeader className="p-6 border-b border-border">
									<div className="w-full flex flex-col gap-3">
										<div className="flex flex-col gap-3">
											<CardTitle className="text-2xl font-semibold leading-8 tracking-tight mb-0">{bundle.name}</CardTitle>
											<CardDescription className="text-base leading-6 font-normal tracking-wide text-muted-foreground mb-0">{bundle.description}</CardDescription>
										</div>
										<div className="relative border-2 border-white block rounded-lg overflow-hidden w-full h-48">
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

								<CardContent className="p-6">
									<h4 className="text-2xl font-semibold leading-8 tracking-tight mb-4">Included Podcasts:</h4>
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

					{/* Show episodes from bundles using the migrated EpisodeList component */}
					{episodes.length > 0 && (
						<div className="flex flex-col gap-8 mt-12 w-full">
							<h2 className="text-2xl font-semibold tracking-tight mb-6">Episodes from PODSLICE Bundles</h2>
							<EpisodeList episodes={episodes} onPlayEpisode={handlePlayEpisode} playingEpisodeId={playingEpisodeId} />

							{/* Spacer for fixed audio player */}
							{playingEpisodeId && <div className="h-24" />}
						</div>
					)}
				</>
			)}

			{/* Portal audio player to global container */}
			{playingEpisodeId &&
				portalContainer &&
				createPortal(
					<div className="bg-background border-t border-border shadow-lg w-full h-20 px-1.5 md:px-12 flex items-center justify-center">
						<AudioPlayerWrapper playingEpisodeId={playingEpisodeId} episodes={episodes} onClose={handleClosePlayer} />
					</div>,
					portalContainer
				)}
		</div>
	)
}

function AudioPlayerWrapper({ playingEpisodeId, episodes, onClose }: { playingEpisodeId: string; episodes: Episode[]; onClose: () => void }) {
	// Force fresh lookup of episode to avoid caching issues
	const currentEpisode = episodes.find(ep => ep.episode_id === playingEpisodeId)

	// biome-ignore lint/complexity/useOptionalChain: <keep>
	if (!(currentEpisode && currentEpisode.audio_url)) {
		// Don't render anything - let the parent handle the conditional rendering
		// This prevents the player from "hiding" when switching between episodes
		return null
	}

	return <AudioPlayer episode={currentEpisode} onClose={onClose} />
}
