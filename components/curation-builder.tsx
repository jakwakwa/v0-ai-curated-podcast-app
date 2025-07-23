"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserCurationProfileWithRelations } from "@/lib/types"

export function CurationBuilder({ userCurationProfile: _userCurationProfile }: { userCurationProfile?: UserCurationProfileWithRelations }) {
	// TODO: Fix this component after the database schema migration is complete
	return (
		<Card>
			<CardHeader>
				<CardTitle>Curation Builder - Temporarily Disabled</CardTitle>
				<CardDescription>This component has been temporarily disabled during the database schema migration.</CardDescription>
			</CardHeader>
			<CardContent>
				<p>Please check back later once the migration is complete.</p>
			</CardContent>
		</Card>
	)
}
