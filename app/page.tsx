import { DataTable } from "@/components/data-table"
import { getCuratedCollections, getEpisodes } from "@/lib/data"

export default async function DashboardPage() {
	const [episodes, collections] = await Promise.all([getEpisodes(), getCuratedCollections()])
	const savedCollections = collections.filter(c => c.status === "Saved" || c.status === "Generated")

	// Sort savedCollections by createdAt in descending order (newest first)
	savedCollections.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

	return (
		<>
			<DataTable episodes={episodes} collections={collections} />
		</>
	)
}
