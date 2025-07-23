"use client"

// NOTE: This component has been updated for the new unified schema where:
// - sourceId -> podcastId
// - userCurationProfileId -> userProfileId
// - Added bundleId for new schema
// Some relations might need further updates based on Prisma includes

import { Play } from "lucide-react"
import type { Episode, UserCurationProfileWithRelations } from "@/lib/types"
import { CurationDashboard } from "./curation-dashboard"
import { PodcastList } from "./podcast-list"

export function DataTable({ episodes, userCurationProfiles }: { episodes: Episode[]; userCurationProfiles: UserCurationProfileWithRelations[] }) {
	const hasEpisodes = episodes.length > 0
	const hasProfiles = userCurationProfiles.length > 0

	return (
		<div className="space-y-8">
			{/* Episodes Section */}
			{hasEpisodes ? (
				<PodcastList episodes={episodes} />
			) : (
				<div className="text-center py-8">
					<div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
						<Play className="w-8 h-8 text-muted-foreground" />
					</div>
					<h3 className="text-lg font-semibold mb-2">No Episodes Yet</h3>
					<p className="text-muted-foreground mb-4">Create a curation profile to start generating episodes</p>
				</div>
			)}

			{/* User Curation Profiles Section */}
			{hasProfiles ? (
				<CurationDashboard userCurationProfiles={userCurationProfiles} />
			) : (
				<div className="text-center py-8">
					<div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
						<Play className="w-8 h-8 text-muted-foreground" />
					</div>
					<h3 className="text-lg font-semibold mb-2">No User Curation Profiles Yet</h3>
					<p className="text-muted-foreground mb-4">Create your first user curation profile to get started</p>
				</div>
			)}
		</div>
	)
}
