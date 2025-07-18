"use client"
// DASHBOARD TEMPLATE. CURRENTLY NOT USED IN THE APP
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { CurationDashboard } from "@/components/curation-dashboard"
import { EditUserCurationProfileModal } from "@/components/edit-user-curation-profile-modal"
import { EpisodeList } from "@/components/episode-list"
import { SectionCards } from "@/components/section-cards"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getEpisodes, getUserCurationProfile } from "@/lib/data"
import type { CuratedPodcast, Episode, UserCurationProfile, UserCurationProfileWithRelations } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const formatDate = (date: Date | null | undefined) => {
	if (!date) return "N/A"
	return new Date(date).toLocaleString()
}

export default function Page() {
	const [userCurationProfiles, setUserCurationProfiles] = useState<UserCurationProfileWithRelations[]>([])
	const [episodes, setEpisodes] = useState<Episode[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const router = useRouter()

	const userCurationProfile = userCurationProfiles[0] // Assuming one user curation profile per user

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true)
				const [fetchedProfiles, fetchedEpisodes] = await Promise.all([getUserCurationProfile(), getEpisodes()])
				setUserCurationProfiles(fetchedProfiles)
				setEpisodes(fetchedEpisodes)
			} catch (error: unknown) {
				const message = error instanceof Error ? error.message : String(error)
				toast.error(`Failed to load dashboard data: ${message}`)
			} finally {
				setIsLoading(false)
			}
		}

		fetchData()
	}, [])

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

			// Revalidate data after successful update
			router.refresh()
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
					<p>Loading dashboard...</p>
				</div>
			</div>
		)
	}

	return (
		<>
			<div className="flex flex-1 flex-col">
				<div className="@container/main flex flex-1 flex-col gap-2">
					<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
						{userCurationProfiles.length > 0 ? (
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
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
													{userCurationProfile.selectedBundle.podcasts.map((podcast: CuratedPodcast) => (
														<li key={podcast.id}>{podcast.name}</li>
													))}
												</ul>
											</div>
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
							</div>
						) : (
							<div className="px-4 lg:px-6">
								<Card>
									<CardHeader>
										<CardTitle>No User Curation Profile Found</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground">
											It looks like you haven't created a user curation profile yet. Start by creating one!
										</p>
									</CardContent>
								</Card>
							</div>
						)}
						{userCurationProfiles.length > 0 && <CurationDashboard userCurationProfiles={userCurationProfiles} />}
						<SectionCards />
						<div className="px-4 lg:px-6">
							<ChartAreaInteractive />
						</div>
						<div className="px-4 lg:px-6">
							<EpisodeList episodes={episodes} />
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
		</>
	)
}
