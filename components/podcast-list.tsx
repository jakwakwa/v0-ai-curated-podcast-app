import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Podcast } from "@/lib/types"
import { PodcastCard } from "./podcast-card"

interface PodcastListProps {
  podcasts: Podcast[]
}

export function PodcastList({ podcasts }: PodcastListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Episodes</CardTitle>
        <CardDescription>Manage and listen to your AI-generated podcast episodes.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {podcasts.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
