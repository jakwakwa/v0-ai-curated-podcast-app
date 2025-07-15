"use client"

import { getUserCurationProfileStatus, triggerPodcastGeneration } from "@/app/actions"

import type { UserCurationProfile } from "@/lib/types"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import Link from "next/link"
import styles from './saved-collection-card.module.css'

export function SavedCollectionCard({
	userCurationProfile,
}: {
	userCurationProfile: UserCurationProfile
}) {
	const [isLoading, setIsLoading] = useState(false)
	const [currentUserCurationProfile, setCurrentUserCurationProfile] = useState(userCurationProfile)

	// New: State for formatted dates
	const [createdAtDisplay, setCreatedAtDisplay] = useState<string>(userCurationProfile.createdAt.toISOString())
	const [generatedAtDisplay, setGeneratedAtDisplay] = useState<string | null>(
		userCurationProfile.generatedAt ? userCurationProfile.generatedAt.toISOString() : null
	)

	useEffect(() => {
		setCurrentUserCurationProfile(userCurationProfile)
		// Reset formatted dates on userCurationProfile change
		setCreatedAtDisplay(userCurationProfile.createdAt.toISOString())
		setGeneratedAtDisplay(userCurationProfile.generatedAt ? userCurationProfile.generatedAt.toISOString() : null)
	}, [userCurationProfile])

	// Format dates to local time on client after hydration
	useEffect(() => {
		if (typeof window !== "undefined") {
			const formatLogTimestamp = (iso: string) => {
				const date = new Date(iso)
				return date.toLocaleString()
			}
			setCreatedAtDisplay(formatLogTimestamp(userCurationProfile.createdAt.toISOString()))
			if (userCurationProfile.generatedAt) {
				setGeneratedAtDisplay(formatLogTimestamp(userCurationProfile.generatedAt.toISOString()))
			}
		}
	}, [userCurationProfile])

	const handleGenerate = async () => {
		setIsLoading(true)
		let pollingInterval: NodeJS.Timeout | null = null

		try {
			const result = await triggerPodcastGeneration(currentUserCurationProfile.id)

			if (!result.success) {
				throw new Error(result.message)
			}

			toast("Podcast Generation Initiated")

			// Start polling for status update
			pollingInterval = setInterval(async () => {
				const updatedUserCurationProfile = await getUserCurationProfileStatus(currentUserCurationProfile.id)
				if (updatedUserCurationProfile && updatedUserCurationProfile.status === "Generated") {
					setCurrentUserCurationProfile({
						...updatedUserCurationProfile,
						status: updatedUserCurationProfile.status as UserCurationProfile["status"],
					})
					setIsLoading(false)
					if (pollingInterval) clearInterval(pollingInterval)
					toast(`The podcast for "${updatedUserCurationProfile.name}" is now ready.`)
				} else if (updatedUserCurationProfile && updatedUserCurationProfile.status === "Failed") {
					// @ts-ignore
					setCurrentUserCurationProfile({
						...updatedUserCurationProfile,
						status: updatedUserCurationProfile.status as UserCurationProfile["status"],
					})
					setIsLoading(false)
					if (pollingInterval) clearInterval(pollingInterval)
					toast(`The podcast for "${updatedUserCurationProfile.name}" failed to generate.`)
				}
			}, 10000) // Poll every  seconds

			// Add a timeout to stop polling after a certain period (e.g., 5 minutes)
			setTimeout(() => {
				if (isLoading && pollingInterval) {
					clearInterval(pollingInterval)
					setIsLoading(false)
					toast("Podcast generation is taking longer than expected. Please check back later.")
				}
			}, 500) // 30s timeout
		} catch (_error) {
			toast("Failed to initiate podcast generation")
			setIsLoading(false)
			if (pollingInterval) clearInterval(pollingInterval)
		}
	}

	return (
		<Card className={styles["card-container"]}>
			<CardHeader>
				<CardTitle>{currentUserCurationProfile.name}</CardTitle>
				<CardDescription>
					Created: {createdAtDisplay}
					{generatedAtDisplay && (
						<>
							<br />
							Generated: {generatedAtDisplay}
						</>
					)}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{(currentUserCurationProfile.status === "Saved" || currentUserCurationProfile.status === "Failed") && (
					<Button type="button" onClick={handleGenerate} disabled={isLoading} variant="default">
						{isLoading ? (
							"Generating..."
						) : (
							<>
								<Sparkles className={styles["icon"]} />
								Generate Podcast
							</>
						)}
					</Button>
				)}
				{currentUserCurationProfile.status === "Failed" && (
					<p className={styles["error-message"]}>Podcast generation failed. Please try again.</p>
				)}
			</CardContent>
			{currentUserCurationProfile.status === "Generated" && (
				<CardFooter className={styles["card-footer"]}>
					<Link href={`/episodes/${currentUserCurationProfile.id}`}>
						<Button variant="outline" className={styles["full-width-button"]}>
							View Episodes
						</Button>
					</Link>
				</CardFooter>
			)}
		</Card>
	)
}
