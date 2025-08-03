"use client"

import { AlertCircle } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { toast } from "sonner"
import EditUserFeedModal from "@/components/edit-user-feed-modal"
import { EpisodeList } from "@/components/episode-list"
import { ProfileFeedCards } from "@/components/features/profile-feed-cards"
import UserFeedSelector from "@/components/features/user-feed-selector"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AppSpinner } from "@/components/ui/app-spinner"
import AudioPlayer from "@/components/ui/audio-player"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PageHeader } from "@/components/ui/page-header"
import { H2, Typography } from "@/components/ui/typography"
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
	const { episodes, bundleEpisodes, combinedEpisodes, userCurationProfile, isLoading, isFromCache, error, fetchEpisodes, fetchUserCurationProfile, refreshData, clearError } = useEpisodesStore()

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

	const handleRefreshData = async () => {
		await refreshData()
	}

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center p-6">
				<div className="flex flex-col items-center justify-center min-h-[400px]">
					<AppSpinner size="lg" label="Loading dashboard..." />
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="container mx-auto p-6 max-w-7xl">
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
		<div className="container mx-auto p-6 max-w-7xl">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-4">
					<PageHeader title="Your Dashboard" description="Overview of your episodes, selected bundles, feeds etc." level={1} spacing="default" />
					{isFromCache && (
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg>
							Cached data
						</div>
					)}
				</div>
				<Button variant="outline" size="sm" onClick={handleRefreshData} disabled={isLoading} className="flex items-center gap-2">
					{isLoading ? (
						<AppSpinner size="sm" />
					) : (
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
					)}
					Refresh
				</Button>
			</div>

			<div className="flex flex-col gap-4 md:gap-6 md:flex-row-reverse">
				<div className="w-full md:w-2/5 md:min-w-[400px]">
					{userCurationProfile ? (
						<ProfileFeedCards userCurationProfile={userCurationProfile} showProfileCard={true} showBundleCard={true} />
					) : (
						<div className="w-full max-w-2xl md:max-w-full">
							{/* Empty State Card - using glass variant for better visual appeal */}
							<Card variant="glass">
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-xl font-semibold tracking-tight mt-2 mb-2">Current Personalized Feed</CardTitle>
								</CardHeader>
								<CardContent>
									<Alert>
										<AlertCircle className="h-4 w-4" />
										<AlertTitle>No Personalized Feed Found</AlertTitle>
										<AlertDescription className="text-base leading-6 font-normal tracking-[0.025em] mt-2 mb-4 text-muted-foreground">
											It looks like you haven't created a Personalized Feed yet. Start by creating one!
										</AlertDescription>
									</Alert>
									<div className="mt-6 text-center">
										<Button variant="default" onClick={() => setIsCreateWizardOpen(true)}>
											Create Personalized Feed
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>
					)}
				</div>

				<div className="w-full">
					{combinedEpisodes.length === 0 ? (
						<Card variant="glass">
							<CardHeader>
								<CardTitle>Weekly Episodes</CardTitle>
							</CardHeader>
							<CardContent>
								<Alert>
									<AlertCircle className="h-4 w-4" />
									<AlertTitle>No Episodes Available</AlertTitle>
									<AlertDescription className="text-base leading-6 font-normal tracking-[0.025em] mt-2 mb-4 text-muted-foreground">
										{userCurationProfile
											? "Your profile hasn't generated any episodes yet. Episodes are created weekly."
											: "Create a Personalized Feed or select a bundle to start seeing episodes here."}
									</AlertDescription>
								</Alert>
							</CardContent>
						</Card>
					) : (
						<div className="space-y-6">
							<div className="flex items-center justify-between mb-6">
								<H2 className="text-2xl font-semibold tracking-tight">Weekly Episodes</H2>
								<div className="flex gap-4 text-base leading-6 font-normal tracking-[0.025em] text-muted-foreground">
									<span>Total: {combinedEpisodes.length}</span>
									<span>Custom: {episodes.length}</span>
									<span>Bundle: {bundleEpisodes.length}</span>
								</div>
							</div>

							{/* Use the migrated EpisodeList component with proper props */}
							<EpisodeList episodes={combinedEpisodes} onPlayEpisode={handlePlayEpisode} playingEpisodeId={playingEpisodeId} />

							{/* Spacer for fixed audio player */}
							{playingEpisodeId && <div className="h-24" />}
						</div>
					)}
				</div>
			</div>

			{userCurationProfile && (
				<EditUserFeedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} collection={userCurationProfile as UserCurationProfileWithRelations} onSave={handleSaveUserCurationProfile} />
			)}

			<Dialog open={isCreateWizardOpen} onOpenChange={setIsCreateWizardOpen}>
				<DialogContent className="w-full md:max-w-2/3 overflow-y-auto px-8">
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
					<div className="bg-background border-t border-border shadow-lg w-full h-20 px-1.5 md:px-12 flex items-center justify-center">
						<AudioPlayerWrapper playingEpisodeId={playingEpisodeId} episodes={combinedEpisodes} onClose={handleClosePlayer} />
					</div>,
					portalContainer
				)}
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
