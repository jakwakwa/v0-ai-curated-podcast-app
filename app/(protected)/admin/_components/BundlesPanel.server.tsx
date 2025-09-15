import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import type { Bundle, Podcast } from "@/lib/types";
import BundlesPanelClient from "./BundlesPanel.client";

export default async function BundlesPanel() {
	await requireAdmin();

	const [bundlesDb, podcastsDb] = await Promise.all([
		prisma.bundle.findMany(
			{
				include: {
					bundle_podcast: {
						include: { podcast: true }
					}
				}, orderBy: { created_at: "desc" },
				cacheStrategy: {
					swr: 60,
					ttl: 60,
					tags: ["BundlePanel in Admin"]
				}
			}
		),
		prisma.podcast.findMany(
			{
				where: { is_active: true },
				orderBy: { name: "asc" },
				cacheStrategy: {
					swr: 60,
					ttl: 60,
					tags: ["Podcast List in Bundles Panel in Admin"]
				}
			}),
	]);

	const bundles: (Bundle & { podcasts: Podcast[] })[] = bundlesDb.map(b => ({
		...(b as unknown as Bundle),
		podcasts: b.bundle_podcast.map(bp => bp.podcast as unknown as Podcast),
	}));
	const availablePodcasts = podcastsDb as unknown as Podcast[];

	return <BundlesPanelClient bundles={bundles} availablePodcasts={availablePodcasts} />;
}
