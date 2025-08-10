import type { Bundle, Podcast } from "@/lib/types"
import BundlesPanelClient from "./BundlesPanel.client"

export default async function BundlesPanel() {
	// Fetch via API to inherit gating/admin bypass and shaped podcasts
	const [bundlesRes, podcastsRes] = await Promise.all([fetch(`/api/curated-bundles`, { cache: "no-store" }), fetch(`/api/curated-podcasts`, { cache: "no-store" })])

	const bundles = (await bundlesRes.json()) as (Bundle & { podcasts: Podcast[]; canInteract?: boolean; lockReason?: string | null; min_plan?: string })[]
	const availablePodcasts = (await podcastsRes.json()) as Podcast[]

	return <BundlesPanelClient bundles={bundles} availablePodcasts={availablePodcasts} />
}
