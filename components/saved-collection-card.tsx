"use client"

import { getCollectionStatus } from "@/app/actions"
import { triggerPodcastGeneration } from "@/app/actions"

import type { CuratedCollection } from "@/lib/types"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatLogTimestamp } from "@/lib/utils"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export function SavedCollectionCard({
	collection,
}: {
	collection: CuratedCollection
}) {
	const [isLoading, setIsLoading] = useState(false)
	const [currentCollection, setCurrentCollection] = useState(collection)

	useEffect(() => {
		setCurrentCollection(collection)
	}, [collection])

	const handleGenerate = async () => {
		setIsLoading(true)
		let pollingInterval: NodeJS.Timeout | null = null

		try {
			const result = await triggerPodcastGeneration(currentCollection.id)

			if (!result.success) {
				throw new Error(result.message)
			}

			toast("Podcast Generation Initiated")

			// Start polling for status update
			pollingInterval = setInterval(async () => {
				const updatedCollection = await getCollectionStatus(currentCollection.id)
				if (updatedCollection && updatedCollection.status === "Generated") {
					setCurrentCollection({
						...updatedCollection,
						status: updatedCollection.status as CuratedCollection["status"],
					})
					setIsLoading(false)
					if (pollingInterval) clearInterval(pollingInterval)
					toast(`The podcast for "${updatedCollection.name}" is now ready.`)
				} else if (updatedCollection && updatedCollection.status === "Failed") {
					// @ts-ignore
					setCurrentCollection({
						...updatedCollection,
						status: updatedCollection.status as CuratedCollection["status"],
					})
					setIsLoading(false)
					if (pollingInterval) clearInterval(pollingInterval)
					toast(`The podcast for "${updatedCollection.name}" failed to generate.`)
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
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>{currentCollection.name}</CardTitle>
				<CardDescription>
					Created: {formatLogTimestamp(currentCollection.createdAt.toISOString())}
					{currentCollection.generatedAt && (
						<>
							<br />
							Generated: {formatLogTimestamp(currentCollection.generatedAt.toISOString())}
						</>
					)}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{(currentCollection.status === "Saved" || currentCollection.status === "Failed") && (
					<Button type="button" onClick={handleGenerate} disabled={isLoading} variant="default">
						{isLoading ? (
							"Generating..."
						) : (
							<>
								<Sparkles className="mr-2 h-4 w-4" />
								Generate Podcast
							</>
						)}
					</Button>
				)}
				{currentCollection.status === "Failed" && (
					<p className="text-red-500 text-sm mt-2">Podcast generation failed. Please try again.</p>
				)}
			</CardContent>
			{currentCollection.status === "Generated" && (
				<CardFooter className="flex-col gap-2">
					<Link href={`/collections/${currentCollection.id}`}>
						<Button variant="outline" className="w-full">
							View Episodes
						</Button>
					</Link>
				</CardFooter>
			)}
		</Card>
	)
}

// <div className="rounded-lg border bg-card p-4">
// <div className="mb-4">
// 	<h4 className="font-semibold">{currentCollection.name}</h4>
// 	<p className="text-sm text-muted-foreground">Created: {displayTimestamp}</p>
// 	{currentCollection.status === "Saved" && (
// 		<Button type="button" onClick={handleGenerate} disabled={isLoading} variant="default">
// 			{isLoading ? (
// 				"Generating..."
// 			) : (
// 				<>
// 					<Sparkles className="mr-2 h-4 w-4" />
// 					Generate Podcast
// 				</>
// 			)}
// 		</Button>
// 	)}

// 	{currentCollection.status === "Generated" && (
// 		<Link href={`/collections/${currentCollection.id}`}>
// 			<Button
// 				variant="default"
// 				className="w-full bg-primary text-primary-foreground rounded px-4 py-2 font-semibold hover:bg-primary/90 transition"
// 			>
// 				View Episodes
// 			</Button>
// 		</Link>
// 	)}
// </div>
// </div>
