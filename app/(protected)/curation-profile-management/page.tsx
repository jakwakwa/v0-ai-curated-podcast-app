"use client"

import { AlertCircle } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { toast } from "sonner"
import EditUserFeedModal from "@/components/edit-user-feed-modal"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AppSpinner } from "@/components/ui/app-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import EpisodeCard from "@/components/ui/episode-card"
import { Typography } from "@/components/ui/typography"
import UserEpisodeAudioPlayer from "@/components/ui/user-episode-audio-player"
import type { Episode, Podcast, UserCurationProfile, UserCurationProfileWithRelations, UserEpisode } from "@/lib/types"

interface SubscriptionInfo {
	plan_type: string
	status: string
}

// CSS module migrated to Tailwind classes

const _formatDate = (date: Date | null | undefined) => {
	if (!date) return "N/A"
	return new Date(date).toLocaleString()
}

export default function CurationProfileManagementPage() {
	const [userCurationProfile, setUserCurationProfile] = useState<UserCurationProfileWithRelations | null>(null)
	const [_episodes, setEpisodes] = useState<Episode[]>([])
	const [_bundleEpisodes, setBundleEpisodes] = useState<Episode[]>([])
	const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isModalOpen, setIsModalOpen] = useState(false)

	type UserEpisodeWithSignedUrl = UserEpisode & { signedAudioUrl: string | null }
	const [userEpisodes, setUserEpisodes] = useState<UserEpisodeWithSignedUrl[]>([])
	const [currentlyPlayingUserEpisodeId, setCurrentlyPlayingUserEpisodeId] = useState<string | null>(null)
	const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

	// Find the portal container on mount
	useEffect(() => {
		const container = document.getElementById("global-audio-player")
		setPortalContainer(container)
	}, [])

	const fetchAndUpdateData = useCallback(async () => {
		try {
			// Fetch user curation profile, catalog episodes, user episodes and subscription in parallel
			const [profileResponse, episodesResponse, userEpisodesResponse, subscriptionResponse] = await Promise.all([
				fetch("/api/user-curation-profiles"),
				fetch("/api/episodes"),
				fetch("/api/user-episodes/list"),
				fetch("/api/account/subscription"),
			])

			const fetchedProfile = profileResponse.ok ? await profileResponse.json() : null
			const fetchedEpisodes = episodesResponse.ok ? await episodesResponse.json() : []
			const fetchedUserEpisodes: UserEpisodeWithSignedUrl[] = userEpisodesResponse.ok ? await userEpisodesResponse.json() : []
			const fetchedSubscription = subscriptionResponse.ok ? await subscriptionResponse.json() : null

			setUserCurationProfile(fetchedProfile)
			setEpisodes(fetchedEpisodes)
			setUserEpisodes(fetchedUserEpisodes)
			console.log(fetchedSubscription)
			setSubscription(fetchedSubscription)

			// Get bundle episodes if user has a bundle selection
			let bundleEpisodesList: Episode[] = []
			if (fetchedProfile?.is_bundle_selection && fetchedProfile?.selectedBundle?.episodes) {
				bundleEpisodesList = fetchedProfile.selectedBundle.episodes
			}

			setBundleEpisodes(bundleEpisodesList)
		} catch (error) {
			console.error("Failed to fetch data:", error)
		}
	}, [])

	// biome-ignore lint/correctness/useExhaustiveDependencies: <temp fix>
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true)
				await fetchAndUpdateData()
			} catch (error: unknown) {
				const message = error instanceof Error ? error.message : String(error)
				toast.error(`Failed to load profile data: ${message}`)
			} finally {
				setIsLoading(false)
			}
		}

		fetchData()
		console.log(subscription)
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

			toast.success("Weekly Bundled Feed updated successfully!")
			setIsModalOpen(false)
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error)
			toast.error(`Failed to update Personalized Feed: ${message}`)
		}
	}

	return (
		<Card variant="glass" className="w-full lg:w-full lg:min-w-screen/[60%] lg:max-w-[1200px] h-auto mb-0 mt-4 px-12">
			<div className="grid grid-cols-1 lg:grid-cols-1 w-full lg:min-w-full/[60%] gap-8 px-4 py-5">
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-2xl font-bold">Your Personal Episode Management</h1>
				</div>

				{isLoading ? (
					<div className="p-8 max-w-[1200px] mx-auto">
						<div className="flex items-center justify-center min-h-[400px]">
							<AppSpinner variant="wave" size="lg" label="Loading Personalized Feed..." />
						</div>
					</div>
				) : userCurationProfile ? (
					<div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-4">
						<Card className="lg:col-span-1 flex flex-col w-full gap-8">
							<CardHeader className="w-full flex flex-col justify-between pb-0 mb-1">
								<div className="flex flex-col justify-between w-full">

									<CardTitle className="w-full my-2">Current Weekly Feed Profile</CardTitle>
									<CardDescription>
										Track, change and modify your weekly bundled feeds. If you're a "Curate and Control" member. Generate a total of 30 podcast episode summaries per month from virtually any youtube channel.
									</CardDescription>


								</div>
							</CardHeader>




							{userCurationProfile?.is_bundle_selection && userCurationProfile?.selectedBundle && (
								<Card variant="default" className="py-4 px-8">
									<Typography as="h4" className="w-full text-foreground p-0 m-0"><span className=" text-md uppercase text-foreground font-bold my-2">
										{userCurationProfile?.name}</span>
									</Typography>
									<Typography className="text-xs text-muted-foreground mb-6"> Custom Description: {userCurationProfile.selectedBundle.description}</Typography>
									<Button className="mb-4" variant="default" size="sm" onClick={() => setIsModalOpen(true)}>
										Update Weekly Feed (Bundle)
									</Button>
									<div className="bg-card-plain px-2 py-3 border-dark rounded">
										<Typography className="text-md font-bold uppercase text-secondary-foreground">
											{userCurationProfile.selectedBundle.name}
										</Typography>

										<div className="mt-2">
											<Typography as="p" className="font-normal italic text-sm">
												Podcast Shows incl.
											</Typography>
											<ul className="list-disc content px-4 mt-2 py-0 text-muted-foreground rounded-lg">
												{userCurationProfile.selectedBundle.podcasts?.map((podcast: Podcast) => (
													<li key={podcast.podcast_id} className="ml-4 text-body font-medium">
														{podcast.name}
													</li>
												)) || <li>No podcasts loaded</li>}
											</ul>
										</div>
									</div>


								</Card>
							)}

							<Card variant="default" className="py-4 px-8">
								<Typography as="h5">Weekly Bundled Feed Summary</Typography>
								<div className="flex flex-col justify-start gap-2 items-start my-4 py-1 px-1 w-full bg-glass border-b-dark border rounded-md overflow-hidden">
									<div className="flex flex-row justify-between gap-2 items-center h-5 w-full text-primary bg-muted-foreground/10 py-4 px-2">
										<span className="text-foreground/80 text-xs">Bundle Episode/s:</span>
										<span className="font-medium">{userCurationProfile?.selectedBundle?.episodes?.length || 0}</span>
									</div>


									<div className="flex flex-row justify-between gap-2 items-center h-5 w-full py-3 px-2">
										<span className="text-foreground/80 text-xs">Plan Tier:</span>
										<span className="font-medium capitalize">{subscription?.plan_type?.replace(/_/g, " ") || "No Active Subscription"}</span>
									</div>
									<div className="flex flex-row justify-between gap-2 items-center h-5 w-full bg-muted-foreground/10 py-4 px-2">
										<span className="text-foreground/80 text-xs">Member Since:</span>
										<span className="text-xs opacity-[0.5]">{_formatDate(userCurationProfile?.created_at)}</span>
									</div>
									<div className="flex flex-row justify-between gap-2 items-center h-5 w-full py-3 px-2">
										<span className="text-foreground/80 text-xs">Updated:</span>
										<span className="text-xs opacity-[0.5]">{_formatDate(userCurationProfile?.updated_at)}</span>
									</div>
								</div>


							</Card>
						</Card>
						<Card variant="default" className="py-4 px-6 border-dark border-b-dark">


							<CardTitle className="w-full my-2">Your recently generated episodes</CardTitle>
							<CardDescription>
								View and manage your recently generated episodes.
							</CardDescription>




							<CardContent className="w-full mt-4 px-0">
								{userEpisodes.length === 0 ? (
									<p className="text-muted-foreground text-sm">No generated episodes yet.</p>
								) : (
									<ul className="inline-block w-full inline-flex flex-col gap-3">
										{userEpisodes
											.filter(e => e.status === "COMPLETED" && !!e.signedAudioUrl)
											.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
											.slice(0, 3)
											.map(episode => (
												<li key={episode.episode_id} className="list-none">
													<EpisodeCard
														imageUrl={null}
														title={episode.episode_title}
														description={episode.summary}
														publishedAt={episode.updated_at}
														actions={
															<Button size="play" variant="play" onClick={() => setCurrentlyPlayingUserEpisodeId(episode.episode_id)} />
														}
													/>
												</li>
											))}
									</ul>
								)}
							</CardContent>
						</Card>
					</div>
				) : (
					<div className="max-w-2xl mx-auto mt-8">
						<Alert>
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>No Weekly Bundled Feed Found</AlertTitle>
							<AlertDescription className="mt-2">You haven't created a Weekly Bundled Feed yet. Create one to start managing your podcast curation.</AlertDescription>
						</Alert>
					</div>
				)}
			</div>

			{userCurationProfile && <EditUserFeedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} collection={userCurationProfile} onSave={handleSaveUserCurationProfile} />}

			{currentlyPlayingUserEpisodeId &&
				portalContainer &&
				createPortal(
					<div className="bg-background border-t border-border shadow-lg w-full h-20 px-2 md:px-4 flex items-center justify-center">
						<UserAudioPlayerWrapper playingEpisodeId={currentlyPlayingUserEpisodeId} episodes={userEpisodes} onClose={() => setCurrentlyPlayingUserEpisodeId(null)} />
					</div>,
					portalContainer
				)}
		</Card>
	)
}

export function UserAudioPlayerWrapper({ playingEpisodeId, episodes, onClose }: { playingEpisodeId: string; episodes: (UserEpisode & { signedAudioUrl: string | null })[]; onClose: () => void }) {
	// Force fresh lookup of episode and require a signed URL for playback
	const episode = episodes.find(ep => ep.episode_id === playingEpisodeId)
	if (!episode?.signedAudioUrl) {
		return null
	}

	const normalizedEpisode: UserEpisode = {
		episode_id: episode.episode_id,
		episode_title: episode.episode_title,
		gcs_audio_url: episode.signedAudioUrl,
		summary: episode.summary,
		created_at: episode.created_at,
		updated_at: episode.updated_at,
		user_id: episode.user_id,
		youtube_url: episode.youtube_url,
		transcript: episode.transcript,
		status: episode.status,
	}

	return <UserEpisodeAudioPlayer episode={normalizedEpisode} onClose={onClose} />
}
