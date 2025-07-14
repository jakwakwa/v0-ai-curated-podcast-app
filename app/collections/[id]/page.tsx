"use client"

import { EpisodeTranscript } from "@/components/episode-transcripts"
import { PodcastCard } from "@/components/podcast-card"
import { SourceList } from "@/components/source-list"
import AudioPlayer from "@/components/ui/audio-player"
import { Card } from "@/components/ui/card"
import { getCuratedCollections, getEpisodes } from "@/lib/data"
import type { Episode } from "@/lib/types"
import type { CuratedCollection } from "@/lib/types"
import { notFound, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

interface CollectionPageProps {
	params: Promise<{ id: string }>
}

export default function CollectionPage({ params }: CollectionPageProps) {
	const [collection, setCollection] = useState<CuratedCollection | null>(null)
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
			const collectionsData = await getCuratedCollections()
			const foundCollection = collectionsData.find(c => c.id === id)
			if (!foundCollection) {
				notFound()
				return
			}
			setCollection(foundCollection)

			const allEpisodes = await getEpisodes()
			const filteredEpisodes = allEpisodes.filter(ep => ep.collectionId === id)
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

	if (!collection) {
		return <div>Collection not found.</div>
	}

	return (
		<>
			<Card className="w-full rounded-lg p-4 min-h-screen">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-2xl font-bold">Episodes for {collection.name}</h2>
				</div>
				{episodes.length === 0 ? (
					<div className="text-muted-foreground">No episodes generated yet.</div>
				) : (
					<div className="flex flex-col w-full">
						{episodes.map(ep => (
							<PodcastCard key={ep.id} episode={ep} onPlayEpisode={handlePlayEpisode} />
						))}
					</div>
				)}
			</Card>
			{/* Sources list (1/3 width, right) */}
			<Card className="bg--card h-full rounded-lg p-4">
				<h3 className="text-xl font-semibold mb-4">Sources</h3>
				<SourceList sources={collection.sources} />
			</Card>
			{playingEpisode && (
				<div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50">
					<AudioPlayer
						episode={{
							imageUrl: playingEpisode.imageUrl,
							title: playingEpisode.title,
							audioUrl: playingEpisode.audioUrl,
							description: playingEpisode.description || "",
						}}
					/>
					<EpisodeTranscript transcript={playingEpisode.description || ""} />
				</div>
			)}
		</>
	)
}
