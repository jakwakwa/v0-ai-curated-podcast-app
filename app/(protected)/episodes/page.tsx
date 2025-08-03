"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { EpisodeList } from "@/components/episode-list"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AppSpinner } from "@/components/ui/app-spinner"
import AudioPlayer from "@/components/ui/audio-player"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import type { Episode } from "@/lib/types"

export default function EpisodesPage() {
	const [episodes, setEpisodes] = useState<Episode[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [playingEpisodeId, setPlayingEpisodeId] = useState<string | null>(null)

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
		<div className="wrapper">
			<PageHeader title="Weekly Episodes" description="Listen to all your curated podcast episodes from your personal feed and selected bundles." />

			{isLoading ? (
				<div className="flex items-center justify-center min-h-[400px]">
					<AppSpinner size="lg" label="Loading episodes..." />
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
				<div className="max-w-2xl mx-auto mt-8">
					<Alert>
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>No Episodes Available</AlertTitle>
						<AlertDescription className="mt-2">There are no episodes available at the moment. Create a personal feed or select a bundle to start getting episodes.</AlertDescription>
					</Alert>
					<div className="mt-6 text-center">
						<Button onClick={fetchEpisodes} variant="outline">
							<RefreshCw className="h-4 w-4 mr-2" />
							Refresh
						</Button>
					</div>
				</div>
			) : (
				<>
					<div className="mt-8">
						<h2 className="text-2xl font-semibold tracking-tight mb-6">All Episodes ({episodes.length})</h2>
						<EpisodeList episodes={episodes} onPlayEpisode={handlePlayEpisode} playingEpisodeId={playingEpisodeId} />

						{/* Audio player shown at page level when episode is playing */}
						{playingEpisodeId && (
							<div className="mt-6">
								<AudioPlayerWrapper playingEpisodeId={playingEpisodeId} episodes={episodes} onClose={handleClosePlayer} />
							</div>
						)}
					</div>
				</>
			)}
		</div>
	)
}

function AudioPlayerWrapper({ playingEpisodeId, episodes, onClose }: { playingEpisodeId: string; episodes: Episode[]; onClose: () => void }) {
	console.log("AudioPlayerWrapper - playingEpisodeId:", playingEpisodeId)
	console.log("AudioPlayerWrapper - episodes count:", episodes.length)

	const currentEpisode = episodes.find(ep => ep.episode_id === playingEpisodeId)
	console.log("AudioPlayerWrapper - found episode:", currentEpisode)

	if (!currentEpisode) {
		console.warn("No episode found for ID:", playingEpisodeId)
		return (
			<div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
				<p className="text-sm text-destructive">Episode not found</p>
				<button type="button" onClick={onClose} className="text-xs underline">
					Close
				</button>
			</div>
		)
	}

	if (!currentEpisode.audio_url) {
		console.warn("Episode found but no audio URL:", currentEpisode)
		return (
			<div className="p-4 bg-muted/10 border border-muted/20 rounded-md">
				<p className="text-sm text-muted-foreground">No audio available for this episode</p>
				<button type="button" onClick={onClose} className="text-xs underline">
					Close
				</button>
			</div>
		)
	}

	console.log("AudioPlayerWrapper - rendering AudioPlayer with episode:", currentEpisode.title)
	return <AudioPlayer episode={currentEpisode} onClose={onClose} />
}
