"use client"

import { Play, Sparkles } from "lucide-react"
import { notFound, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { PodcastCard } from "@/components/data-components/podcast-card"
import { SourceList } from "@/components/data-components/source-list"
import { EpisodeTranscript } from "@/components/episode-transcripts"
import AudioPlayer from "@/components/ui/audio-player"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Episode, UserCurationProfileWithRelations } from "@/lib/types"

interface UserCurationProfileProps {
	params: Promise<{ id: string }>
}

// Helper function to fetch user curation profile
const getUserCurationProfile = async (): Promise<UserCurationProfileWithRelations | null> => {
	try {
		const response = await fetch("/api/user-curation-profiles")
		if (!response.ok) {
			return null
		}
		return await response.json()
	} catch (error) {
		console.error("Error fetching user curation profile:", error)
		return null
	}
}

// Helper function to fetch episodes
const getEpisodes = async (): Promise<Episode[]> => {
	try {
		const response = await fetch("/api/episodes")
		if (!response.ok) {
			return []
		}
		return await response.json()
	} catch (error) {
		console.error("Error fetching episodes:", error)
		return []
	}
}

export default function CollectionPage({ params }: UserCurationProfileProps) {
	const [userCurationProfile, setUserCurationProfile] = useState<UserCurationProfileWithRelations | null>(null)
	const [episodes, setEpisodes] = useState<Episode[]>([])
	const [bundleEpisodes, setBundleEpisodes] = useState<Episode[]>([])
	const [loading, setLoading] = useState(true)
	const [playingEpisode, setPlayingEpisode] = useState<Episode | null>(null)

	const pathname = usePathname()

	useEffect(() => {
		if (pathname && !pathname.startsWith("/collections/")) {
			setPlayingEpisode(null)
		}
	}, [pathname])

	useEffect(() => {
		const fetchData = async () => {
			const { id } = await params
			const curationProfileData = await getUserCurationProfile()

			// Check if the requested profile matches the user's profile
			if (!curationProfileData || curationProfileData.profile_id !== id) {
				notFound()
				return
			}

			setUserCurationProfile(curationProfileData)

			// Get bundle episodes if this is a bundle selection
			if (curationProfileData.is_bundle_selection && curationProfileData.selectedBundle?.episodes) {
				setBundleEpisodes(curationProfileData.selectedBundle.episodes)
			}

			const allEpisodes = await getEpisodes()
			const filteredEpisodes = allEpisodes.filter((ep: { profile_id: string | null }) => ep.profile_id === id)
			setEpisodes(filteredEpisodes)
			setLoading(false)
		}
		fetchData()
	}, [params])

	const handlePlayEpisode = (episode: Episode) => {
		console.log("EPISODE______________:", episode)
		// setPlayingEpisode(episode)
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900">Loading...</div>
			</div>
		)
	}

	if (!userCurationProfile) {
		return <div>Collection not found.</div>
	}

	return (
		<>
			<Card className="w-full rounded-lg p-4 min-h-screen">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-2xl font-bold">Episodes for {userCurationProfile.name}</h2>
				</div>
				{userCurationProfile.is_bundle_selection && bundleEpisodes.length > 0 ? (
					<div className="flex flex-col w-full gap-4">
						<h3 className="text-lg font-semibold mb-2">Bundle Episodes</h3>
						{bundleEpisodes.map(episode => (
							<div key={episode.episode_id} className="border rounded-lg p-4">
								<h4 className="font-semibold">{episode.title}</h4>
								<p className="text-sm text-muted-foreground mb-2">{episode.description}</p>
								<p className="text-xs text-muted-foreground">Published: {episode.published_at ? new Date(episode.published_at).toLocaleDateString() : "N/A"}</p>
								{episode.audio_url && (
									<audio controls className="w-full mt-2">
										<source src={`${episode.audio_url}`} type="audio/mpeg" />
										<track kind="captions" src="" label="English" />
										Your browser does not support the audio element.
									</audio>
								)}
							</div>
						))}
					</div>
				) : episodes.length === 0 ? (
					<div className="text-center py-12">
						<div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
							<Play className="w-8 h-8 text-muted-foreground" />
						</div>
						<h3 className="text-lg font-semibold mb-2">No Episodes Generated Yet</h3>
						<p className="text-muted-foreground mb-4">This profile hasn't generated any episodes yet. Episodes are created weekly.</p>
						{userCurationProfile.status === "Saved" && (
							<Button variant="default" onClick={() => handlePlayEpisode(episodes[0])} disabled>
								<Sparkles className="w-4 h-4 mr-2" />
								Generate First Episode
							</Button>
						)}
					</div>
				) : (
					<div className="flex flex-col w-full gap-4">
						{episodes.map(ep => (
							<PodcastCard key={ep.episode_id} episode={ep} onPlayEpisode={handlePlayEpisode} />
						))}
					</div>
				)}
			</Card>
			{/* Sources list (1/3 width, right) */}
			<Card className="bg--card h-full rounded-lg p-4">
				<h3 className="text-xl font-semibold mb-4">Sources</h3>
				<SourceList sources={[]} />
			</Card>
			{playingEpisode && (
				<div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50">
					<AudioPlayer episode={playingEpisode} onClose={() => setPlayingEpisode(null)} />
					<EpisodeTranscript transcript={playingEpisode.description || ""} />
				</div>
			)}
		</>
	)
}
