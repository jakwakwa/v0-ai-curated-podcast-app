import prisma from "./prisma"
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

export async function getCuratedCollections(): Promise<CuratedCollection[]> {
  const session = await auth()
  if (!session?.user?.id) {
    return []
  }

  try {
    const collections = await prisma.collection.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        sources: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return collections.map((collection) => ({
      ...collection,
      sources: collection.sources.map((source) => ({
        ...source,
        imageUrl: source.imageUrl ?? "",
      })),
    }))
  } catch (error) {
    console.error("Error fetching collections with Prisma:", error)
    return []
  }
}
