"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import UserEpisodeAudioPlayer from "@/components/ui/user-episode-audio-player"
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
                                <Badge size="sm" variant={episode.status === "COMPLETED" ? "default" : "destructive"} className="text-xs">
                                    {episode.status}
                                </Badge>
                            </div>
                            {episode.status === "COMPLETED" && episode.signedAudioUrl && (
                                <div className="mt-4">
                                    <UserEpisodeAudioPlayer
                                        episode={{
                                            // Mapping UserEpisode to the Episode type expected by AudioPlayer
                                            episode_id: episode.episode_id,
                                            episode_title: episode.episode_title,
                                            gcs_audio_url: episode.signedAudioUrl,
                                            summary: episode.summary,
                                            created_at: episode.created_at,
                                            updated_at: episode.updated_at,
                                            user_id: episode.user_id,
                                            youtube_url: episode.youtube_url,
                                            transcript: episode.transcript,
                                            status: episode.status,
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
