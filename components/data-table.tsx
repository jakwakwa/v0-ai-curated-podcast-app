"use client"

import type { UserCurationProfile, Source } from "@/lib/types"
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
	userCurationProfileId: z.string(), // Renamed from collectionId
	userCurationProfile: z.lazy(() => z.object({}) as unknown as z.ZodType<UserCurationProfile>).nullable().optional(), // Renamed from collection
	source: z.lazy(() => z.object({}) as unknown as z.ZodType<Source>).nullable().optional(),
})

export function DataTable({
	episodes,
	userCurationProfiles,
}: {
	episodes: z.infer<typeof schema>[]
	userCurationProfiles: UserCurationProfile[] // Renamed from collections
}) {
	return (
		<>
			<PodcastList episodes={episodes} />

			<CurationDashboard userCurationProfiles={userCurationProfiles} /> {/* Renamed from savedCollections */}
		</>
	)
}
