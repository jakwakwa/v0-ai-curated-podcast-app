import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Body, Typography } from "@/components/ui/typography"
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
		<div className="flex flex-col gap-8 p-0 w-full md:w-[100%]">
			<div className="space-y-8 w-full">
				{/* Profile Card - using default variant */}
				{showProfileCard && (
					<Card variant="default" className="mb-4">
						<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
							<CardTitle className="text-custom-h4 text-left font-semibold tracking-tight mt-2 mb-2">Personalized Feed</CardTitle>
						</CardHeader>
						<CardContent>
							<Typography className="font-sans mt-0 text-xl font-bold tracking-tight">{userCurationProfile?.name}</Typography>
							<p className="mt-2 mb-4">Status: {userCurationProfile?.status}</p>
						</CardContent>
					</Card>
				)}

				{/* Bundle Card - using bundle variant for better visual distinction */}
				{showBundleCard && userCurationProfile?.is_bundle_selection && userCurationProfile?.selectedBundle && (
					<Card variant="primarycard" className="bg-primary-card">
						<CardHeader className="flex w-full flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="w-full text-xl font-semibold tracking-tight">
								<span className="text-custom-md text-accent"> {userCurationProfile.selectedBundle.name} Bundle</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
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
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	)
})
