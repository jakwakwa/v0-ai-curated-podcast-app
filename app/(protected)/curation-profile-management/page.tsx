"use client"

import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
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

			toast.success("Personalized Feed updated successfully!")
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
					<h1 className="text-2xl font-bold">Personalized Feed Management</h1>
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
							<CardHeader className="w-full flex flex-col justify-between pb-2 mb-4">
								<div className="flex flex-col gap-4 justify-between w-full">
									<div className="flex flex-col">
										<CardTitle className="w-full my-2">Your Feed Profile</CardTitle>

										<Typography as="h4" className="w-full text-accent-foreground p-0 m-0">
											{userCurationProfile?.name}
										</Typography>
									</div>
									<Button className="mt-2" variant="default" size="sm" onClick={() => setIsModalOpen(true)}>
										Update Personalized Bundle Feed
									</Button>

									<Button className="mt-2" variant="default" size="sm" asChild>
										<Link href="/generate-my-episodes">Generate Episodes</Link>
									</Button>
								</div>
							</CardHeader>

							<CardContent className="my-6 h-auto">
								<Typography as="h5">Personalized Feed Summary</Typography>

								<div className="flex flex-col justify-start gap-2 items-start my-4 py-1 px-1 w-full bg-glass border-b-dark border rounded-md overflow-hidden">
									<div className="flex flex-row justify-between gap-2 items-center h-5 w-full text-primary bg-muted-foreground/10 py-4 px-2">
										<span className="text-foreground/80 text-xs">Bundle Episode/s:</span>
										<span className="font-medium">{userCurationProfile?.selectedBundle?.episodes?.length || 0}</span>
									</div>
									<div className="flex flex-row justify-between gap-2 items-center h-5 w-full py-3 px-2">
										<span className="text-foreground/80 text-xs">User Episode/s:</span>
										<span className="font-medium">{_episodes.length || 0}</span>
									</div>
									<div className="flex flex-row justify-between gap-2 items-center h-5 w-full bg-muted-foreground/10 py-4 px-2">
										<span className="text-foreground/80 text-xs">Total Episode/s:</span>
										<span className="font-medium">{_episodes.length || 0 + (userCurationProfile?.selectedBundle?.episodes?.length || 0)}</span>
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
							</CardContent>
						</Card>

						<CardContent>
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
														<Button size="sm" variant="default" onClick={() => setCurrentlyPlayingUserEpisodeId(episode.episode_id)}>
															Play
														</Button>
													}
												/>
											</li>
										))}
								</ul>
							)}
						</CardContent>

						<div className="grid grid-cols-1 md:grid-cols-1 gap-4 lg:gap-5 lg:col-span-1 h-full">
							{userCurationProfile?.is_bundle_selection && userCurationProfile?.selectedBundle && (
								<Card className="lg:col-span-1">
									<CardHeader>
										<CardTitle className="mb w-full">
											Bundle: <span className=" text-md uppercase text-accent-foreground font-bold">{userCurationProfile.selectedBundle.name}</span>
										</CardTitle>

										<CardDescription className="text-xs text-muted-foreground">{userCurationProfile.selectedBundle.description}</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="mt-2">
											<Typography as="h5" className="font-medium">
												Podcasts linked with this bundle:
											</Typography>
											<ul className="list-disc bg-card content px-4 mt-2 py-2 text-muted-foreground rounded-lg">
												{userCurationProfile.selectedBundle.podcasts?.map((podcast: Podcast) => (
													<li key={podcast.podcast_id} className="ml-4">
														{podcast.name}
													</li>
												)) || <li>No podcasts loaded</li>}
											</ul>
										</div>
									</CardContent>
								</Card>
							)}
						</div>
					</div>
				) : (
					<div className="max-w-2xl mx-auto mt-8">
						<Alert>
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>No Personalized Feed Found</AlertTitle>
							<AlertDescription className="mt-2">You haven't created a Personalized Feed yet. Create one to start managing your podcast curation.</AlertDescription>
						</Alert>
					</div>
				)}
			</div>

			{userCurationProfile && <EditUserFeedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} collection={userCurationProfile} onSave={handleSaveUserCurationProfile} />}

			{currentlyPlayingUserEpisodeId && <UserAudioPlayerWrapper playingEpisodeId={currentlyPlayingUserEpisodeId} episodes={userEpisodes} onClose={() => setCurrentlyPlayingUserEpisodeId(null)} />}
		</Card>
	)
}

export function UserAudioPlayerWrapper({ playingEpisodeId, episodes, onClose }: { playingEpisodeId: string; episodes: (UserEpisode & { signedAudioUrl: string | null })[]; onClose: () => void }) {
	// Force fresh lookup of episode and require a signed URL for playback
	const episode = episodes.find(ep => ep.episode_id === playingEpisodeId)
	if (!(episode && episode.signedAudioUrl)) {
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
