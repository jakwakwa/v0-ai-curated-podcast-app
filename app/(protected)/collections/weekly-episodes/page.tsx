"use client"

import { getEpisodes, getUserCurationProfile } from "@/lib/data"
import { useUserCurationProfileStore } from "@/lib/stores/user-curation-profile-store"
import type { Episode, CuratedBundleEpisode } from "@/lib/types"
import { useEffect, useState } from "react"
import { EpisodeList } from "@/components/episode-list"
import { Play, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import AudioPlayer from "@/components/ui/audio-player"
import Link from "next/link"
import styles from "./page.module.css"

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
	const [userProfile, setUserProfile] = useState<any>(null)
	const [existingProfile, setExistingProfile] = useState<any>(null)
	const [isCheckingProfile, setIsCheckingProfile] = useState(true)
	const [playingEpisodeId, setPlayingEpisodeId] = useState<string | null>(null)
	const userCurationProfileStore = useUserCurationProfileStore()

	useEffect(() => {
		const checkExistingProfile = async () => {
			try {
				const profile = await getUserCurationProfile()
				setExistingProfile(profile)
			} catch (error) {
				console.error("Error checking existing profile:", error)
			} finally {
				setIsCheckingProfile(false)
			}
		}

		checkExistingProfile()
	}, [])

	useEffect(() => {
		const fetchAllEpisodes = async () => {
			try {
				// Fetch user curation profile first
				const userProfileData = await getUserCurationProfile()
				setUserProfile(userProfileData)

				// Fetch user-generated episodes
				const userEpisodes = await getEpisodes()
				setEpisodes(userEpisodes)

				// Get bundle episodes if user has a bundle selection
				let bundleEpisodesList: CuratedBundleEpisode[] = []
				if (userProfileData?.isBundleSelection && userProfileData?.selectedBundle?.episodes) {
					bundleEpisodesList = userProfileData.selectedBundle.episodes
				}

				setBundleEpisodes(bundleEpisodesList)

				// Combine episodes for display
				const combined: CombinedEpisode[] = [
					// User episodes (from custom profile)
					...userEpisodes.map(ep => ({
						...ep,
						type: 'user' as const
					})),
					// Bundle episodes (from bundle selection)
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
		console.log("WeeklyEpisodesPage: User Profile:", userProfile)
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.log("WeeklyEpisodesPage: User Episodes:", episodes.length)
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.log("WeeklyEpisodesPage: Bundle Episodes:", bundleEpisodes.length)
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.log("WeeklyEpisodesPage: Combined Episodes:", combinedEpisodes.length)
	}, [userProfile, episodes, bundleEpisodes, combinedEpisodes])

	const handlePlayEpisode = (episodeId: string) => {
		setPlayingEpisodeId(episodeId)
	}

	const handleClosePlayer = () => {
		setPlayingEpisodeId(null)
	}

	// Show loading state while checking for existing profile
	if (isCheckingProfile) {
		return (
			<div className={styles.loadingContainer}>
				<div className={styles.loadingContent}>
					<div className={styles.loadingSpinner} />
					<p>Loading...</p>
				</div>
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>All Episodes</h1>
			{combinedEpisodes.length === 0 ? (
				<div className={styles.emptyState}>
					<div className={styles.emptyStateIcon}>
						<Play className={styles.emptyStateIconInner} />
					</div>
					<h3 className={styles.emptyStateTitle}>No Episodes Available</h3>
					<p className={styles.emptyStateDescription}>
						{userProfile
							? "Your profile hasn't generated any episodes yet. Episodes are created weekly."
							: existingProfile
							? "Your profile hasn't generated any episodes yet. Episodes are created weekly."
							: "Create a curation profile or select a bundle to start seeing episodes here."
						}
					</p>
					{!userProfile && !existingProfile && (
						<Link href="/build">
							<Button className={styles.createButton}>
								<Plus className={styles.createButtonIcon} />
								Create Your First Profile
							</Button>
						</Link>
					)}
				</div>
			) : (
				<div className="space-y-6">
					{/* Summary */}
					<div className={styles.summary}>
						<span>Total Episodes: {combinedEpisodes.length}</span>
						<span>User Episodes: {episodes.length}</span>
						<span>Bundle Episodes: {bundleEpisodes.length}</span>
						{userProfile && (
							<span>Profile Type: {userProfile.isBundleSelection ? 'Bundle Selection' : 'Custom Profile'}</span>
						)}
					</div>

					{/* Episodes List */}
					<div className={styles.episodesList}>
						{combinedEpisodes.map(episode => (
							<div key={episode.id} className={styles.episodeCard}>
								<div className={styles.episodeContent}>
									<div className={styles.episodeInfo}>
										<div className={styles.episodeHeader}>
											<h3 className={styles.episodeTitle}>{episode.title}</h3>
											<span className={`${styles.episodeType} ${
												episode.type === 'bundle'
													? styles.episodeTypeBundle
													: styles.episodeTypeCustom
											}`}>
												{episode.type === 'bundle' ? 'Bundle' : 'Custom'}
											</span>
										</div>
										<div className={styles.playButtonContainer}>
											<Button
												onClick={() => handlePlayEpisode(episode.id)}
												variant="outline"
												size="sm"
												className={styles.playButton}
											>
												<Play className={styles.playIcon} />
												Play Episode
											</Button>
										</div>
										{episode.description && (
											<p className={styles.episodeDescription}>{episode.description}</p>
										)}
										<p className={styles.episodeDate}>
											Published: {episode.publishedAt ? new Date(episode.publishedAt).toLocaleDateString() : 'N/A'}
										</p>
									</div>
									{episode.audioUrl && playingEpisodeId === episode.id && (
										<div className={styles.episodeAudio}>
											<AudioPlayer
												episode={{
													id: episode.id,
													title: episode.title,
													description: episode.description,
													audioUrl: episode.audioUrl,
													imageUrl: episode.imageUrl,
													publishedAt: episode.publishedAt,
													weekNr: episode.createdAt,
													createdAt: episode.createdAt,
													sourceId: episode.userCurationProfileId || '',
													userCurationProfileId: episode.userCurationProfileId || '',
													source: episode.source,
													userCurationProfile: episode.userCurationProfile
												}}
												onClose={handleClosePlayer}
											/>
										</div>
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
