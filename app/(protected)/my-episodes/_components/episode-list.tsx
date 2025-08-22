"use client"

import { useEffect, useState } from "react"
import AudioPlayer from "@/components/ui/audio-player"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { UserEpisode } from "@/lib/types"

type UserEpisodeWithSignedUrl = UserEpisode & { signedAudioUrl: string | null }

export function EpisodeList() {
    const [episodes, setEpisodes] = useState<UserEpisodeWithSignedUrl[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                const res = await fetch("/api/user-episodes/list")
                if (!res.ok) {
                    throw new Error("Failed to fetch episodes.")
                }
                const data = await res.json()
                setEpisodes(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchEpisodes()

        const interval = setInterval(fetchEpisodes, 5000) // Poll every 5 seconds

        return () => clearInterval(interval)
    }, [])

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>My Generated Episodes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return <p className="text-red-500">{error}</p>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Generated Episodes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {episodes.length === 0 ? (
                    <p>You haven't created any episodes yet.</p>
                ) : (
                    episodes.map(episode => (
                        <div key={episode.episode_id} className="p-4 border rounded-md">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold">{episode.episode_title}</h3>
                                <Badge variant={episode.status === "COMPLETED" ? "default" : "secondary"}>
                                    {episode.status}
                                </Badge>
                            </div>
                            {episode.status === "COMPLETED" && episode.signedAudioUrl && (
                                <div className="mt-4">
                                    <AudioPlayer
                                        episode={{
                                            // Mapping UserEpisode to the Episode type expected by AudioPlayer
                                            episode_id: episode.episode_id,
                                            title: episode.episode_title,
                                            audio_url: episode.signedAudioUrl,
                                            description: episode.summary,
                                            image_url: null, // User episodes don't have images yet
                                            podcast_id: "", // Not applicable
                                            published_at: new Date(episode.created_at),
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}
