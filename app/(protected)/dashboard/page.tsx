"use client"

import { Play } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { EditUserCurationProfileModal } from "@/components/edit-user-curation-profile-modal"
import AudioPlayer from "@/components/ui/audio-player"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UserCurationProfileCreationWizard } from "@/components/user-curation-profile-creation-wizard"
import { getEpisodes, getUserCurationProfile } from "@/lib/data"
import type { CuratedBundleEpisode, CuratedPodcast, Episode, Source, UserCurationProfile, UserCurationProfileWithRelations } from "@/lib/types"

import { useUserCurationProfileStore } from "./../../../lib/stores/user-curation-profile-store"
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
	type: "user" | "bundle"
	userCurationProfileId?: string
	source?: Source
	userCurationProfile?: UserCurationProfile
}

export default function Page() {
	const [userCurationProfile, setUserCurationProfile] = useState<UserCurationProfileWithRelations | null>(null)
	const [episodes, setEpisodes] = useState<Episode[]>([])
	const [bundleEpisodes, setBundleEpisodes] = useState<CuratedBundleEpisode[]>([])
	const [combinedEpisodes, setCombinedEpisodes] = useState<CombinedEpisode[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [playingEpisodeId, setPlayingEpisodeId] = useState<string | null>(null)
	const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false)

	const fetchAndUpdateData = useCallback(async () => {
		// Fetch user curation profile and episodes in parallel
		const [fetchedProfile, fetchedEpisodes] = await Promise.all([getUserCurationProfile(), getEpisodes()])

		setUserCurationProfile(fetchedProfile)

		// Convert unified episodes to display format with type detection
		const combined: CombinedEpisode[] = fetchedEpisodes.map(ep => ({
			id: ep.id,
			title: ep.title,
			description: ep.description,
			audioUrl: ep.audioUrl,
			imageUrl: ep.imageUrl,
			publishedAt: ep.publishedAt,
			createdAt: ep.createdAt,
			type: ep.bundleId ? "bundle" : ("user" as const), // Determine type based on presence of bundle
			userCurationProfileId: ep.userProfileId || undefined,
			source: undefined, // We don't have the podcast relation loaded
			userCurationProfile: undefined, // We don't have the userProfile relation loaded
		}))

		// Sort by published date (newest first)
		combined.sort((a, b) => {
			const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
			const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
			return dateB - dateA
		})

		setCombinedEpisodes(combined)
		setEpisodes(fetchedEpisodes.filter(ep => !ep.bundleId)) // User episodes only
		setBundleEpisodes(fetchedEpisodes.filter(ep => ep.bundleId)) // Bundle episodes only
	}, [])

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true)
				await fetchAndUpdateData()
			} catch (error: unknown) {
				const message = error instanceof Error ? error.message : String(error)
				toast.error(`Failed to load dashboard data: ${message}`)
			} finally {
				setIsLoading(false)
			}
		}

		fetchData()
	}, [fetchAndUpdateData])

	const handleSaveUserCurationProfile = async (updatedData: Partial<UserCurationProfile>) => {
		if (!userCurationProfile) return
		try {
			const response = await fetch(`/api/user-curation-profiles/${userCurationProfile.id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedData),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.error || errorData.message || "Failed to update user curation profile")
			}

			// Refetch data after successful update to show new bundle selection
			await fetchAndUpdateData()

			toast.success("User Curation Profile updated successfully!")
			setIsModalOpen(false)
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error)
			toast.error(`Failed to update user curation profile: ${message}`)
		}
	}

	const handlePlayEpisode = (episodeId: string) => {
		console.log(episodeId)
		setPlayingEpisodeId(episodeId)
	}

	const handleClosePlayer = () => {
		setPlayingEpisodeId(null)
	}

	if (isLoading) {
		return (
			<div className={styles.loadingContainer}>
				<div className={styles.loadingContent}>
					<div className={styles.loadingSpinner} />
					<p>Loading dashboard...</p>
				</div>
			</div>
		)
	}

	return (
		<>
			<div className={styles.dashboardContainer}>
				<div className={styles.mainContainer}>
					<div className={styles.contentWrapper}>
						{userCurationProfile ? (
							<div className={styles.gridContainer}>
								<Card>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">Current User Curation Profile</CardTitle>
										<Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
											Edit
										</Button>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{userCurationProfile?.name}</div>
										<p className="text-xs text-muted-foreground">Status: {userCurationProfile?.status}</p>
									</CardContent>
								</Card>

								{userCurationProfile?.isBundleSelection && userCurationProfile?.selectedBundle && (
									<Card>
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-medium">Selected Bundle</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">{userCurationProfile.selectedBundle.name}</div>
											<p className="text-xs text-muted-foreground">{userCurationProfile.selectedBundle.description}</p>
											<div className="mt-2 text-sm">
												<p className="font-medium">Podcasts:</p>
												<ul className="list-disc pl-5 text-muted-foreground">
													{userCurationProfile.selectedBundle.podcasts?.map((podcast: CuratedPodcast) => <li key={podcast.id}>{podcast.name}</li>) || (
														<li className="text-muted-foreground">No podcasts loaded</li>
													)}
												</ul>
											</div>
											{userCurationProfile.selectedBundle.episodes && userCurationProfile.selectedBundle.episodes.length > 0 && (
												<div className="mt-4 text-sm">
													<p className="font-medium">Bundle Episodes:</p>
													<ul className="list-disc pl-5 text-muted-foreground">
														{userCurationProfile.selectedBundle.episodes.map(episode => (
															<li key={episode.id}>
																{episode.title} - {episode.publishedAt ? new Date(episode.publishedAt).toLocaleDateString() : "N/A"}
															</li>
														))}
													</ul>
												</div>
											)}
										</CardContent>
									</Card>
								)}
							</div>
						) : (
							<div className="px-0 lg:px-6">
								<Card>
									<CardHeader>
										<CardTitle>No User Curation Profile Found</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground">It looks like you haven't created a user curation profile yet. Start by creating one!</p>
										<Button className="mt-4" onClick={() => setIsCreateWizardOpen(true)}>
											Create Curation Profile
										</Button>
									</CardContent>
								</Card>
							</div>
						)}

						<div className={styles.episodesSection}>
							{combinedEpisodes.length === 0 ? (
								<Card>
									<CardHeader>
										<CardTitle>Weekly Episodes</CardTitle>
									</CardHeader>
									<CardContent>
										<div className={styles.emptyState}>
											<h3 className={styles.emptyStateTitle}>No Episodes Available</h3>
											<p className={styles.emptyStateDescription}>
												{userCurationProfile
													? "Your profile hasn't generated any episodes yet. Episodes are created weekly."
													: "Create a curation profile or select a bundle to start seeing episodes here."}
											</p>
										</div>
									</CardContent>
								</Card>
							) : (
								<div className="space-y-6">
									<div className={styles.episodesHeader}>
										<h2 className={styles.episodesTitle}>Weekly Episodes</h2>
										<div className={styles.episodesSummary}>
											<span>Total: {combinedEpisodes.length}</span>
											<span>Custom: {episodes.length}</span>
											<span>Bundle: {bundleEpisodes.length}</span>
										</div>
									</div>

									<div className={styles.episodesList}>
										{combinedEpisodes.map(episode => (
											<Card key={episode.id} className={styles.episodeCard}>
												<CardContent className="p-4">
													<div className={styles.episodeContent}>
														<div className={styles.episodeInfo}>
															<div className={styles.episodeHeader}>
																<h3 className={styles.episodeTitle}>{episode.title}</h3>
																<span className={`${styles.episodeType} ${episode.type === "bundle" ? styles.episodeTypeBundle : styles.episodeTypeCustom}`}>
																	{episode.type === "bundle" ? "Bundle" : "Custom"}
																</span>
															</div>
															<div className={styles.playButtonContainer}>
																<Button onClick={() => handlePlayEpisode(episode.id)} variant="outline" size="sm" className={styles.playButton}>
																	<Play className={styles.playIcon} />
																	Play Episode
																</Button>
															</div>
															{episode.description && <p className={styles.episodeDescription}>{episode.description}</p>}
															<p className={styles.episodeDate}>Published: {episode.publishedAt ? new Date(episode.publishedAt).toLocaleDateString() : "N/A"}</p>
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
																		podcastId: episode.source?.id || "",
																		userProfileId: episode.userCurationProfileId || null,
																		bundleId: null,
																	}}
																	onClose={handleClosePlayer}
																/>
															</div>
														)}
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			{userCurationProfile && (
				<EditUserCurationProfileModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					collection={userCurationProfile as UserCurationProfileWithRelations}
					onSave={handleSaveUserCurationProfile}
				/>
			)}
			<Dialog open={isCreateWizardOpen} onOpenChange={setIsCreateWizardOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Create Your Curation Profile</DialogTitle>
					</DialogHeader>
					<UserCurationProfileCreationWizardWrapper
						onSuccess={async () => {
							setIsCreateWizardOpen(false)
							await fetchAndUpdateData()
						}}
					/>
				</DialogContent>
			</Dialog>
		</>
	)
}

function UserCurationProfileCreationWizardWrapper({ onSuccess }: { onSuccess: () => void }) {
	// Use a local state to track if the profile was created
	const { userCurationProfile } = useUserCurationProfileStore()
	const [hasCreated, setHasCreated] = useState(false)

	useEffect(() => {
		if (userCurationProfile && !hasCreated) {
			setHasCreated(true)
			onSuccess()
		}
	}, [userCurationProfile, hasCreated, onSuccess])

	return <UserCurationProfileCreationWizard />
}
