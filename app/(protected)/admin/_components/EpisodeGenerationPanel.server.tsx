import type { Bundle, Podcast } from "@/lib/types"
import EpisodeGenerationPanelClient from "./EpisodeGenerationPanel.client"

export default async function EpisodeGenerationPanel() {
	const res = await fetch(`/api/curated-bundles`, { cache: "no-store" })
	if (!res.ok) {
		// Fail closed with empty list to avoid client errors
		return <EpisodeGenerationPanelClient bundles={[]} />
	}
	const bundles = (await res.json()) as (Bundle & { podcasts: Podcast[]; canInteract?: boolean; lockReason?: string | null; min_plan?: string })[]
	return <EpisodeGenerationPanelClient bundles={bundles} />
}
