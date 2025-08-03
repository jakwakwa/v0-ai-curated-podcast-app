"use client"
import { CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { getUserCurationProfileStatus, triggerPodcastGeneration } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserCurationProfile } from "@/lib/types"
import { cn } from "@/lib/utils"

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
			return <CheckCircle className="w-4 h-4 text-green-600" />
		}
		return <Clock className="w-4 h-4 text-yellow-600" />
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{currentUserCurationProfile.name}</CardTitle>
				<CardDescription>
					<span className={cn("flex items-center gap-2", getStatusColor(currentUserCurationProfile))}>
						{getStatusIcon(currentUserCurationProfile)}
						{getStatusText(currentUserCurationProfile)}
					</span>
				</CardDescription>
			</CardHeader>
			<CardContent>{currentUserCurationProfile.status === "Failed" && <p className="text-destructive text-sm">Podcast generation failed. Please try again.</p>}</CardContent>
			{currentUserCurationProfile.status === "Generated" && (
				<CardFooter>
					<Link href={`/collections/${currentUserCurationProfile.profile_id}`} className="w-full">
						<Button variant="outline" className="w-full">
							View Episodes
						</Button>
					</Link>
				</CardFooter>
			)}
		</Card>
	)
}
