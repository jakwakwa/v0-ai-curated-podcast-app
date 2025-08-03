import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Body, BodySmall, H3, Typography } from "@/components/ui/typography"
import type { UserCurationProfileWithRelations } from "@/lib/types"

interface ProfileFeedCardsProps {
	userCurationProfile: UserCurationProfileWithRelations | null
	showProfileCard?: boolean
	showBundleCard?: boolean
}

export const ProfileFeedCards = memo(function ProfileFeedCards({ userCurationProfile, showProfileCard = true, showBundleCard = true }: ProfileFeedCardsProps) {
	if (!userCurationProfile) {
		return null
	}

	return (
		<div className="flex flex-col gap-8 p-0 md:w-[90%]">
			<div className="space-y-8">
				{/* Profile Card - using default variant */}
				{showProfileCard && (
					<Card variant="default" className="mb-4">
						<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
							<CardTitle className="text-xl font-semibold tracking-tight mt-2 mb-2">Current Personalized Feed</CardTitle>
						</CardHeader>
						<CardContent>
							<H3 className="mt-6 text-xl font-semibold tracking-tight">{userCurationProfile?.name}</H3>
							<BodySmall className="mt-2 mb-4">Status: {userCurationProfile?.status}</BodySmall>
						</CardContent>
					</Card>
				)}

				{/* Bundle Card - using bundle variant for better visual distinction */}
				{showBundleCard && userCurationProfile?.is_bundle_selection && userCurationProfile?.selectedBundle && (
					<Card variant="bundle">
						<CardHeader className="flex w-full flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-xl font-semibold tracking-tight mt-2 mb-2">
								<Typography variant="h3">Selected Bundle</Typography>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<H3 className="w-full mt-6 text-xl font-semibold tracking-tight">{userCurationProfile.selectedBundle.name}</H3>
							<BodySmall className="mt-2 mb-4">{userCurationProfile.selectedBundle.description}</BodySmall>

							{userCurationProfile.selectedBundle.podcasts && userCurationProfile.selectedBundle.podcasts.length > 0 && (
								<div>
									<Body className="text-xl font-semibold tracking-tight mt-2 mb-2">Podcasts:</Body>
									<ul className="list-disc pl-5 text-muted-foreground">
										{userCurationProfile.selectedBundle.podcasts?.map(podcast => (
											<li className="text-base leading-6 font-normal tracking-[0.025em] mt-2 mb-4 text-muted-foreground" key={podcast.podcast_id}>
												{podcast.name}
											</li>
										)) || <li className="text-base leading-6 font-normal tracking-[0.025em] mt-2 mb-4 text-muted-foreground">No podcasts loaded</li>}
									</ul>
								</div>
							)}

							{userCurationProfile.selectedBundle.episodes && userCurationProfile.selectedBundle.episodes.length > 0 && (
								<div>
									<Body className="text-xl font-semibold tracking-tight mt-2 mb-2">Bundle Episodes:</Body>
									<ul className="list-disc pl-5 text-muted-foreground">
										{userCurationProfile.selectedBundle.episodes.map(episode => (
											<li className="text-base leading-6 font-normal tracking-[0.025em] mt-2 mb-4 text-muted-foreground" key={episode.episode_id}>
												{episode.title} - {episode.published_at ? new Date(episode.published_at).toLocaleDateString() : "N/A"}
											</li>
										))}
									</ul>
								</div>
							)}
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	)
})
