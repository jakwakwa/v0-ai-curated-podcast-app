"use client"

import { AlertCircle } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { toast } from "sonner"
import EditUserFeedModal from "@/components/edit-user-feed-modal"
import EmptyStateCard from "@/components/empty-state-card"
import { EpisodeList } from "@/components/episode-list"
import { ProfileFeedCards } from "@/components/features/profile-feed-cards"
import UserFeedSelector from "@/components/features/user-feed-selector"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AppSpinner } from "@/components/ui/app-spinner"
import AudioPlayer from "@/components/ui/audio-player"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PageHeader } from "@/components/ui/page-header"
import { Typography } from "@/components/ui/typography"
import { useEpisodesStore } from "@/lib/stores/episodes-store"
import type { Episode, UserCurationProfile, UserCurationProfileWithRelations } from "@/lib/types"
import { useUserCurationProfileStore } from "./../../../lib/stores/user-curation-profile-store"

export default function Page() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [playingEpisodeId, setPlayingEpisodeId] = useState<string | null>(null)
	const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false)
	const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

	// Find the portal container on mount
	useEffect(() => {
		const container = document.getElementById("global-audio-player")
		setPortalContainer(container)
	}, [])

	// Use the episodes store
	const { combinedEpisodes, userCurationProfile, isLoading, error, fetchEpisodes, fetchUserCurationProfile, refreshData, clearError } = useEpisodesStore()

	// Fetch data on component mount
	useEffect(() => {
		const fetchData = async () => {
			try {
				await Promise.all([fetchEpisodes(), fetchUserCurationProfile()])
			} catch (error: unknown) {
				const message = error instanceof Error ? error.message : String(error)
				toast.error(`Failed to load dashboard data: ${message}`)
			}
		}

		fetchData()
	}, [fetchEpisodes, fetchUserCurationProfile])

	// Clear error when component unmounts
	useEffect(() => {
		return () => {
			clearError()
		}
	}, [clearError])

	const handleSaveUserCurationProfile = async (updatedData: Partial<UserCurationProfile>) => {
		if (!userCurationProfile) return
		try {
			const response = await fetch(`/api/user-curation-profiles/${userCurationProfile.profile_id}`, {
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

			// Refresh data after successful update
			await refreshData()

			toast.success("Personalized Feed updated successfully!")
			setIsModalOpen(false)
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error)
			toast.error(`Failed to update Personalized Feed: ${message}`)
		}
	}

	const handlePlayEpisode = useCallback((episodeId: string) => {
		setPlayingEpisodeId(episodeId)
	}, [])

	const handleClosePlayer = useCallback(() => {
		setPlayingEpisodeId(null)
	}, [])

	const _handleRefreshData = async () => {
		await refreshData()
	}

	if (isLoading) {
		return (
			<div className="p-8 mx-auto">
				<div className="flex items-center justify-center min-h-[400px]">
					<AppSpinner variant={"wave"} size="lg" label="Generating your personal Podslice Hub..." />
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="main-layouts container mx-auto p-6">
				<PageHeader title="Your Dashboard" description="Overview of your episodes, selected bundles, feeds etc." level={1} spacing="default" />
				<Alert>
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error Loading Dashboard</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			</div>
		)
	}

	return (
		<div className="mx-auto px-0 pb-12 w-full pt-6 md:pt-4 md:px-0">
			{/* MAIN CONTAINER */}

			<PageHeader title="Your Dashboard" description="Overview of your episodes, selected bundles, feeds etc." level={1} spacing="default" />

			<Card variant="glass" className="flex flex-col pb-12 w-full px-4 gap-4 md:p-2">
				<div className="flex flex-col lg:flex-row gap-6">
					<div className="w-full  md:w-full">
						{userCurationProfile ? (
							<ProfileFeedCards userCurationProfile={userCurationProfile} showProfileCard={true} showBundleCard={true} />
						) : (
							<EmptyStateCard
								title="No Personalized Feed Found"
								message={{
									description: "It looks like you haven't created a Personalized Feed yet. Start by creating one!",
									notificationTitle: "No Personalized Feed Found",
									notificationDescription: "It looks like you haven't created a Personalized Feed yet. Start by creating one!",
									selectStateActionText: "Create Personalized Feed",
								}}
								selectStateAction={() => setIsCreateWizardOpen(true)}
							/>
						)}
					</div>

					<div className="w-full min-w-none max-w-screen md:min-w-[700px]">
						{combinedEpisodes.length === 0 ? (
							<EmptyStateCard
								title="No Episodes Found"
								message={{
									description: "It looks like you haven't created a Personalized Feed yet. Start by creating one!",
									notificationTitle: "No Episodes Found",
									notificationDescription: "It looks like you haven't created a Personalized Feed yet. Start by creating one!",
									selectStateActionText: "Create Personalized Feed",
								}}
							/>
						) : (
							<EpisodeList episodes={combinedEpisodes} onPlayEpisode={handlePlayEpisode} playingEpisodeId={playingEpisodeId} />
						)}
					</div>
				</div>
				{userCurationProfile && (
					<EditUserFeedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} collection={userCurationProfile as UserCurationProfileWithRelations} onSave={handleSaveUserCurationProfile} />
				)}

				<Dialog open={isCreateWizardOpen} onOpenChange={setIsCreateWizardOpen}>
					<DialogContent className="w-full overflow-y-auto px-8">
						<DialogHeader>
							<DialogTitle>
								<Typography variant="h3">Personalized Feed Builder</Typography>
							</DialogTitle>
						</DialogHeader>
						<UserFeedWizardWrapper
							onSuccess={async () => {
								setIsCreateWizardOpen(false)
								await refreshData()
							}}
						/>
					</DialogContent>
				</Dialog>
				{/* Portal audio player to global container */}
				{playingEpisodeId &&
					portalContainer &&
					createPortal(
						<div className="bg-background border-t border-border shadow-lg w-full h-20 px-2 md:px-4 flex items-center justify-center">
							<AudioPlayerWrapper playingEpisodeId={playingEpisodeId} episodes={combinedEpisodes} onClose={handleClosePlayer} />
						</div>,
						portalContainer
					)}
			</Card>
		</div>
	)
}

function UserFeedWizardWrapper({ onSuccess }: { onSuccess: () => void }) {
	// Use a local state to track if the profile was created
	const { userCurationProfile } = useUserCurationProfileStore()
	const [hasCreated, setHasCreated] = useState(false)

	useEffect(() => {
		if (userCurationProfile && !hasCreated) {
			setHasCreated(true)
			onSuccess()
		}
	}, [userCurationProfile, hasCreated, onSuccess])

	return <UserFeedSelector />
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
