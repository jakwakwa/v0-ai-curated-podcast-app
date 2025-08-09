"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Podcast } from "@/lib/types"

export default function PodcastsPanelClient({ podcasts }: { podcasts: Podcast[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Podcasts ({podcasts.length})</CardTitle>
        <CardDescription>Create, edit, and manage curated podcasts</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {podcasts.map((podcast: Podcast) => (
            <div key={podcast.podcast_id} className="flex items-start justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{podcast.name}</h4>
                  <Badge size="sm" variant={podcast.is_active ? "default" : "secondary"}>
                    {podcast.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{podcast.description}</p>
                <a href={podcast.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate block">
                  {podcast.url}
                </a>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>
          ))}
          {podcasts.length === 0 && <p className="text-center text-muted-foreground py-4">No podcasts yet.</p>}
        </div>
      </CardContent>
    </Card>
  )
}


