"use client"

import type { CuratedCollection } from "@/lib/types"
import { z } from "zod"
import { CurationDashboard } from "./curation-dashboard"
import { PodcastList } from "./podcast-list"

export const schema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().nullable().optional(),
	audioUrl: z.string(),
	imageUrl: z.string().nullable().optional(),
	publishedAt: z.union([z.string(), z.date()]).nullable().optional(),
	createdAt: z.union([z.string(), z.date()]),
	sourceId: z.string(),
	collectionId: z.string(),
	collection: z.any().optional(),
	source: z.any().optional(),
})

export function DataTable({
	episodes,
	collections,
}: {
	episodes: z.infer<typeof schema>[]
	collections: CuratedCollection[]
}) {
	return (
		<>
			<PodcastList episodes={episodes} />

			<CurationDashboard savedCollections={collections} />
		</>
	)
}
