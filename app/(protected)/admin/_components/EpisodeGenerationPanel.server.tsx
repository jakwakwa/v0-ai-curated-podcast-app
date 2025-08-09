import { prisma } from "@/lib/prisma"
import type { Bundle, Podcast } from "@/lib/types"
import EpisodeGenerationPanelClient from "./EpisodeGenerationPanel.client"

export default async function EpisodeGenerationPanel() {
  const bundles = await prisma.bundle.findMany({
    where: { is_active: true },
    include: { bundle_podcast: { include: { podcast: true } } },
    orderBy: { created_at: "desc" },
  })

  const shaped: (Bundle & { podcasts: Podcast[] })[] = bundles.map(b => ({
    ...(b as unknown as Bundle),
    podcasts: b.bundle_podcast.map(bp => bp.podcast as unknown as Podcast),
  }))

  return <EpisodeGenerationPanelClient bundles={shaped} />
}


