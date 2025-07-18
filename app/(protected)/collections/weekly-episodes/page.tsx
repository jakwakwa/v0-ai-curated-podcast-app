"use client"

import { getEpisodes, getUserCurationProfile } from "@/lib/data"
import { useUserCurationProfileStore } from "@/lib/stores/user-curation-profile-store"
import type { Episode, CuratedBundleEpisode } from "@/lib/types"
import { useEffect, useState } from "react"
import { EpisodeList } from "@/components/episode-list"
import { Play, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Combined episode type for display
interface CombinedEpisode {
	id: string
	title: string
	description: string | null
	audioUrl: string
	imageUrl: string | null
	publishedAt: Date | null
	createdAt: Date
	type: 'user' | 'bundle'
	userCurationProfileId?: string
	source?: any
	userCurationProfile?: any
}

export default function WeeklyEpisodesPage() {
	const [episodes, setEpisodes] = useState<Episode[]>([])
	const [bundleEpisodes, setBundleEpisodes] = useState<CuratedBundleEpisode[]>([])
	const [combinedEpisodes, setCombinedEpisodes] = useState<CombinedEpisode[]>([])
	const userCurationProfileStore = useUserCurationProfileStore()

	useEffect(() => {
		const fetchAllEpisodes = async () => {
			try {
				// Fetch user-generated episodes
				const userEpisodes = await getEpisodes()
				setEpisodes(userEpisodes)

				// Fetch user curation profiles to get bundle episodes
				const userProfiles = await getUserCurationProfile()
				const bundleEpisodesList: CuratedBundleEpisode[] = []

				// Collect all bundle episodes from user's selected bundles
				userProfiles.forEach(profile => {
					if (profile.isBundleSelection && profile.selectedBundle?.episodes) {
						bundleEpisodesList.push(...profile.selectedBundle.episodes)
					}
				})

				setBundleEpisodes(bundleEpisodesList)

				// Combine episodes for display
				const combined: CombinedEpisode[] = [
					// User episodes
					...userEpisodes.map(ep => ({
						...ep,
						type: 'user' as const
					})),
					// Bundle episodes
					...bundleEpisodesList.map(ep => ({
						id: ep.id,
						title: ep.title,
						description: ep.description,
						audioUrl: ep.audioUrl,
						imageUrl: ep.imageUrl,
						publishedAt: ep.publishedAt,
						createdAt: ep.createdAt,
						type: 'bundle' as const
					}))
				]

				// Sort by published date (newest first)
				combined.sort((a, b) => {
					const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
					const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
					return dateB - dateA
				})

				setCombinedEpisodes(combined)
			} catch (error) {
				console.error("Error fetching episodes:", error)
			}
		}

		fetchAllEpisodes()
	}, [])

	useEffect(() => {
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.log("WeeklyEpisodesPage: User Episodes:", episodes.length)
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.log("WeeklyEpisodesPage: Bundle Episodes:", bundleEpisodes.length)
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.log("WeeklyEpisodesPage: Combined Episodes:", combinedEpisodes.length)
	}, [episodes, bundleEpisodes, combinedEpisodes])

	return (
		<div className="w-full">
			<h1 className="text-2xl font-bold mb-6">All Episodes</h1>
			{combinedEpisodes.length === 0 ? (
				<div className="text-center py-12">
					<div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
						<Play className="w-8 h-8 text-muted-foreground" />
					</div>
					<h3 className="text-lg font-semibold mb-2">No Episodes Available</h3>
					<p className="text-muted-foreground mb-6 max-w-md mx-auto">
						Create a curation profile or select a bundle to start seeing episodes here.
					</p>
					<Link href="/build">
						<Button>
							<Plus className="w-4 h-4 mr-2" />
							Create Your First Profile
						</Button>
					</Link>
				</div>
			) : (
				<div className="space-y-6">
					{/* Summary */}
					<div className="flex gap-4 text-sm text-muted-foreground">
						<span>Total Episodes: {combinedEpisodes.length}</span>
						<span>User Episodes: {episodes.length}</span>
						<span>Bundle Episodes: {bundleEpisodes.length}</span>
					</div>

					{/* Episodes List */}
					<div className="space-y-4">
						{combinedEpisodes.map(episode => (
							<div key={episode.id} className="border rounded-lg p-4">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-2">
											<h3 className="font-semibold">{episode.title}</h3>
											<span className={`text-xs px-2 py-1 rounded ${
												episode.type === 'bundle'
													? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
													: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
											}`}>
												{episode.type === 'bundle' ? 'Bundle' : 'Custom'}
											</span>
										</div>
										{episode.description && (
											<p className="text-sm text-muted-foreground mb-2">{episode.description}</p>
										)}
										<p className="text-xs text-muted-foreground">
											Published: {episode.publishedAt ? new Date(episode.publishedAt).toLocaleDateString() : 'N/A'}
										</p>
									</div>
									{episode.audioUrl && (
										<audio controls className="w-64">
											<source src={episode.audioUrl} type="audio/mpeg" />
											Your browser does not support the audio element.
										</audio>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
