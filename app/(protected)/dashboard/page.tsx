"use client"

import { AlertCircle, Play } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import EditUserFeedModal from "@/components/edit-user-feed-modal"
import UserFeedSelector from "@/components/features/user-feed-selector"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AppSpinner } from "@/components/ui/app-spinner"
import AudioPlayer from "@/components/ui/audio-player"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PageHeader } from "@/components/ui/page-header"
import { Body, BodySmall, H2, H3, Typography } from "@/components/ui/typography"
import type { Bundle, Episode, Podcast, UserCurationProfile } from "@/lib/types"
import { useUserCurationProfileStore } from "./../../../lib/stores/user-curation-profile-store"

// Type for UserCurationProfile with relations
type UserCurationProfileWithRelations = UserCurationProfile & {
	selectedBundle?: (Bundle & { podcasts: Podcast[]; episodes: Episode[] }) | null
	episode: Episode[]
}

// Combined episode type for display - extending Prisma Episode with display type
interface CombinedEpisode extends Episode {
	type: "user" | "bundle"
}

export default function Page() {
	const [userCurationProfile, setUserCurationProfile] = useState<UserCurationProfileWithRelations | null>(null)
	const [episodes, setEpisodes] = useState<Episode[]>([])
	const [bundleEpisodes, setBundleEpisodes] = useState<Episode[]>([])
	const [combinedEpisodes, setCombinedEpisodes] = useState<CombinedEpisode[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [playingEpisodeId, setPlayingEpisodeId] = useState<string | null>(null)
	const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false)

	const fetchAndUpdateData = useCallback(async () => {
		try {
			// Fetch user curation profile and episodes in parallel
			const [profileResponse, episodesResponse] = await Promise.all([fetch("/api/user-curation-profiles"), fetch("/api/episodes")])

			const fetchedProfile = profileResponse.ok ? await profileResponse.json() : null
			const fetchedEpisodes = episodesResponse.ok ? await episodesResponse.json() : []

			setUserCurationProfile(fetchedProfile)

			// Convert unified episodes to display format with type detection
			const combined: CombinedEpisode[] = fetchedEpisodes.map((ep: Episode) => ({
				...ep,
				type: ep.bundle_id ? "bundle" : ("user" as const), // Determine type based on presence of bundle
			}))

			// Sort by published date (newest first)
			combined.sort((a, b) => {
				const dateA = a.published_at ? new Date(a.published_at).getTime() : 0
				const dateB = b.published_at ? new Date(b.published_at).getTime() : 0
				return dateB - dateA
			})

			setCombinedEpisodes(combined)
			setEpisodes(fetchedEpisodes.filter((ep: Episode) => !ep.bundle_id)) // User episodes only
			setBundleEpisodes(fetchedEpisodes.filter((ep: Episode) => ep.bundle_id)) // Bundle episodes only
		} catch (error) {
			console.error("Failed to fetch data:", error)
		}
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

			// Refetch data after successful update to show new bundle selection
			await fetchAndUpdateData()

			toast.success("Personalized Feed updated successfully!")
			setIsModalOpen(false)
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error)
			toast.error(`Failed to update Personalized Feed: ${message}`)
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
			<div className="min-h-screen flex items-center justify-center p-6">
				<div className="flex flex-col items-center justify-center min-h-[400px]">
					<AppSpinner size="lg" label="Loading dashboard..." />
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto p-6 max-w-7xl">
			<PageHeader title="Your Dashboard" description="Overview of your episodes, selected bundles, feeds etc." level={1} spacing="default" />

			<div className="flex flex-col gap-4 md:gap-6 md:flex-row-reverse">
				<div className="w-full md:w-2/5 md:min-w-[400px]">
					{userCurationProfile ? (
						<div className="flex flex-col gap-8 p-0 md:w-[90%]">
							<div className="space-y-8">
								{/* Profile Card - using default variant */}
								<Card variant="default" className="mb-4">
									<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
										<CardTitle className="text-xl font-semibold tracking-tight mt-2 mb-2">Current Personalized Feed</CardTitle>
									</CardHeader>
									<CardContent>
										<H3 className="mt-6 text-xl font-semibold tracking-tight">{userCurationProfile?.name}</H3>
										<BodySmall className="mt-2 mb-4">Status: {userCurationProfile?.status}</BodySmall>
									</CardContent>
								</Card>

								{/* Bundle Card - using bundle variant for better visual distinction */}
								{userCurationProfile?.is_bundle_selection && userCurationProfile?.selectedBundle && (
									<Card variant="bundle">
										<CardHeader className="flex w-full flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-xl font-semibold tracking-tight mt-2 mb-2">
												<Typography variant="h3">Selected Bundle</Typography>
											</CardTitle>
										</CardHeader>
										<CardContent>
											<H3 className="w-full mt-6 text-xl font-semibold tracking-tight">{userCurationProfile.selectedBundle.name}</H3>
											<BodySmall className="mt-2 mb-4">{userCurationProfile.selectedBundle.description}</BodySmall>

											{userCurationProfile.selectedBundle.podcasts && userCurationProfile.selectedBundle.podcasts.length > 0 && (
												<div>
													<Body className="text-xl font-semibold tracking-tight mt-2 mb-2">Podcasts:</Body>
													<ul className="list-disc pl-5 text-muted-foreground">
														{userCurationProfile.selectedBundle.podcasts?.map((podcast: Podcast) => (
															<li className="text-base leading-6 font-normal tracking-[0.025em] mt-2 mb-4 text-muted-foreground" key={podcast.podcast_id}>
																{podcast.name}
															</li>
														)) || <li className="text-base leading-6 font-normal tracking-[0.025em] mt-2 mb-4 text-muted-foreground">No podcasts loaded</li>}
													</ul>
												</div>
											)}

											{userCurationProfile.selectedBundle.episodes && userCurationProfile.selectedBundle.episodes.length > 0 && (
												<div>
													<Body className="text-xl font-semibold tracking-tight mt-2 mb-2">Bundle Episodes:</Body>
													<ul className="list-disc pl-5 text-muted-foreground">
														{userCurationProfile.selectedBundle.episodes.map(episode => (
															<li className="text-base leading-6 font-normal tracking-[0.025em] mt-2 mb-4 text-muted-foreground" key={episode.episode_id}>
																{episode.title} - {episode.published_at ? new Date(episode.published_at).toLocaleDateString() : "N/A"}
															</li>
														))}
													</ul>
												</div>
											)}
										</CardContent>
									</Card>
								)}
							</div>
						</div>
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
										<Button onClick={() => setIsCreateWizardOpen(true)}>Create Personalized Feed</Button>
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
								<H2 className="text-2xl font-semibold tracking-tight">Weekly Episode</H2>
								<div className="flex gap-4 text-base leading-6 font-normal tracking-[0.025em] text-muted-foreground">
									<span>Total: {combinedEpisodes.length}</span>
									<span>Custom: {episodes.length}</span>
									<span>Bundle: {bundleEpisodes.length}</span>
								</div>
							</div>

							<div className="flex flex-col gap-4">
								{/* Episode Cards - using episode variant with hover effects */}
								{combinedEpisodes.map(episode => (
									<Card key={episode.episode_id} variant="episode" className="transition-all duration-200 hover:shadow-lg">
										<CardContent>
											<div className="flex flex-col gap-4">
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-2">
														<H3>{episode.title}</H3>
														<span
															className={`px-2 py-1 rounded text-sm font-medium ${episode.type === "bundle" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"}`}
														>
															{episode.type === "bundle" ? "Bundle" : "Custom"}
														</span>
													</div>
													<div className="mb-2">
														<Button onClick={() => handlePlayEpisode(episode.episode_id)} variant="outline" size="sm">
															<Play className="w-4 h-4" />
															Play Episode
														</Button>
													</div>
													{episode.description && <Body>{episode.description}</Body>}
													<BodySmall>Published: {episode.published_at ? new Date(episode.published_at).toLocaleDateString() : "N/A"}</BodySmall>
												</div>
												{episode.audio_url && playingEpisodeId === episode.episode_id && (
													<div className="w-full max-w-full">
														<AudioPlayer episode={episode} onClose={handleClosePlayer} />
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
							await fetchAndUpdateData()
						}}
					/>
				</DialogContent>
			</Dialog>
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
