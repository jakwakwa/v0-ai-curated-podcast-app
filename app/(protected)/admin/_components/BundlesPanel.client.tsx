"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Bundle, Podcast } from "@/lib/types"

type BundleWithPodcasts = Bundle & { podcasts: Podcast[] }

export default function BundlesPanelClient({ bundles }: { bundles: BundleWithPodcasts[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Existing Bundles ({bundles.length})</CardTitle>
        <CardDescription>Manage your PODSLICE Bundles</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {bundles.map(bundle => (
            <div key={bundle.bundle_id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold">{bundle.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{bundle.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {bundle.podcasts.map((podcast: Podcast) => (
                      <Badge size="sm" key={podcast.podcast_id} variant="outline" className="text-xs">
                        {podcast.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="sm">Actions</Button>
              </div>
            </div>
          ))}
          {bundles.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No bundles created yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


