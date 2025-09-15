"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { EpisodeList } from "@/components/episode-list"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AppSpinner } from "@/components/ui/app-spinner"
import AudioPlayer from "@/components/ui/audio-player"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { H3 } from "@/components/ui/typography"
import type { Episode } from "@/lib/types"

export default function EpisodesPage() {
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

	const fetchEpisodes = useCallback(async () => {
		try {
			setIsLoading(true)
			setError(null)

			const response = await fetch("/api/episodes")

			if (!response.ok) {
				throw new Error(`Failed to load episodes. Server responded with status ${response.status}.`)
			}

			const episodesData = await response.json()
			setEpisodes(episodesData)
		} catch (error) {
			console.error("Error fetching episodes:", error)
			setError(error instanceof Error ? error.message : "An unexpected error occurred while loading episodes.")
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchEpisodes()
	}, [fetchEpisodes])

	const handlePlayEpisode = (episodeId: string) => {
		setPlayingEpisodeId(episodeId)
	}

	const handleClosePlayer = () => {
		setPlayingEpisodeId(null)
	}

	return (
		<div className="w-full episode-card-wrapper">
			<PageHeader
				title="Bundle Episodes"
				description="Choose from our pre-curated podcast bundles. Each bundle is a fixed selection of 2-5 carefully selected shows and cannot be modified once selected."
			/>


			{isLoading ? (
				<div className="px-0 md:p-8 mx-auto">
					<div className="flex items-center justify-center min-h-[500px]">
						<AppSpinner variant={"wave"} size="lg" label="Loading Podslice Episodes..." />
					</div>
				</div>
			) : error ? (
				<div className="max-w-2xl mx-auto mt-8">
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Unable to Load Episodes</AlertTitle>
						<AlertDescription className="mt-2">{error}</AlertDescription>
					</Alert>
					<div className="mt-6 text-center">
						<Button onClick={fetchEpisodes} variant="outline">
							<RefreshCw className="h-4 w-4 mr-2" />
							Try Again
						</Button>
					</div>
				</div>
			) : episodes.length === 0 ? (
				<div className="w-full  max-w-[1000px] mx-auto mt-0">
					<Alert>
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>No Episodes Available</AlertTitle>
						<AlertDescription className="mt-2">There are no episodes available at the moment. Create a personal feed or select a bundle to start getting episodes.</AlertDescription>
					</Alert>
					<div className="mt-6 text-center">
						<Button onClick={fetchEpisodes} variant="default">
							<RefreshCw className="h-4 w-4 mr-2" />
							Refresh Episodes
						</Button>
					</div>
				</div>
			) : (
				<div className="flex episode-card-wrapper bg-primary-card flex-col justify-center mx-auto w-screen md:w-screen max-w-full mt-0">
					<H3 className="pl-3">Episodes ({episodes.length})</H3>
					<EpisodeList episodes={episodes} onPlayEpisode={handlePlayEpisode} playingEpisodeId={playingEpisodeId} />

					{/* Spacer for fixed audio player */}
					{playingEpisodeId && <div className="h-24" />}
				</div>
			)}

			{/* Portal audio player to global container */}
			{playingEpisodeId &&
				portalContainer &&
				createPortal(
					<div className="bg-background">
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
