import { createClient } from "@/utils/supabase/server"
import type { Podcast, CuratedCollection } from "./types"

// Mock data for podcasts until that table exists
const mockPodcasts: Podcast[] = [
  {
    id: "1",
    title: "Tech & Finance Weekly",
    date: "July 12, 2025",
    status: "Completed",
    duration: "15:32",
    audioUrl: "/placeholder.mp3",
  },
  {
    id: "2",
    title: "Science & Wellness Digest",
    date: "July 5, 2025",
    status: "Completed",
    duration: "12:45",
    audioUrl: "/placeholder.mp3",
  },
]

export async function getPodcasts(): Promise<Podcast[]> {
  // This remains mocked for now
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockPodcasts
}

export async function getCuratedCollections(): Promise<CuratedCollection[]> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("collections")
    .select(
      `
      id,
      name,
      status,
      sources (
        id,
        name,
        url,
        image_url
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching collections:", error)
    return []
  }

  // Map the data to the CuratedCollection type
  return data.map((collection) => ({
    ...collection,
    sources: collection.sources.map((source) => ({
      ...source,
      imageUrl: source.image_url ?? "",
    })),
  }))
}
