"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { EditUserCurationProfileModal } from "@/components/edit-user-curation-profile-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getEpisodes, getUserCurationProfile } from "@/lib/data"
import type { CuratedBundleEpisode, CuratedPodcast, Episode, UserCurationProfile, UserCurationProfileWithRelations } from "@/lib/types"

const formatDate = (date: Date | null | undefined) => {
	if (!date) return "N/A"
	return new Date(date).toLocaleString()
}

export default function CurationProfileManagementPage() {
	const [userCurationProfile, setUserCurationProfile] = useState<UserCurationProfileWithRelations | null>(null)
	const [episodes, setEpisodes] = useState<Episode[]>([])
	const [bundleEpisodes, setBundleEpisodes] = useState<CuratedBundleEpisode[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const fetchAndUpdateData = useCallback(async () => {
		// Fetch user curation profile and episodes in parallel
		const [fetchedProfile, fetchedEpisodes] = await Promise.all([getUserCurationProfile(), getEpisodes()])

		setUserCurationProfile(fetchedProfile)
		setEpisodes(fetchedEpisodes)

		// Get bundle episodes if user has a bundle selection
		let bundleEpisodesList: CuratedBundleEpisode[] = []
		if (fetchedProfile?.isBundleSelection && fetchedProfile?.selectedBundle?.episodes) {
			bundleEpisodesList = fetchedProfile.selectedBundle.episodes
		}

		setBundleEpisodes(bundleEpisodesList)
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

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
					<p>Loading user curation profile...</p>
				</div>
			</div>
		)
	}

	return (
		<>
			<div className="flex flex-col gap-6 p-4">
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-2xl font-bold">Curation Profile Management</h1>
				</div>

				{userCurationProfile ? (
					<div className="grid gap-4 md:grid-cols-2">
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

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">User Curation Profile History</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-sm">
									<p>Created At: {formatDate(userCurationProfile?.createdAt)}</p>
									<p>Updated At: {formatDate(userCurationProfile?.updatedAt)}</p>
									<p>Generated At: {formatDate(userCurationProfile?.generatedAt)}</p>
									<p>Last Generation: {formatDate(userCurationProfile?.lastGenerationDate)}</p>
									<p>Next Generation: {formatDate(userCurationProfile?.nextGenerationDate)}</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Weekly Episodes Summary</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex flex-col gap-2 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Total Episodes:</span>
										<span className="font-medium">{episodes.length + bundleEpisodes.length}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">User Episodes:</span>
										<span className="font-medium">{episodes.length}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Bundle Episodes:</span>
										<span className="font-medium">{bundleEpisodes.length}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Profile Type:</span>
										<span className="font-medium">{userCurationProfile.isBundleSelection ? "Bundle Selection" : "Custom Profile"}</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				) : (
					<div className="text-center py-12">
						<h3 className="text-lg font-semibold mb-2">No User Curation Profile Found</h3>
						<p className="text-muted-foreground">You haven't created a user curation profile yet. Create one to start managing your podcast curation.</p>
					</div>
				)}
			</div>

			{userCurationProfile && (
				<EditUserCurationProfileModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					collection={userCurationProfile as UserCurationProfileWithRelations}
					onSave={handleSaveUserCurationProfile}
				/>
			)}
		</>
	)
}
