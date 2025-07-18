"use client"

import { Button } from "@/components/ui/button"
import { saveCuration } from "@/app/actions"

interface SaveCurationFormProps {
	userCurationProfileId: string
	disabled: boolean
}

export function SaveCurationForm({ userCurationProfileId, disabled }: SaveCurationFormProps) {
	return (
		<form action={saveCuration} className="w-full">
			<input type="hidden" name="userCurationProfileId" value={userCurationProfileId} />
			<Button type="submit" className="w-full" disabled={disabled} size={"sm"}>
				Save Curation & Return to Dashboard
			</Button>
		</form>
	)
}
