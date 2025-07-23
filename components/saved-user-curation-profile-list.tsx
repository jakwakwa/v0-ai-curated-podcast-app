import { SavedCollectionCard } from "./saved-collection-card"
import type { UserCurationProfile } from "@/lib/types"

interface SavedUserCurationProfileListProps {
	userCurationProfiles: UserCurationProfile[]
}

export function SavedUserCurationProfileList({ userCurationProfiles }: Readonly<SavedUserCurationProfileListProps>) {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{userCurationProfiles?.map(userCurationProfile => (
				<SavedCollectionCard key={userCurationProfile.id} userCurationProfile={userCurationProfile} />
			))}
		</div>
	)
}
