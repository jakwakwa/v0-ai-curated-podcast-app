"use client"

import { useRef, useState } from "react"
import { Sparkles, Trash2 } from "lucide-react"
import { AppSpinner } from "@/components/ui/app-spinner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Bundle, Podcast } from "@/lib/types"

type BundleWithPodcasts = Bundle & { podcasts: Podcast[] }

interface EpisodeSource { id: string; name: string; url: string }

export default function EpisodeGenerationPanelClient({ bundles }: { bundles: BundleWithPodcasts[] }) {
  const [selectedBundleId, setSelectedBundleId] = useState<string>("")
  const [episodeTitle, setEpisodeTitle] = useState("")
  const [episodeDescription, setEpisodeDescription] = useState("")
  const [episodeImageUrl, setEpisodeImageUrl] = useState("")
  const [sources, setSources] = useState<EpisodeSource[]>([])
  const [newSourceName, setNewSourceName] = useState("")
  const [newSourceUrl, setNewSourceUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<"generate" | "upload">("generate")
  const [mp3File, setMp3File] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const selectedBundle = bundles.find(b => b.bundle_id === selectedBundleId)

  const addSource = () => {
    if (!(newSourceName.trim() && newSourceUrl.trim())) return
    setSources(prev => [...prev, { id: Date.now().toString(), name: newSourceName.trim(), url: newSourceUrl.trim() }])
    setNewSourceName("")
    setNewSourceUrl("")
  }
  const removeSource = (id: string) => setSources(prev => prev.filter(s => s.id !== id))

  const generateEpisode = async () => {
    if (!(selectedBundleId && episodeTitle && sources.length > 0)) return
    setIsLoading(true)
    const resp = await fetch("/api/admin/generate-bundle-episode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bundleId: selectedBundleId, title: episodeTitle, description: episodeDescription || undefined, image_url: episodeImageUrl || undefined, sources }),
    })
    setIsLoading(false)
    if (!resp.ok) return
    setSelectedBundleId("")
    setEpisodeTitle("")
    setEpisodeDescription("")
    setEpisodeImageUrl("")
    setSources([])
  }

  const uploadEpisode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!(selectedBundleId && episodeTitle && ((uploadMethod === "upload" && (mp3File || audioUrl)) || uploadMethod === "generate"))) return
    const formData = new FormData()
    formData.append("bundleId", selectedBundleId)
    formData.append("title", episodeTitle)
    formData.append("description", episodeDescription)
    if (episodeImageUrl) formData.append("image_url", episodeImageUrl)
    if (mp3File) formData.append("file", mp3File)
    if (audioUrl) formData.append("audioUrl", audioUrl)
    setIsLoading(true)
    await fetch("/api/admin/upload-episode", { method: "POST", body: formData })
    setIsLoading(false)
    setSelectedBundleId("")
    setEpisodeTitle("")
    setEpisodeDescription("")
    setEpisodeImageUrl("")
    setMp3File(null)
    setAudioUrl("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-4">
        <Button variant={uploadMethod === "generate" ? "default" : "outline"} onClick={() => setUploadMethod("generate")}>Generate Episode</Button>
        <Button variant={uploadMethod === "upload" ? "default" : "outline"} onClick={() => setUploadMethod("upload")}>Upload MP3</Button>
      </div>

      {uploadMethod === "generate" ? (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span> Select Bundle</CardTitle>
              <CardDescription>Choose which curated bundle to generate an episode for</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Select onValueChange={setSelectedBundleId}>
                <SelectTrigger><SelectValue placeholder="Select a bundle..." /></SelectTrigger>
                <SelectContent>
                  {bundles.map(b => (<SelectItem key={b.bundle_id} value={b.bundle_id}>{b.name} ({b.podcasts.length} shows)</SelectItem>))}
                </SelectContent>
              </Select>
              {selectedBundle && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">{selectedBundle.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{selectedBundle.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedBundle.podcasts.map(p => (<Badge size="sm" key={p.podcast_id} variant="outline">{p.name}</Badge>))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span> Episode Details</CardTitle>
              <CardDescription>Provide basic information for the episode</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div><Label htmlFor="title">Episode Title *</Label><Input id="title" value={episodeTitle} onChange={e => setEpisodeTitle(e.target.value)} /></div>
              <div><Label htmlFor="description">Episode Description (Optional)</Label><Textarea id="description" rows={3} value={episodeDescription} onChange={e => setEpisodeDescription(e.target.value)} /></div>
              <div><Label htmlFor="episodeImageUrl">Episode Image URL (Optional)</Label><Input id="episodeImageUrl" value={episodeImageUrl} onChange={e => setEpisodeImageUrl(e.target.value)} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span> Add Episode Sources</CardTitle>
              <CardDescription>Add YouTube videos or other sources for each show in the bundle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="sourceName">Source Name</Label><Input id="sourceName" value={newSourceName} onChange={e => setNewSourceName(e.target.value)} /></div>
                <div><Label htmlFor="sourceUrl">Source URL</Label><Input id="sourceUrl" value={newSourceUrl} onChange={e => setNewSourceUrl(e.target.value)} /></div>
              </div>
              <Button onClick={addSource} variant="outline" className="w-full">Add Source</Button>
              {sources.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Added Sources ({sources.length})</h4>
                  {sources.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div><p className="font-medium">{s.name}</p><p className="text-sm text-muted-foreground truncate">{s.url}</p></div>
                      <Button onClick={() => removeSource(s.id)} variant="ghost" size="sm"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <Button onClick={generateEpisode} disabled={isLoading || !selectedBundleId || !episodeTitle || sources.length === 0} className="w-full" size="lg" variant="default">
              {isLoading ? (<><AppSpinner size="sm" variant="simple" color="default" className="mr-2" />Generating Episode...</>) : (<><Sparkles className="w-4 h-4 mr-2" />Generate Episode</>)}
            </Button>
          </Card>
        </div>
      ) : (
        <form onSubmit={uploadEpisode} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span> Select Bundle</CardTitle>
              <CardDescription>Choose which curated bundle to upload an episode for</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Select value={selectedBundleId} onValueChange={setSelectedBundleId}><SelectTrigger><SelectValue placeholder="Select a bundle..." /></SelectTrigger><SelectContent>{bundles.map(b => (<SelectItem key={b.bundle_id} value={b.bundle_id}>{b.name} ({b.podcasts.length} shows)</SelectItem>))}</SelectContent></Select>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span> Episode Details</CardTitle>
              <CardDescription>Provide basic information for the episode</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div><Label htmlFor="title2">Episode Title *</Label><Input id="title2" value={episodeTitle} onChange={e => setEpisodeTitle(e.target.value)} /></div>
              <div><Label htmlFor="description2">Episode Description (Optional)</Label><Textarea id="description2" rows={3} value={episodeDescription} onChange={e => setEpisodeDescription(e.target.value)} /></div>
              <div><Label htmlFor="episodeImageUrl2">Episode Image URL (Optional)</Label><Input id="episodeImageUrl2" value={episodeImageUrl} onChange={e => setEpisodeImageUrl(e.target.value)} /></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span> Upload Audio</CardTitle><CardDescription>Choose how to provide the episode audio</CardDescription></CardHeader>
            <CardContent className="p-4">
              <div className="mb-4"><Label>Upload Method</Label><div className="flex gap-2 mt-2"><Button type="button" variant={uploadMethod === "upload" ? "default" : "outline"} size="sm" onClick={() => setUploadMethod("upload")}>Upload File</Button><Button type="button" variant={uploadMethod === "generate" ? "default" : "outline"} size="sm" onClick={() => setUploadMethod("generate")}>Direct URL</Button></div></div>
              {uploadMethod === "upload" && (<div><Label htmlFor="mp3File">Audio File (MP3)</Label><Input id="mp3File" type="file" accept="audio/mp3,audio/mpeg" ref={fileInputRef} onChange={e => setMp3File(e.target.files?.[0] || null)} />{mp3File && <div className="mt-2 text-sm text-muted-foreground">Selected file: {mp3File.name}</div>}</div>)}
              {uploadMethod === "generate" && (<div><Label htmlFor="audioUrl">Audio URL</Label><Input id="audioUrl" type="url" value={audioUrl} onChange={e => setAudioUrl(e.target.value)} placeholder="https://example.com/audio.mp3" /></div>)}
            </CardContent>
          </Card>
          <Card><CardContent className="pt-6 p-4"><Button type="submit" disabled={!(selectedBundleId && episodeTitle && (mp3File || audioUrl)) || isLoading} className="w-full" size="lg" variant="default">{isLoading ? (<><AppSpinner size="sm" variant="simple" color="default" className="mr-2" />Uploading...</>) : (<>Upload Episode</>)}</Button></CardContent></Card>
        </form>
      )}
    </div>
  )
}


