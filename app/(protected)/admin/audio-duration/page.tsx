"use client"

import { Clock, Loader2, Music } from "lucide-react"
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AudioDurationPage() {
	const [isLoading, setIsLoading] = useState(false)
	const [result, setResult] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	const extractDurations = async (type: "user-episodes" | "episodes") => {
		setIsLoading(true)
		setResult(null)
		setError(null)

		try {
			const response = await fetch("/api/admin/audio-duration", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ type }),
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || "Failed to extract durations")
			}

			setResult(data.message)
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="container mx-auto p-6 max-w-4xl space-y-6">
			<div className="space-y-2">
				<h1 className="text-2xl font-semibold flex items-center gap-2">
					<Clock className="h-6 w-6" />
					Audio Duration Extractor
				</h1>
				<p className="text-muted-foreground">Extract and populate duration metadata for existing audio files stored in GCS.</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Music className="h-5 w-5" />
							User Episodes
						</CardTitle>
						<CardDescription>Extract duration from user-generated podcast episode audio files. This will update all user episodes that have audio files but missing duration data.</CardDescription>
					</CardHeader>
					<CardContent>
						<Button variant="icon" onClick={() => extractDurations("user-episodes")} disabled={isLoading} className="w-full">
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Processing...
								</>
							) : (
								"Extract User Episode Durations"
							)}
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Music className="h-5 w-5" />
							Regular Episodes
						</CardTitle>
						<CardDescription>
							Extract duration from regular podcast episode audio files stored in GCS. This will only process episodes stored in our GCS bucket, skipping external URLs.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button variant="icon" onClick={() => extractDurations("episodes")} disabled={isLoading} className="w-full">
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Processing...
								</>
							) : (
								"Extract Episode Durations"
							)}
						</Button>
					</CardContent>
				</Card>
			</div>

			{result && (
				<Alert>
					<Clock className="h-4 w-4" />
					<AlertDescription className="font-medium text-green-600">{result}</AlertDescription>
				</Alert>
			)}

			{error && (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Usage Notes</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
						<li>
							<strong>User Episodes:</strong> Will process all completed user episodes with audio files but missing duration data
						</li>
						<li>
							<strong>Regular Episodes:</strong> Will only process episodes stored in our GCS bucket (URLs starting with gs://), external URLs are skipped
						</li>
						<li>Regular episodes are processed in batches of 50 to avoid timeouts - you may need to run multiple times for large datasets</li>
						<li>The tool uses the same audio metadata extraction logic used for new episode generation</li>
						<li>Duration is extracted from WAV file headers and stored in seconds</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	)
}
