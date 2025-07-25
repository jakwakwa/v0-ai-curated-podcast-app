"use client"

import { AlertCircle, Play, Plus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AppSpinner } from "@/components/ui/app-spinner"
import AudioPlayer from "@/components/ui/audio-player"
import { Button } from "@/components/ui/button"
import type { UserCurationProfile } from "@/lib/types"
import styles from "./page.module.css"

// Episode type for this component
interface Episode {
	episode_id: string
	title: string
	description: string | null
	audio_url: string
	image_url: string | null
	published_at: Date | null
	created_at: Date
	profile_id?: string
	bundle_id?: string
	podcast_id?: string
}

// Bundle episode type for this component
interface CuratedBundleEpisode {
	episode_id: string
	title: string
	description: string | null
	audio_url: string
	image_url: string | null
	published_at: Date | null
	created_at: Date
}

// Combined episode type for display
interface CombinedEpisode {
	episode_id: string
	title: string
	description: string | null
	audio_url: string
	image_url: string | null
	published_at: Date | null
	created_at: Date
	type: "user" | "bundle"
	profile_id?: string
	podcast_id?: string
	userCurationProfile?: UserCurationProfile | null
}

export default function WeeklyEpisodesPage() {
	const [_episodes, setEpisodes] = useState<Episode[]>([])
	const [_bundleEpisodes, setBundleEpisodes] = useState<CuratedBundleEpisode[]>([])
	const [combinedEpisodes, setCombinedEpisodes] = useState<CombinedEpisode[]>([])
	const [userProfile, setUserProfile] = useState<UserCurationProfile | null>(null)
	const [existingProfile, setExistingProfile] = useState<UserCurationProfile | null>(null)
	const [isCheckingProfile, setIsCheckingProfile] = useState(true)
	const [playingEpisodeId, setPlayingEpisodeId] = useState<string | null>(null)

	useEffect(() => {
		const checkExistingProfile = async () => {
			try {
				const response = await fetch("/api/user-curation-profiles")
				if (response.ok) {
					const profile = await response.json()
					setExistingProfile(profile)
				}
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
				const profileResponse = await fetch("/api/user-curation-profiles")
				if (profileResponse.ok) {
					const userProfileData = await profileResponse.json()
					setUserProfile(userProfileData)
				}

				// Fetch all episodes (this already includes episodes from both user profiles and selected bundles)
				const episodesResponse = await fetch("/api/episodes")
				if (episodesResponse.ok) {
					const allEpisodes = await episodesResponse.json()
					setEpisodes(allEpisodes)

					// For bundle episodes, we'll categorize them based on their source
					// Episodes with bundleId are bundle episodes, others are custom episodes
					const combined: CombinedEpisode[] = allEpisodes.map((ep: Episode) => ({
						...ep,
						type: ep.bundle_id ? ("bundle" as const) : ("user" as const),
						podcast_id: ep.podcast_id,
					}))

					// No need to separately fetch bundle episodes since they're already included in allEpisodes
					setBundleEpisodes(combined.filter(ep => ep.type === "bundle") as unknown as CuratedBundleEpisode[])

					// Sort by published date (newest first)
					combined.sort((a, b) => {
						const dateA = a.published_at ? new Date(a.published_at).getTime() : 0
						const dateB = b.published_at ? new Date(b.published_at).getTime() : 0
						return dateB - dateA
					})

					setCombinedEpisodes(combined)
				}
			} catch (error) {
				console.error("Error fetching episodes:", error)
			}
		}

		fetchAllEpisodes()
	}, [])

	const handlePlayEpisode = (episodeId: string) => {
		setPlayingEpisodeId(episodeId)
	}

	const handleClosePlayer = () => {
		setPlayingEpisodeId(null)
	}

	return (
		<div className="container">
			<div className="header">
				<h1 className={styles.title}>All Episodes</h1>
				<p>Your Personalized feed's episodes.</p>
			</div>
			{isCheckingProfile ? (
				<div className={styles.loadingContainer}>
					<div className={styles.loadingWrapper}>
						<AppSpinner size="lg" label="Loading..." />
					</div>
				</div>
			) : isCheckingProfile ? (
				<div className="max-w-2xl mx-auto mt-8">
					{!(userProfile || existingProfile) && (
						<div className="mt-6 text-center">
							<Alert>
								<AlertCircle className="h-4 w-4" />
								<AlertTitle>No Episodes Available</AlertTitle>
								<AlertDescription className="mt-2">
									{userProfile
										? "Your personalized episodes are on their way! New episodes are generated weekly."
										: existingProfile
											? "Your personalized episodes are on their way! New episodes are generated weekly."
											: "Start your journey by creating a Personalized Feed or selecting a bundle to discover episodes."}
								</AlertDescription>
							</Alert>
							<Link href="/build">
								<Button>
									<Plus className="h-4 w-4 mr-2" />
									Create Your First Profile
								</Button>
							</Link>
						</div>
					)}
				</div>
			) : (
				<div className="space-y-6">
					{/* Summary */}
					<div className={styles.summary}>
						<span>Total Episodes: {combinedEpisodes.length}</span>
						{/* <span>User Episodes: {combinedEpisodes.filter(ep => ep.type === "user").length}</span> */}
						{/* <span>Bundle Episodes: {combinedEpisodes.filter(ep => ep.type === "bundle").length}</span> */}
						{userProfile && <span>{userProfile.is_bundle_selection ? "Bundle Selection" : "Custom Profile"}</span>}
					</div>

					{/* Episodes List */}
					<div className={styles.episodesList}>
						{combinedEpisodes.map(episode => (
							<div key={episode.episode_id} className="episodeCard">
								<div className={styles.episodeContent}>
									<div className={styles.episodeInfo}>
										<div className={styles.episodeHeader}>
											<h3 className={styles.episodeTitle}>{episode.title}</h3>
											<span className={`${styles.episodeType} ${episode.type === "bundle" ? styles.episodeTypeBundle : styles.episodeTypeCustom}`}>
												{episode.type === "bundle" ? "Bundle" : "Custom"}
											</span>
										</div>
										<div className={styles.playButtonContainer}>
											<Button onClick={() => handlePlayEpisode(episode.episode_id)} variant="outline" size="sm" className={styles.playButton}>
												<Play className={styles.playIcon} />
												Play Episode
											</Button>
										</div>
										{episode.description && <p className="episodeDescription">{episode.description}</p>}
										<p className={styles.episodeDate}>Published: {episode.published_at ? new Date(episode.published_at).toLocaleDateString() : "N/A"}</p>
									</div>
									{episode.audio_url && playingEpisodeId === episode.episode_id && (
										<div className={styles.episodeAudio}>
											<AudioPlayer
												episode={{
													episode_id: episode.episode_id,
													title: episode.title,
													description: episode.description,
													audio_url: episode.audio_url,
													image_url: episode.image_url,
													published_at: episode.published_at,
													week_nr: episode.created_at,
													created_at: episode.created_at,
													podcast_id: episode.podcast_id || "",
													profile_id: episode.profile_id || null,
													bundle_id: null,
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
