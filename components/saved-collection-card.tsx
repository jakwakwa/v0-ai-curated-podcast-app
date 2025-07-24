"use client"
import { CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { getUserCurationProfileStatus, triggerPodcastGeneration } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserCurationProfile } from "@/lib/types"
import styles from "./saved-collection-card.module.css"

export function SavedCollectionCard({ userCurationProfile }: { userCurationProfile: UserCurationProfile }) {
	const [currentUserCurationProfile, setCurrentUserCurationProfile] = useState<UserCurationProfile>(userCurationProfile)
	const [isLoading, setIsLoading] = useState(false)
	let pollingInterval: NodeJS.Timeout | null = null

	useEffect(() => {
		setCurrentUserCurationProfile(userCurationProfile)
	}, [userCurationProfile])

	const _handleGenerate = async () => {
		setIsLoading(true)

		try {
			const result = await triggerPodcastGeneration(currentUserCurationProfile.profile_id)

			if (!result.success) {
				throw new Error(result.message)
			}

			toast("Podcast Generation Initiated")

			// Start polling for status update
			pollingInterval = setInterval(async () => {
				const updatedUserCurationProfile = await getUserCurationProfileStatus(currentUserCurationProfile.profile_id)
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

	const formatDate = (date: Date | null | undefined) => {
		if (!date) return "N/A"
		return new Date(date).toLocaleString()
	}

	const getStatusText = (userCurationProfile: UserCurationProfile) => {
		if (userCurationProfile.status === "Generated") {
			return `Generated on ${formatDate(userCurationProfile.generated_at)}`
		}
		return `Created on ${formatDate(userCurationProfile.created_at)}`
	}

	const getStatusColor = (userCurationProfile: UserCurationProfile) => {
		if (userCurationProfile.status === "Generated") {
			return "text-green-600"
		}
		return "text-yellow-600"
	}

	const getStatusIcon = (userCurationProfile: UserCurationProfile) => {
		if (userCurationProfile.status === "Generated") {
			return <CheckCircle className="h-4 w-4 text-green-600" />
		}
		return <Clock className="h-4 w-4 text-yellow-600" />
	}

	return (
		<Card className={styles["card-container"]}>
			<CardHeader>
				<CardTitle>{currentUserCurationProfile.name}</CardTitle>
				<CardDescription>
					<span className={getStatusColor(currentUserCurationProfile)}>
						{getStatusIcon(currentUserCurationProfile)}
						{getStatusText(currentUserCurationProfile)}
					</span>
				</CardDescription>
			</CardHeader>
			<CardContent>
				{/* {(currentUserCurationProfile.status === "Saved" || currentUserCurationProfile.status === "Failed") && (
					<Button type="button" onClick={handleGenerate} disabled={isLoading} variant="default">
						{isLoading ? (
							"Generating..."
						) : (
							<>
								<Sparkles className={styles.icon} />
								Generate Podcast
							</>
						)}
					</Button>
				)} */}
				{currentUserCurationProfile.status === "Failed" && <p className={styles["error-message"]}>Podcast generation failed. Please try again.</p>}
			</CardContent>
			{currentUserCurationProfile.status === "Generated" && (
				<CardFooter className={styles["card-footer"]}>
					<Link href={`/collections/${currentUserCurationProfile.profile_id}`}>
						<Button variant="outline" className={styles["full-width-button"]}>
							View Episodes
						</Button>
					</Link>
				</CardFooter>
			)}
		</Card>
	)
}
