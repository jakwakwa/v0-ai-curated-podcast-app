import { prisma } from "@/lib/prisma"
import type { Bundle, Podcast } from "@/lib/types"
import BundlesPanelClient from "./BundlesPanel.client"

export default async function BundlesPanel() {
  const [bundles, availablePodcasts] = await Promise.all([
    prisma.bundle.findMany({
      include: { bundle_podcast: { include: { podcast: true } }, episodes: { orderBy: { published_at: "desc" } } },
      orderBy: { created_at: "desc" },
    }),
    prisma.podcast.findMany({ where: { is_active: true }, orderBy: { name: "asc" } }),
  ])

  const shaped: (Bundle & { podcasts: Podcast[] })[] = bundles.map(b => ({
    ...(b as unknown as Bundle),
    podcasts: b.bundle_podcast.map(bp => bp.podcast as unknown as Podcast),
  }))

  return <BundlesPanelClient bundles={shaped} availablePodcasts={availablePodcasts as unknown as Podcast[]} />
}


