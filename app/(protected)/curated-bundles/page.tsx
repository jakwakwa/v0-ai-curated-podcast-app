"use client"

import { AlertCircle, Lock, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { EpisodeList } from "@/components/episode-list"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AppSpinner } from "@/components/ui/app-spinner"
import AudioPlayer from "@/components/ui/audio-player"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Bundle, Episode, Podcast } from "@/lib/types"
import styles from "./page.module.css"

// Type for bundle with podcasts array from API
type BundleWithPodcasts = Bundle & { podcasts: Podcast[] }

// AKA PODSLICE BUNDLES
export default function CuratedBundlesPage() {
	const [curatedBundles, setCuratedBundles] = useState<BundleWithPodcasts[]>([])
	const [episodes, setEpisodes] = useState<Episode[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [playingEpisodeId, setPlayingEpisodeId] = useState<string | null>(null)

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

	return (
		<div className="wrapper">
			<div className="header">
				<h1>PODSLICE Bundles</h1>
				<p>Choose from our pre-curated podcast bundles. Each bundle contains 5 carefully selected shows and cannot be modified once selected.</p>
			</div>

			{isLoading ? (
				<div className={styles.loadingWrapper}>
					<AppSpinner size="lg" label="Loading PODSLICE Bundles..." />
				</div>
			) : error ? (
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
			) : curatedBundles.length === 0 ? (
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
					<div className={styles.bundleGrid}>
						{curatedBundles.map(bundle => (
							<Card key={bundle.bundle_id} className={styles.bundleCard}>
								<CardHeader className={styles.cardHeader}>
									<div className={styles.container}>
										<div className={styles.bundleInfo}>
											<CardTitle className={styles.bundleTitle}>{bundle.name}</CardTitle>
											<CardDescription className={styles.bundleDescription}>{bundle.description}</CardDescription>
										</div>
										<div className={styles.imgWrapper}>{bundle.image_url && <Image src={bundle.image_url} alt={bundle.name} className={styles.bundleImg} fill />}</div>

										<div className={styles.bundleMeta}>
											<Badge variant="outline" className={styles.podcastCount}>
												{bundle.podcasts.length} Podcasts
											</Badge>
											<div className={styles.lockedIndicator}>
												<Lock size={12} />
												<span>Fixed Selection</span>
											</div>
										</div>
									</div>
								</CardHeader>

								<CardContent className={styles.cardContent}>
									<h4 className={styles.podcastListTitle}>Included Podcasts:</h4>
									<ul className={styles.podcastList}>
										{bundle.podcasts.map(podcast => (
											<li key={podcast.podcast_id} className={styles.podcastItem}>
												<div className={styles.podcastInfo}>
													<span className={styles.podcastName}>{podcast.name}</span>
													<p className={styles.podcastDescription}>{podcast.description}</p>
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
						<div className="mt-12">
							<h2 className="text-2xl font-semibold tracking-tight mb-6">Episodes from PODSLICE Bundles</h2>
							<EpisodeList episodes={episodes} onPlayEpisode={handlePlayEpisode} playingEpisodeId={playingEpisodeId} />

							{/* Audio player shown at page level when episode is playing */}
							{playingEpisodeId && (
								<div className="mt-6">
									{(() => {
										const currentEpisode = episodes.find(ep => ep.episode_id === playingEpisodeId)
										return currentEpisode?.audio_url ? <AudioPlayer episode={currentEpisode} onClose={handleClosePlayer} /> : null
									})()}
								</div>
							)}
						</div>
					)}
				</>
			)}
		</div>
	)
}
