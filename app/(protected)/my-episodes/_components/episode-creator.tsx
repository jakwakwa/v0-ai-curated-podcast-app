"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const EPISODE_LIMIT = 10 // Assuming a limit of 10 for now

export function EpisodeCreator() {
    const [youtubeUrl, setYoutubeUrl] = useState("")
    const [episodeTitle, setEpisodeTitle] = useState("")
    const [isFetchingTitle, setIsFetchingTitle] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [usage, setUsage] = useState({ count: 0, limit: EPISODE_LIMIT })
    const [isLoadingUsage, setIsLoadingUsage] = useState(true)

    useEffect(() => {
        const fetchUsage = async () => {
            try {
                setIsLoadingUsage(true)
                const res = await fetch("/api/account/subscription")
                if (res.ok) {
                    const subscription = await res.json()
                    if (subscription) {
                        setUsage({
                            count: subscription.episode_creation_count,
                            limit: EPISODE_LIMIT, // TODO: This should come from plan data
                        })
                    }
                }
            } catch (error) {
                console.error("Failed to fetch subscription data:", error)
            } finally {
                setIsLoadingUsage(false)
            }
        }
        fetchUsage()
    }, [])

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (youtubeUrl.includes("youtube.com") || youtubeUrl.includes("youtu.be")) {
                try {
                    setIsFetchingTitle(true)
                    const res = await fetch(`/api/youtube-metadata?url=${encodeURIComponent(youtubeUrl)}`)
                    if (res.ok) {
                        const data = await res.json()
                        setEpisodeTitle(data.title)
                    }
                } catch (_err) {
                    // Ignore fetch errors for metadata
                } finally {
                    setIsFetchingTitle(false)
                }
            }
        }, 500)

        return () => {
            clearTimeout(handler)
        }
    }, [youtubeUrl])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsCreating(true)
        setError(null)
        setSuccessMessage(null)

        try {
            const res = await fetch("/api/user-episodes/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ youtubeUrl, episodeTitle }),
            })

            if (!res.ok) {
                const errorData = await res.text()
                throw new Error(errorData || "Failed to create episode.")
            }

            const newEpisode = await res.json()
            setSuccessMessage(`Successfully started generation for: "${newEpisode.episode_title}"`)
            setYoutubeUrl("")
            setEpisodeTitle("")
            // Optimistically update usage count
            setUsage(prev => ({ ...prev, count: prev.count + 1 }))
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.")
        } finally {
            setIsCreating(false)
        }
    }

    const hasReachedLimit = usage.count >= usage.limit

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Episode</CardTitle>
                <CardDescription>Enter a YouTube URL to generate a new podcast episode.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoadingUsage ? (
                    <p>Loading usage data...</p>
                ) : hasReachedLimit ? (
                    <p className="text-red-500">You have reached your monthly limit for episode creation.</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="youtubeUrl">YouTube URL</Label>
                            <Input id="youtubeUrl" placeholder="https://www.youtube.com/watch?v=..." value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} disabled={isCreating} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="episodeTitle">Episode Title</Label>
                            <Input
                                id="episodeTitle"
                                placeholder="Episode title will be fetched automatically"
                                value={episodeTitle}
                                onChange={e => setEpisodeTitle(e.target.value)}
                                disabled={isCreating || isFetchingTitle}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={isCreating || isFetchingTitle || !youtubeUrl || !episodeTitle}>
                            {isCreating ? "Generating..." : "Generate Episode"}
                        </Button>
                    </form>
                )}
                {error && <p className="text-red-500 mt-4">{error}</p>}
                {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
            </CardContent>
        </Card>
    )
}
