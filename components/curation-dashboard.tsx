import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserCurationProfile } from "@/lib/types"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { SavedUserCurationProfileList } from "./saved-user-curation-profile-list"

export function CurationDashboard({
	userCurationProfiles,
}: Readonly<{
	userCurationProfiles: UserCurationProfile[]
}>) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div className="flex flex-col gap-4">
					<CardTitle>Saved User Curation Profiles</CardTitle>
					<CardDescription>Generate podcasts from your saved curations.</CardDescription>
					<Button asChild size={"sm"}>
						<Link href="/build">
							<PlusCircle className="mr-2 h-4 w-4" />
							Build New
						</Link>
					</Button>
				</div>
			</CardHeader>
			<CardContent className="grid gap-4">
				<SavedUserCurationProfileList userCurationProfiles={userCurationProfiles} />
			</CardContent>
		</Card>
	)
}
