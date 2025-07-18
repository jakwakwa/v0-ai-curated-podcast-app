"use client"

import { DataTable } from "@/components/data-table"
import { getEpisodes, getUserCurationProfile } from "@/lib/data"
import type { UserCurationProfileWithRelations, Episode } from "@/lib/types"
import { useEffect, useState } from "react"

export default function DashboardPage() {
	const [episodes, setEpisodes] = useState<Episode[]>([])
	const [savedCollections, setSavedCollections] = useState<UserCurationProfileWithRelations[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [episodesData, collectionsData] = await Promise.all([getEpisodes(), getUserCurationProfile()])

				const filteredCollections: UserCurationProfileWithRelations[] = collectionsData.filter((collection) => {
					return collection.status === "Saved"
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
		<div className="p-6">
			<h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
			<DataTable episodes={episodes} savedCollections={savedCollections} />
		</div>
	)
}
