"use client"

import { AlertCircle } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import EditUserFeedModal from "@/components/edit-user-feed-modal"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AppSpinner } from "@/components/ui/app-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import type { Episode, Podcast, UserCurationProfile, UserCurationProfileWithRelations } from "@/lib/types"

// CSS module migrated to Tailwind classes

const _formatDate = (date: Date | null | undefined) => {
	if (!date) return "N/A"
	return new Date(date).toLocaleString()
}

export default function CurationProfileManagementPage() {
	const [userCurationProfile, setUserCurationProfile] = useState<UserCurationProfileWithRelations | null>(null)
	const [_episodes, setEpisodes] = useState<Episode[]>([])
	const [_bundleEpisodes, setBundleEpisodes] = useState<Episode[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const fetchAndUpdateData = useCallback(async () => {
		try {
			// Fetch user curation profile and episodes in parallel
			const [profileResponse, episodesResponse] = await Promise.all([fetch("/api/user-curation-profiles"), fetch("/api/episodes")])

			const fetchedProfile = profileResponse.ok ? await profileResponse.json() : null
			const fetchedEpisodes = episodesResponse.ok ? await episodesResponse.json() : []

			setUserCurationProfile(fetchedProfile)
			setEpisodes(fetchedEpisodes)

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
							<AppSpinner size="lg" label="Loading Personalized Feed..." />
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
										Update Personalized Feed
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
										<span className="text-foreground/80 text-xs">Member Since:</span>
										<span className="text-xs opacity-[0.5]">{_formatDate(userCurationProfile?.created_at)}</span>
									</div>
									<div className="flex flex-row justify-between gap-2 items-center h-5 w-full bg-muted-foreground/10 py-4 px-2">
										<span className="text-foreground/80 text-xs">Updated:</span>
										<span className="text-xs opacity-[0.5]">{_formatDate(userCurationProfile?.updated_at)}</span>
									</div>
								</div>
							</CardContent>
						</Card>

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
											<ul className="list-disc bg-card px-4 mt-2 py-2 text-muted-foreground rounded-lg">
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
		</Card>
	)
}
