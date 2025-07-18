"use client"

import { EpisodeTranscript } from "@/components/episode-transcripts"
import { PodcastCard } from "@/components/podcast-card"
import { SourceList } from "@/components/source-list"
import AudioPlayer from "@/components/ui/audio-player"
import { Card } from "@/components/ui/card"
import { getEpisodes, getUserCurationProfile } from "@/lib/data"
import type { Episode } from "@/lib/types"
import type { UserCurationProfileWithSources } from "@/lib/types"
import { notFound, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

interface UserCurationProfileProps {
	params: Promise<{ id: string }>
}

export default function CollectionPage({ params }: UserCurationProfileProps) {
	const [userCurationProfile, setUserCurationProfile] = useState<UserCurationProfileWithSources | null>(null)
	const [episodes, setEpisodes] = useState<Episode[]>([])
	const [loading, setLoading] = useState(true)
	const [playingEpisode, setPlayingEpisode] = useState<Episode | null>(null)

	const pathname = usePathname()

	useEffect(() => {
		if (!pathname.startsWith("/collections/")) {
			setPlayingEpisode(null)
		}
	}, [pathname])

	useEffect(() => {
		const fetchData = async () => {
			const { id } = await params
			const curationProfileData = await getUserCurationProfile()
			const foundUserCurationProfile = curationProfileData.find(c => c.id === id)
			if (!foundUserCurationProfile) {
				notFound()
				return
			}
			setUserCurationProfile(foundUserCurationProfile)

			const allEpisodes = await getEpisodes()
			const filteredEpisodes = allEpisodes.filter(
				(ep: { userCurationProfileId: string }) => ep.userCurationProfileId === id
			)
			setEpisodes(filteredEpisodes)
			setLoading(false)
		}
		fetchData()
	}, [params])

	const handlePlayEpisode = (episode: Episode) => {
		setPlayingEpisode(episode)
	}

	if (loading) {
		return <div>Loading...</div>
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
				{episodes.length === 0 ? (
					<div className="text-muted-foreground">No episodes generated yet.</div>
				) : (
					<div className="flex flex-col w-full gap-4">
						{episodes.map(ep => (
							<PodcastCard key={ep.id} episode={ep} onPlayEpisode={handlePlayEpisode} />
						))}
					</div>
				)}
			</Card>
			{/* Sources list (1/3 width, right) */}
			<Card className="bg--card h-full rounded-lg p-4">
				<h3 className="text-xl font-semibold mb-4">Sources</h3>
				<SourceList sources={userCurationProfile.sources} />
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
