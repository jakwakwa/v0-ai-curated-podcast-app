"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import EpisodeCard from "@/components/ui/episode-card"
import { Skeleton } from "@/components/ui/skeleton"
import UserEpisodeAudioPlayer from "@/components/ui/user-episode-audio-player"
import type { UserEpisode } from "@/lib/types"

type UserEpisodeWithSignedUrl = UserEpisode & { signedAudioUrl: string | null }

type EpisodeListProps = {
    completedOnly?: boolean
}

export function EpisodeList({ completedOnly = false }: EpisodeListProps) {
    const [episodes, setEpisodes] = useState<UserEpisodeWithSignedUrl[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeEpisodeId, setActiveEpisodeId] = useState<string | null>(null)

    useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                const res = await fetch("/api/user-episodes/list")
                if (!res.ok) {
                    throw new Error("Failed to fetch episodes.")
                }
                const data: UserEpisodeWithSignedUrl[] = await res.json()
                setEpisodes(completedOnly ? data.filter(e => e.status === "COMPLETED") : data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchEpisodes()
    }, [completedOnly])

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
                        <div key={episode.episode_id} className="p-1">
                            <EpisodeCard
                                imageUrl={null}
                                title={episode.episode_title}
                                description={episode.summary}
                                publishedAt={episode.created_at}
                                actions={
                                    <>
                                        <Badge size="sm" variant={episode.status === "COMPLETED" ? "default" : "destructive"} className="text-xs">
                                            {episode.status}
                                        </Badge>
                                        {episode.status === "COMPLETED" && episode.signedAudioUrl && (
                                            <Button size="sm" variant="default" onClick={() => setActiveEpisodeId(episode.episode_id)}>
                                                Play
                                            </Button>
                                        )}
                                    </>
                                }
                            />
                            {episode.status === "COMPLETED" && episode.signedAudioUrl && activeEpisodeId === episode.episode_id && (
                                <div className="mt-2">
                                    <UserEpisodeAudioPlayer
                                        episode={{
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
                                        onClose={() => setActiveEpisodeId(null)}
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
