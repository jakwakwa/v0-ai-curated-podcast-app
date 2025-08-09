"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Bundle, Podcast } from "@/lib/types"

type BundleWithPodcasts = Bundle & { podcasts: Podcast[] }

export default function BundlesPanelClient({ bundles, availablePodcasts }: { bundles: BundleWithPodcasts[]; availablePodcasts: Podcast[] }) {
  const [selectedPodcastIds, setSelectedPodcastIds] = useState<string[]>([])
  const [newBundleName, setNewBundleName] = useState("")
  const [newBundleDescription, setNewBundleDescription] = useState("")

  const togglePodcastSelection = (id: string) => {
    setSelectedPodcastIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
  }

  const createBundle = async () => {
    const response = await fetch("/api/admin/bundles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newBundleName.trim(), description: newBundleDescription.trim(), podcast_ids: selectedPodcastIds }),
    })
    if (!response.ok) {
      console.error("Failed to create bundle")
      return
    }
    // No local list refresh here; rely on page refresh or SWR in a future pass
    setNewBundleName("")
    setNewBundleDescription("")
    setSelectedPodcastIds([])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bundle Management</CardTitle>
        <CardDescription>Create new bundles and view existing ones</CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="space-y-3 p-4 border rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bundleName">Bundle Name</Label>
              <Input id="bundleName" value={newBundleName} onChange={e => setNewBundleName(e.target.value)} placeholder="e.g., Tech Weekly" />
            </div>
            <div>
              <Label htmlFor="bundleDescription">Description</Label>
              <Textarea id="bundleDescription" value={newBundleDescription} onChange={e => setNewBundleDescription(e.target.value)} rows={2} />
            </div>
          </div>
          <div>
            <Label>Select Podcasts</Label>
            <div className="mt-2 max-h-60 overflow-y-auto border rounded-lg p-3 space-y-2">
              {availablePodcasts.map((p: Podcast) => (
                <div key={p.podcast_id} className="flex items-start space-x-2">
                  <Checkbox id={`pod-${p.podcast_id}`} checked={selectedPodcastIds.includes(p.podcast_id)} onCheckedChange={() => togglePodcastSelection(p.podcast_id)} />
                  <div className="flex-1">
                    <label htmlFor={`pod-${p.podcast_id}`} className="text-sm font-medium cursor-pointer">{p.name}</label>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button variant="default" onClick={createBundle} disabled={!newBundleName || selectedPodcastIds.length === 0}>Create Bundle</Button>
        </div>
        <div className="space-y-4">
          <h3 className="text-sm text-muted-foreground">Existing Bundles ({bundles.length})</h3>
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


