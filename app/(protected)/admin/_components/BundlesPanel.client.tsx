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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type BundleWithPodcasts = Bundle & { podcasts: Podcast[] }

export default function BundlesPanelClient({ bundles, availablePodcasts }: { bundles: (BundleWithPodcasts & { min_plan?: string; canInteract?: boolean; lockReason?: string | null })[]; availablePodcasts: Podcast[] }) {
  const [selectedPodcastIds, setSelectedPodcastIds] = useState<string[]>([])
  const [newBundleName, setNewBundleName] = useState("")
  const [newBundleDescription, setNewBundleDescription] = useState("")

  const togglePodcastSelection = (id: string) => {
    setSelectedPodcastIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
  }

  const [minPlan, setMinPlan] = useState<string>("NONE")
  const [editOpen, setEditOpen] = useState<boolean>(false)
  const [editingBundleId, setEditingBundleId] = useState<string | null>(null)
  const [editingMinPlan, setEditingMinPlan] = useState<string>("NONE")
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false)

  const createBundle = async () => {
    const response = await fetch("/api/admin/bundles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newBundleName.trim(), description: newBundleDescription.trim(), podcast_ids: selectedPodcastIds, min_plan: minPlan }),
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

  const openEditVisibility = (bundleId: string, currentMinPlan: string | undefined) => {
    setEditingBundleId(bundleId)
    setEditingMinPlan(currentMinPlan || "NONE")
    setEditOpen(true)
  }

  const saveEditVisibility = async () => {
    if (!editingBundleId) return
    setIsSavingEdit(true)
    try {
      await fetch("/api/admin/bundles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bundle_id: editingBundleId, min_plan: editingMinPlan }),
      })
      setEditOpen(false)
    } finally {
      setIsSavingEdit(false)
    }
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
            <div>
              <Label htmlFor="minPlan">Visibility</Label>
              <select id="minPlan" className="w-full border rounded h-9 px-2 bg-background" value={minPlan} onChange={e => setMinPlan(e.target.value)}>
                <option value="NONE">Free (All users)</option>
                <option value="CASUAL_LISTENER">Tier 2 and 3</option>
                <option value="CURATE_CONTROL">Tier 3 only</option>
              </select>
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
            <div key={bundle.bundle_id} className={`p-4 border rounded-lg ${bundle.canInteract === false ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold">{bundle.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{bundle.description}</p>
                  {bundle.canInteract === false && (
                    <p className="text-xs text-muted-foreground">{bundle.lockReason || "Locked for your plan"}</p>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {bundle.podcasts.map((podcast: Podcast) => (
                      <Badge size="sm" key={podcast.podcast_id} variant="outline" className="text-xs">
                        {podcast.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Dialog open={editOpen && editingBundleId === bundle.bundle_id} onOpenChange={(o) => { if (!o) setEditOpen(false) }}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => openEditVisibility(bundle.bundle_id, (bundle as any).min_plan)}>Edit visibility</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit bundle visibility</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                      <Label htmlFor="editMinPlan">Visibility</Label>
                      <select id="editMinPlan" className="w-full border rounded h-9 px-2 bg-background" value={editingMinPlan} onChange={e => setEditingMinPlan(e.target.value)}>
                        <option value="NONE">Free (All users)</option>
                        <option value="CASUAL_LISTENER">Tier 2 and 3</option>
                        <option value="CURATE_CONTROL">Tier 3 only</option>
                      </select>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                      <Button variant="default" onClick={saveEditVisibility} disabled={isSavingEdit}>{isSavingEdit ? "Saving..." : "Save"}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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


