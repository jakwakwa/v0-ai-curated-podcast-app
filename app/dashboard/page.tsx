// DASHBOARD TEMPLATE. CURRENTLY NOT USED IN THE APP
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar-ui"
import { getCuratedCollections, getEpisodes } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EditUserCurationProfileModal } from "@/components/edit-user-curation-profile-modal"
import { useState } from "react"
import type { UserCurationProfile } from "@/lib/types"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { EpisodeList } from "@/components/episode-list"
import { CurationDashboard } from "@/components/curation-dashboard"

const formatDate = (date: Date | null | undefined) => {
	if (!date) return "N/A"
	return new Date(date).toLocaleString()
}

export default async function Page() {
	const userCurationProfiles = await getCuratedCollections()
	const userCurationProfile = userCurationProfiles[0] // Assuming one user curation profile per user
	const episodes = await getEpisodes() // Fetch all episodes

	const [isModalOpen, setIsModalOpen] = useState(false)
	const router = useRouter()

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
				throw new Error(errorData.message || "Failed to update user curation profile")
			}

			// Revalidate data after successful update
			router.refresh()
			toast.success("User Curation Profile updated successfully!")
			setIsModalOpen(false)

		} catch (error) {
			// biome-ignore lint/suspicious/noConsole: <testing>
			console.error("Error updating user curation profile:", error)
			toast.error(`Failed to update user curation profile: ${(error as Error).message}`)
		}
	}

	return (
		<SidebarProvider>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<SiteHeader />
				<div className="flex flex-1 flex-col">
					<div className="@container/main flex flex-1 flex-col gap-2">
						<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
							{userCurationProfiles.length > 0 ? (
								<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
									<Card>
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-medium">
												Current User Curation Profile
											</CardTitle>
											<Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
												Edit
											</Button>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">{userCurationProfile?.name}</div>
											<p className="text-xs text-muted-foreground">
												Status: {userCurationProfile?.status}
											</p>
										</CardContent>
									</Card>

									{userCurationProfile?.isBundleSelection && userCurationProfile?.selectedBundle && (
										<Card>
											<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
												<CardTitle className="text-sm font-medium">
													Selected Bundle
												</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="text-2xl font-bold">{userCurationProfile.selectedBundle.name}</div>
												<p className="text-xs text-muted-foreground">
													{userCurationProfile.selectedBundle.description}
												</p>
												<div className="mt-2 text-sm">
													<p className="font-medium">Podcasts:</p>
													<ul className="list-disc pl-5 text-muted-foreground">
														{userCurationProfile.selectedBundle.podcasts.map((podcast) => (
															<li key={podcast.id}>{podcast.name}</li>
														))}
													</ul>
												</div>
											</CardContent>
										</Card>
									)}

									<Card>
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-medium">
												User Curation Profile History
											</CardTitle>
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
							{userCurationProfiles.length > 0 && (
								<CurationDashboard userCurationProfiles={userCurationProfiles} />
							)}
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
			</SidebarInset>
			{userCurationProfile && (
				<EditUserCurationProfileModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					collection={userCurationProfile}
					onSave={handleSaveUserCurationProfile}
				/>
			)}
		</SidebarProvider>
	)
}
