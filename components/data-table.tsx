"use client"

import type { Source, UserCurationProfile } from "@/lib/types"
import { z } from "zod"
import { CurationDashboard } from "./curation-dashboard"
import { PodcastList } from "./podcast-list"

export const schema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().nullable(),
	audioUrl: z.string(),
	imageUrl: z.string().nullable(),
	publishedAt: z.date().nullable(),
	createdAt: z.date(),
	sourceId: z.string(),
	userCurationProfileId: z.string(), // Renamed from collectionId
	userCurationProfile: z
		.object({
			id: z.string(),
			audioUrl: z.string().nullable(),
			imageUrl: z.string().nullable(),
			createdAt: z.date(),
			name: z.string(),
			userId: z.string(),
			status: z.string(),
			updatedAt: z.date(),
			generatedAt: z.date().nullable(),
			lastGenerationDate: z.date().nullable(),
			nextGenerationDate: z.date().nullable(),
			isActive: z.boolean(),
			isBundleSelection: z.boolean(),
			selectedBundleId: z.string().nullable(),
			// Add all required relations here, e.g.:
			sources: z.array(z.any()), // Replace z.any() with the actual Source schema
			episodes: z.array(z.any()), // Replace z.any() with the actual Episode schema
		})
		.nullable()
		.optional(), // Renamed from collection
	source: z
		.lazy(() => z.object({}) as unknown as z.ZodType<Source>)
		.nullable()
		.optional(),
	weekNr: z.date(),
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
