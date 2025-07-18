import { createDraftUserCurationProfile, saveCuration } from "@/app/actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { aiConfig } from "@/config/ai"
import type { UserCurationProfileWithRelations } from "@/lib/types"
import Link from "next/link"
import { AddSourceForm } from "./add-source-form"
import { SourceList } from "./source-list"
import { Button } from "./ui/button"

function SaveCurationForm({
	userCurationProfileId,
	disabled,
}: {
	userCurationProfileId: string
	disabled: boolean
}) {
	return (
		<form action={saveCuration} className="w-full">
			<input type="hidden" name="userCurationProfileId" value={userCurationProfileId} />
			<Button type="submit" className="w-full" disabled={disabled} size={"sm"}>
				Save Curation & Return to Dashboard
			</Button>
		</form>
	)
}

export function CurationBuilder({
	userCurationProfile,
}: {
	userCurationProfile?: UserCurationProfileWithRelations
}) {
	if (!userCurationProfile) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>No Draft Found</CardTitle>
					<CardDescription>It looks like there&apos;s no draft user curation profile to work on.</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={createDraftUserCurationProfile}>
						<Button type="submit" size={"sm"}>
							Create New User Curation Profile
						</Button>
					</form>
				</CardContent>
			</Card>
		)
	}

	const sources = userCurationProfile.sources ?? []
	const sourceCount = sources.length
	const canAddMore = sourceCount < aiConfig.maxSources
	const canSave = sourceCount === aiConfig.maxSources

	return (
		<Card>
			<CardHeader>
				<CardTitle>Build Your Weekly User Curation Profile</CardTitle>
				<CardDescription>
					Add {aiConfig.maxSources} Youtube podcast show to create a new user curation profile. This user curation
					profile will be used to generate your next podcast episode.
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-6">
				<div className="text-center font-semibold text-lg">
					Sources Added: {sourceCount} / {aiConfig.maxSources}
				</div>
				<AddSourceForm disabled={!canAddMore} />
				<SourceList sources={sources} />
			</CardContent>
			<CardFooter>
				<SaveCurationForm userCurationProfileId={userCurationProfile.id} disabled={!canSave} />
			</CardFooter>
			<CardContent>
				<Link href={"/"}>Back to Dashboard</Link>
			</CardContent>
		</Card>
	)
}
