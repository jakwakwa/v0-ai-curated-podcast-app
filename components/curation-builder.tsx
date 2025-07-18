"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddSourceForm } from "./add-source-form"
import { SaveCurationForm } from "./save-curation-form"
import { SourceList } from "./source-list"
import { createDraftUserCurationProfile } from "@/app/actions"
import { getUserCurationProfile } from "@/lib/data"
import { useEffect, useState } from "react"
import { CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { UserCurationProfileWithRelations } from "@/lib/types"
import { aiConfig } from "@/config/ai"

export function CurationBuilder({
	userCurationProfile,
}: {
	userCurationProfile?: UserCurationProfileWithRelations
}) {
	const [existingProfile, setExistingProfile] = useState<any>(null)
	const [isCheckingProfile, setIsCheckingProfile] = useState(true)

	// Check if user already has an active profile
	useEffect(() => {
		const checkExistingProfile = async () => {
			try {
				const profile = await getUserCurationProfile()
				setExistingProfile(profile)
			} catch (error) {
				console.error("Error checking existing profile:", error)
			} finally {
				setIsCheckingProfile(false)
			}
		}

		checkExistingProfile()
	}, [])

	// Show loading state while checking for existing profile
	if (isCheckingProfile) {
		return (
			<Card>
				<CardContent className="text-center py-12">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
					<p>Checking your profile status...</p>
				</CardContent>
			</Card>
		)
	}

	// Show message if user already has an active profile
	if (existingProfile) {
		return (
			<Card>
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
						<CheckCircle className="w-8 h-8 text-green-600" />
					</div>
					<CardTitle className="text-2xl">You Already Have a Profile</CardTitle>
					<CardDescription className="text-lg">
						You already have an active curation profile: <strong>{existingProfile.name}</strong>
					</CardDescription>
				</CardHeader>
				<CardContent className="text-center space-y-4">
					<p className="text-muted-foreground max-w-md mx-auto">
						Users can only have one active curation profile at a time. You can edit your existing profile or deactivate it to create a new one.
					</p>
					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<Link href="/dashboard">
							<Button className="w-full sm:w-auto">
								<ArrowLeft className="w-4 h-4 mr-2" />
								Go to Dashboard
							</Button>
						</Link>
						<Link href="/curation-profile-management">
							<Button variant="outline" className="w-full sm:w-auto">
								Manage Profile
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		)
	}

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
