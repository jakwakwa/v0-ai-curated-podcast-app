// DASHBOARD TEMPLATE. CURRENTLY NOT USED IN THE APP
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar-ui"
import { getCuratedCollections, getEpisodes } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EditCollectionModal } from "@/components/edit-collection-modal"
import { useState } from "react"
import { CuratedCollection } from "@/lib/types"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { EpisodeList } from "@/components/episode-list"

const formatDate = (date: Date | null | undefined) => {
	if (!date) return "N/A"
	return new Date(date).toLocaleString()
}

export default async function Page() {
	const collections = await getCuratedCollections()
	const collection = collections[0] // Assuming one collection per user
	const episodes = await getEpisodes() // Fetch all episodes

	const [isModalOpen, setIsModalOpen] = useState(false)
	const router = useRouter()

	const handleSaveCollection = async (updatedData: Partial<CuratedCollection>) => {
		if (!collection) return
		try {
			const response = await fetch(`/api/collections/${collection.id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedData),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.message || "Failed to update collection")
			}

			// Revalidate data after successful update
			router.refresh()
			toast.success("Collection updated successfully!")
			setIsModalOpen(false)

		} catch (error) {
			console.error("Error updating collection:", error)
			toast.error(`Failed to update collection: ${(error as Error).message}`)
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
							{collection ? (
								<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
									<Card>
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-medium">
												Current Collection
											</CardTitle>
											<Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
												Edit
											</Button>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">{collection.name}</div>
											<p className="text-xs text-muted-foreground">
												Status: {collection.status}
											</p>
										</CardContent>
									</Card>

									{collection.isBundleSelection && collection.selectedBundle && (
										<Card>
											<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
												<CardTitle className="text-sm font-medium">
													Selected Bundle
												</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="text-2xl font-bold">{collection.selectedBundle.name}</div>
												<p className="text-xs text-muted-foreground">
													{collection.selectedBundle.description}
												</p>
												<div className="mt-2 text-sm">
													<p className="font-medium">Podcasts:</p>
													<ul className="list-disc pl-5 text-muted-foreground">
														{collection.selectedBundle.podcasts.map((podcast) => (
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
												Collection History
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-sm">
												<p>Created At: {formatDate(collection.createdAt)}</p>
												<p>Updated At: {formatDate(collection.updatedAt)}</p>
												<p>Generated At: {formatDate(collection.generatedAt)}</p>
												<p>Last Generation: {formatDate(collection.lastGenerationDate)}</p>
												<p>Next Generation: {formatDate(collection.nextGenerationDate)}</p>
											</div>
										</CardContent>
									</Card>
								</div>
							) : (
								<div className="px-4 lg:px-6">
									<Card>
										<CardHeader>
											<CardTitle>No Collection Found</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-muted-foreground">
												It looks like you haven't created a collection yet. Start by creating one!
											</p>
										</CardContent>
									</Card>
								</div>
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
			{collection && (
				<EditCollectionModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					collection={collection}
					onSave={handleSaveCollection}
				/>
			)}
		</SidebarProvider>
	)
}
