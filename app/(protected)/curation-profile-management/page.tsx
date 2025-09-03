"use client"

import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { toast } from "sonner"
import EditUserFeedModal from "@/components/edit-user-feed-modal"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AppSpinner } from "@/components/ui/app-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import EpisodeCard from "@/components/ui/episode-card"
import { PageHeader } from "@/components/ui/page-header"
import { Typography } from "@/components/ui/typography"
import UserEpisodeAudioPlayer from "@/components/ui/user-episode-audio-player"
import type { Episode, UserCurationProfile, UserCurationProfileWithRelations, UserEpisode } from "@/lib/types"

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
		<div className="default-card mx-auto px-0 pb-12 w-full pt-6 md:pt-4 md:px-0">
			<PageHeader title="Curator Profile" description="Listen to all your curated podcast episodes from your personal feed and selected bundles." />
			{isLoading ? (
				<div className="p-8 max-w-[1200px] mx-auto">
					<div className="flex items-center justify-center min-h-[400px]">
						<AppSpinner variant="wave" size="lg" label="Loading Personalized Feed..." />
					</div>
				</div>
			) : userCurationProfile ? (
				<div className=" mx-auto px-0 pb-12 pt-6 md:pt-4 md:px-0 lg:flex">
					<div className="grid grid-cols-1  md:grid-cols-7 gap-2">
						<Card className="episode-card col-span-3 border-dark border-b-dark">
							<div className="w-full flex flex-col justify-between pb-0 mb-6">
								<CardTitle className=" my-4 max-w-[70&[">Current Weekly Feed Profile</CardTitle>
								<CardDescription className="m-0 opacity-90">
									Track, change and modify your weekly bundled feeds. If you're a "Curate and Control" member. Generate a total of 30 podcast episode summaries per month from virtually any youtube
									channel.
								</CardDescription>
								<Button className="mb-4 max-w-[50%]" variant="default" size="sm" onClick={() => setIsModalOpen(true)}>
									Update Feed
								</Button>
							</div>

							{userCurationProfile?.is_bundle_selection && userCurationProfile?.selectedBundle && (
								<Card variant="bundle" className="mb-6">
									<div className="py-4 px-1">
										<Typography as="h2" className="text-custom-h2 w-full text-foreground p-0 m-0 my-4">
											<span className=" text-md text-foreground font-medium my-2">{userCurationProfile?.name}</span>
										</Typography>
										{/* <Typography className="text-xs text-muted-foreground mb-6"> Custom Description: {userCurationProfile.selectedBundle.description}</Typography> */}

										<div className="bg-card-plain px-0 py-3 border-dark rounded">
											<Typography className="text-sm font-bold uppercase text-secondary-foreground">{userCurationProfile.selectedBundle.name}</Typography>


										</div>
									</div>
								</Card>
							)}

							<Card variant="bundle">
								<div className="px-1 p-4">
									<Typography className="pt-4 font-medium" as="h5">
										Weekly Bundled Feed Summary
									</Typography>
									<div className="flex flex-col justify-start gap-2 items-start my-4 py-1 px-1 w-full bg-glass border-b-dark border rounded-md overflow-hidden px-1 pb-6 pt-4">
										<div className="flex flex-row justify-between gap-2 items-center h-5 w-full text-primary bg-muted-foreground/10 py-4 px-1">
											<span className="text-foreground/80 text-xs">Bundle Episode/s:</span>
											<span className="text-xs opacity-[0.5]">{userCurationProfile?.selectedBundle?.episodes?.length || 0}</span>
										</div>

										<div className="flex flex-row justify-between gap-2 items-center h-5 w-full py-3 px-1">
											<span className="text-foreground/80 text-xs">Plan Tier:</span>
											<span className="text-xs opacity-[0.5]">{subscription?.plan_type?.replace(/_/g, " ") || "No Active Subscription"}</span>
										</div>
									</div>
								</div>
							</Card>
						</Card>
						<Card className="episode-card-wrapper col-span-4  px-12 border-dark border-b-dark" style={{ padding: "20rem !important" }}>
							<CardTitle className="w-full my-4">Your recently generated episodes</CardTitle>
							<CardDescription className="opacity-90">View and manage your recently generated episodes.</CardDescription>
							{(subscription?.plan_type || "").toLowerCase() === "curate_control" && (
								<Link href="/my-episodes" passHref>
									<Button variant="default" size="sm" className="mt-4">
										My Episodes
									</Button>
								</Link>
							)}
							<Link href="/generate-my-episodes" passHref>
								<Button variant="default" size="sm" className="mt-4 mb-6">
									Episode Creator
								</Button>
							</Link>

							<CardContent className="w-full mt-4 px-0">
								{userEpisodes.length === 0 ? (
									<p className="text-muted-foreground text-sm">No generated episodes yet.</p>
								) : (
									<ul className=" inline-block w-full inline-flex flex-col gap-3">
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
														actions={<Button size="play" variant="play" onClick={() => setCurrentlyPlayingUserEpisodeId(episode.episode_id)} />}
													/>
												</li>
											))}
									</ul>
								)}
							</CardContent>
						</Card>
					</div>
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


			{userCurationProfile && <EditUserFeedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} collection={userCurationProfile} onSave={handleSaveUserCurationProfile} />}

			{currentlyPlayingUserEpisodeId &&
				portalContainer &&
				createPortal(
					<div className="bg-background border-t border-border shadow-lg w-full h-20 px-2 md:px-4 flex items-center justify-center">
						<UserAudioPlayerWrapper playingEpisodeId={currentlyPlayingUserEpisodeId} episodes={userEpisodes} onClose={() => setCurrentlyPlayingUserEpisodeId(null)} />
					</div>,
					portalContainer
				)}
		</div>
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
