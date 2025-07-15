import { DataTable } from "@/components/data-table"
import { getCuratedCollections, getEpisodes } from "@/lib/data"

export default async function DashboardPage() {
	const [episodes, collections] = await Promise.all([getEpisodes(), getCuratedCollections()])
	const savedCollections = collections.filter(c => c.status === "Saved" || c.status === "Generated")

	// Custom sort: "Saved" status first, then by updatedAt (newest first)
	savedCollections.sort((a, b) => {
		// Prioritize "Saved" status over "Generated"
		if (a.status === "Saved" && b.status === "Generated") return -1
		if (a.status === "Generated" && b.status === "Saved") return 1

		// If statuses are the same, sort by updatedAt (newest first)
		return b.updatedAt.getTime() - a.updatedAt.getTime()
	})

	return (
		<>
			<DataTable episodes={episodes} collections={savedCollections} />
		</>
	)
}
