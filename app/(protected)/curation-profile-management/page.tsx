"use client"

import { AlertCircle } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import EditUserFeedModal from "@/components/edit-user-feed-modal"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AppSpinner } from "@/components/ui/app-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Episode, Podcast, UserCurationProfile, UserCurationProfileWithRelations } from "@/lib/types"
// CSS module migrated to Tailwind classes

const formatDate = (date: Date | null | undefined) => {
	if (!date) return "N/A"
	return new Date(date).toLocaleString()
}

export default function CurationProfileManagementPage() {
	const [userCurationProfile, setUserCurationProfile] = useState<UserCurationProfileWithRelations | null>(null)
	const [_episodes, setEpisodes] = useState<Episode[]>([])
	const [bundleEpisodes, setBundleEpisodes] = useState<Episode[]>([])
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
		<>
			<div className="flex flex-col w-full gap-8 p-4">
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
					<div className="flex flex-col w-full gap-5">
						<Card>
							<div className="flex flex-row">
								<CardHeader className="w-full flex flex-row justify-between pb-6">
									<CardTitle className="w-full mb-8 mt-2">Current Personalized Feed</CardTitle>
								</CardHeader>
							</div>
							<CardContent className="w-full mb-0 flex justify-between">
								<div className="text-2xl w-full p-0 m-0 font-bold">{userCurationProfile?.name}</div>
								<Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
									Edit
								</Button>
							</CardContent>
						</Card>
						<div className="flex flex-col md:flex-row gap-4">
							{userCurationProfile?.is_bundle_selection && userCurationProfile?.selectedBundle && (
								<Card>
									<CardHeader>
										<div className="w-full flex flex-row gap-1">
											<CardTitle className="mb-1 w-full">Selected Bundle</CardTitle>
										</div>
									</CardHeader>
									<CardContent>
										<div className="text-2xl mb-1.5 font-bold">{userCurationProfile.selectedBundle.name}</div>
										<p className="text-xs mb-4 text-muted-foreground">{userCurationProfile.selectedBundle.description}</p>
										<div className="mt-2 text-sm">
											<p className="font-medium text-right">Podcasts:</p>
											<div className="list-disc pl-5 py-2 text-right text-xs text-muted-foreground">
												{userCurationProfile.selectedBundle.podcasts?.map((podcast: Podcast) => <p key={podcast.podcast_id}>{podcast.name}</p>) || (
													<li className="text-muted-foreground">No podcasts loaded</li>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							)}

							<Card>
								<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
									<CardTitle className="mb-0 mb-4 w-full">Personalized Activity</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-xs flex justify-between">
										<p>
											Created: <span className="text-xs opacity-[0.5]">{formatDate(userCurationProfile?.created_at)}</span>
										</p>
										{/* <p>
										Updated: <span className="text-xs opacity-[0.5]"> {formatDate(userCurationProfile?.updated_at)}</span>
									</p> */}
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium pb-2 mb-1">Weekly Episodes Summary</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex flex-col gap-2 text-sm">
										{/* <div className="flex justify-between">
										<span className="text-muted-foreground">Total Episodes:</span>
										<span className="font-medium">{episodes.length + bundleEpisodes.length}</span>
									</div> */}
										{/* <div className="flex justify-between">
										<span className="text-muted-foreground">User Episodes:</span>
										<span className="font-medium">{episodes.length}</span>
									</div> */}
										<div className="flex justify-start gap-2 items-center h-4">
											<span className="text-muted-foreground text-xs">Bundle Episode/s:</span>
											<span className="font-medium">{bundleEpisodes.length}</span>
										</div>
										{/* <div className="flex justify-between">
										<span className="text-muted-foreground">Profile Type:</span>
										<span className="font-medium">{userCurationProfile.is_bundle_selection ? "Bundle Selection" : "Custom Profile"}</span>
									</div> */}
									</div>
								</CardContent>
							</Card>
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
		</>
	)
}
