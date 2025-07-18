"use client"

import { getEpisodes } from "@/lib/data"
import { useUserCurationProfileStore } from "@/lib/stores/user-curation-profile-store"
import type { Episode } from "@/lib/types"
import { useEffect, useState } from "react"
import { EpisodeList } from "@/components/episode-list"

export default function WeeklyEpisodesPage() {
	const [episodes, setEpisodes] = useState<Episode[]>([])
	const userCurationProfileStore = useUserCurationProfileStore()

	useEffect(() => {
		const fetchEpisodes = async () => {
			const episodeData = await getEpisodes()
			setEpisodes(episodeData)
		}
		fetchEpisodes()
	}, [])

	useEffect(() => {
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.log("WeeklyEpisodesPage: Episodes Data:", episodes)
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.log("WeeklyEpisodesPage: UserCurationProfile Store Data:", userCurationProfileStore.userCurationProfile)
	}, [episodes, userCurationProfileStore.userCurationProfile])

	return (
		<div>
			<h1>Weekly Episodes Page</h1>
			<p>This page will list weekly generated episodes.</p>
			<EpisodeList episodes={episodes} />
		</div>
	)
}
