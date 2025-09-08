import { memo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import type { UserCurationProfileWithRelations } from "@/lib/types"

interface ProfileFeedCardsProps {
	userCurationProfile: UserCurationProfileWithRelations | null
	showProfileCard?: boolean
}

export const ProfileFeedCards = memo(function ProfileFeedCards({ userCurationProfile, showProfileCard = true }: ProfileFeedCardsProps) {
	if (!userCurationProfile) {
		return null
	}

	return (
		<div className="flex flex-col gap-8 p-0 w-full md:w-[100%]">
			<div className="w-full ">
				{/* Profile Card - using default variant */}
				{showProfileCard && (
					<Card variant="default" className=" mb-4">
						<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
							<Typography as="h2" className=" text-left font-semibold tracking-tight mt-2 mb-2 text-h3">
								Bundle Selection
							</Typography>
						</CardHeader>
						<CardContent>
							<Typography as="h3" className="font-sans font-bold text-accent-foreground/90">
								{userCurationProfile.selectedBundle?.name || "No Bundle Selected"}
							</Typography>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	)
})
