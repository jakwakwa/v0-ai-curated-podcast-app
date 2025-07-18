import { DataTable } from "@/components/data-table"
import { getEpisodes, getUserCurationProfile } from "@/lib/data"
import type { UserCurationProfileWithRelations } from "@/lib/types"

// Force this page to be dynamic since it uses auth()
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
	const [episodes, collections] = await Promise.all([getEpisodes(), getUserCurationProfile()])
	const savedCollections: UserCurationProfileWithRelations[] = collections.filter(
		c => c.status === "Saved" || c.status === "Generated"
	)

	// Custom sort: "Saved" status first, then by updatedAt (newest first)
	savedCollections.sort((a: UserCurationProfileWithRelations, b: UserCurationProfileWithRelations) => {
		// Prioritize "Saved" status over "Generated"
		if (a.status === "Saved" && b.status === "Generated") return -1
		if (a.status === "Generated" && b.status === "Saved") return 1

		// If statuses are the same, sort by updatedAt (newest first)
		return b.updatedAt.getTime() - a.updatedAt.getTime()
	})

	return (
		<>
			<DataTable episodes={episodes} userCurationProfiles={savedCollections} />
		</>
	)
}
