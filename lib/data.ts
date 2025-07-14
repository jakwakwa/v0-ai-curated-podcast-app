import { sql } from "./db"
import { auth } from "@/auth"
import type { Podcast, CuratedCollection } from "./types"

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
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockPodcasts
}

interface CollectionRow {
  collection_id: string
  collection_name: string
  collection_status: "Draft" | "Saved"
  source_id: string | null
  source_name: string | null
  source_url: string | null
  source_image_url: string | null
}

export async function getCuratedCollections(): Promise<CuratedCollection[]> {
  const session = await auth()
  if (!session?.user?.id) {
    return []
  }

  try {
    const rows = await sql<CollectionRow>`
      SELECT
        c.id as collection_id,
        c.name as collection_name,
        c.status as collection_status,
        s.id as source_id,
        s.name as source_name,
        s.url as source_url,
        s.image_url as source_image_url
      FROM collections c
      LEFT JOIN sources s ON c.id = s.collection_id
      WHERE c.user_id = ${session.user.id}
      ORDER BY c.created_at DESC;
    `

    const collectionsMap = new Map<string, CuratedCollection>()

    for (const row of rows) {
      if (!collectionsMap.has(row.collection_id)) {
        collectionsMap.set(row.collection_id, {
          id: row.collection_id,
          name: row.collection_name,
          status: row.collection_status,
          sources: [],
        })
      }

      if (row.source_id) {
        const collection = collectionsMap.get(row.collection_id)!
        collection.sources.push({
          id: row.source_id,
          name: row.source_name!,
          url: row.source_url!,
          imageUrl: row.source_image_url || "",
        })
      }
    }

    return Array.from(collectionsMap.values())
  } catch (error) {
    console.error("Error fetching collections:", error)
    return []
  }
}
