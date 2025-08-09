import { prisma } from "@/lib/prisma"
import type { Bundle, Podcast } from "@/lib/types"
import BundlesPanelClient from "./BundlesPanel.client"

export default async function BundlesPanel() {
  const bundles = await prisma.bundle.findMany({
    include: {
      bundle_podcast: { include: { podcast: true } },
    },
    orderBy: { created_at: "desc" },
  })

  const shaped: (Bundle & { podcasts: Podcast[] })[] = bundles.map(b => ({
    ...(b as unknown as Bundle),
    podcasts: b.bundle_podcast.map(bp => bp.podcast as unknown as Podcast),
  }))

  return <BundlesPanelClient bundles={shaped} />
}


