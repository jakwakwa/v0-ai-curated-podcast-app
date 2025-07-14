"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlayCircle, Clock, Calendar, PauseCircle } from "lucide-react"
import type { Podcast } from "@/lib/types"
import { useAudioPlayerStore } from "@/lib/store/audio-player"

interface PodcastCardProps {
  podcast: Podcast
}

export function PodcastCard({ podcast }: PodcastCardProps) {
  const { setActivePodcast, activePodcast, isPlaying } = useAudioPlayerStore()
  const isThisPodcastActive = activePodcast?.id === podcast.id

  const getStatusBadgeVariant = (status: Podcast["status"]) => {
    switch (status) {
      case "Completed":
        return "default" // Changed for better visibility
      case "Processing":
        return "secondary"
      case "Failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handlePlayClick = () => {
    setActivePodcast(podcast)
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{podcast.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          <span>{podcast.date}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center justify-between">
          <Badge variant={getStatusBadgeVariant(podcast.status)}>{podcast.status}</Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{podcast.duration}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={podcast.status !== "Completed"} onClick={handlePlayClick}>
          {isThisPodcastActive && isPlaying ? (
            <PauseCircle className="mr-2 h-4 w-4" />
          ) : (
            <PlayCircle className="mr-2 h-4 w-4" />
          )}
          {isThisPodcastActive && isPlaying ? "Pause" : "Play Episode"}
        </Button>
      </CardFooter>
    </Card>
  )
}
