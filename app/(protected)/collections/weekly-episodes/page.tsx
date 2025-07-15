"use client"

import { useEffect, useState } from "react"
import { getEpisodes } from "@/lib/data"
import { useUserCurationProfileStore } from "@/lib/stores/user-curation-profile-store"
import type { Episode } from "@/lib/types"

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
    console.log("WeeklyEpisodesPage: Episodes Data:", episodes)
    console.log("WeeklyEpisodesPage: UserCurationProfile Store Data:", userCurationProfileStore.userCurationProfiles)
  }, [episodes, userCurationProfileStore.userCurationProfiles])

  return (
    <div>
      <h1>Weekly Episodes Page</h1>
      <p>This page will list weekly generated episodes.</p>
      {/* Your UI will go here */}
    </div>
  )
} 