"use client"

import { DataTable } from "@/components/data-table"
import { getEpisodes, getUserCurationProfile } from "@/lib/data"
import type { UserCurationProfileWithRelations } from "@/lib/types"
import { useEffect, useState } from "react"

export default function DashboardPage() {
	const [episodes, setEpisodes] = useState([])
	const [savedCollections, setSavedCollections] = useState<UserCurationProfileWithRelations[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [episodesData, collectionsData] = await Promise.all([getEpisodes(), getUserCurationProfile()])

				const filteredCollections: UserCurationProfileWithRelations[] = collectionsData.filter(
					c => c.status === "Saved" || c.status === "Generated"
				)

				// Custom sort: "Saved" status first, then by updatedAt (newest first)
				filteredCollections.sort((a: UserCurationProfileWithRelations, b: UserCurationProfileWithRelations) => {
					// Prioritize "Saved" status over "Generated"
					if (a.status === "Saved" && b.status === "Generated") return -1
					if (a.status === "Generated" && b.status === "Saved") return 1

					// If statuses are the same, sort by updatedAt (newest first)
					return b.updatedAt.getTime() - a.updatedAt.getTime()
				})

				setEpisodes(episodesData)
				setSavedCollections(filteredCollections)
			} catch (error) {
				console.error("Error fetching data:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	if (loading) {
		return <div>Loading...</div>
	}

	return (
		<>
			<DataTable episodes={episodes} userCurationProfiles={savedCollections} />
		</>
	)
}
