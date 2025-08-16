"use client"

import { Lock, Sparkles, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { AppSpinner } from "@/components/ui/app-spinner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Bundle, Podcast } from "@/lib/types"
import Stepper from "./stepper"

type BundleWithPodcasts = (Bundle & { podcasts: Podcast[] }) & { canInteract?: boolean; lockReason?: string | null }

interface EpisodeSource {
	id: string
	name: string
	url: string
}

export default function EpisodeGenerationPanelClient({ bundles }: { bundles: BundleWithPodcasts[] }) {
	const [selectedBundleId, setSelectedBundleId] = useState<string>("")
	const [episodeTitle, setEpisodeTitle] = useState("")
	const [episodeDescription, setEpisodeDescription] = useState("")
	const [episodeImageUrl, setEpisodeImageUrl] = useState("")
	const [sources, setSources] = useState<EpisodeSource[]>([])
	const [newSourceName, setNewSourceName] = useState("")
	const [newSourceUrl, setNewSourceUrl] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	type UploadMethod = "generate" | "upload" | "direct"
	const [uploadMethod, setUploadMethod] = useState<UploadMethod>("generate")
	const [mp3File, setMp3File] = useState<File | null>(null)
	const [audioUrl, setAudioUrl] = useState("")
	const fileInputRef = useRef<HTMLInputElement | null>(null)

	const selectedBundle = bundles.find(b => b.bundle_id === selectedBundleId)

	const hasBundles = bundles && bundles.length > 0

	const isYouTubeUrl = (url: string) => /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(url.trim())

	if (!hasBundles) {
		return (
			<div className="p-6">
				<Card>
					<CardHeader>
						<CardTitle>No bundles found</CardTitle>
						<CardDescription>Create a bundle before generating or uploading episodes.</CardDescription>
					</CardHeader>
					<CardContent>
						<Button asChild variant="default">
							<Link href="/admin/bundles">Create your first bundle</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		)
	}

	const addSource = () => {
		if (!(newSourceName.trim() && newSourceUrl.trim())) {
			toast.error("Source name and URL are required")
			return
		}
		if (!isYouTubeUrl(newSourceUrl)) {
			toast.error("Source URL must be a YouTube link")
			return
		}
		setSources(prev => [...prev, { id: Date.now().toString(), name: newSourceName.trim(), url: newSourceUrl.trim() }])
		setNewSourceName("")
		setNewSourceUrl("")
	}
	const removeSource = (id: string) => setSources(prev => prev.filter(s => s.id !== id))

	const generateEpisode = async () => {
		if (!(selectedBundleId && episodeTitle && sources.length > 0)) {
			toast.error("Bundle, title, and at least one valid source are required")
			return
		}
		// Validate all sources
		if (sources.some(s => !isYouTubeUrl(s.url))) {
			toast.error("All sources must be YouTube links")
			return
		}
		setIsLoading(true)
		const resp = await fetch("/api/admin/generate-bundle-episode", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ bundleId: selectedBundleId, title: episodeTitle, description: episodeDescription || undefined, image_url: episodeImageUrl || undefined, sources }),
		})
		setIsLoading(false)
		if (!resp.ok) {
			toast.error("Failed to start generation")
			return
		}
		toast.success("Episode generation started")
		setSelectedBundleId("")
		setEpisodeTitle("")
		setEpisodeDescription("")
		setEpisodeImageUrl("")
		setSources([])
	}

	const uploadEpisode = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!(selectedBundleId && episodeTitle)) {
			toast.error("Bundle and title are required")
			return
		}
		// Source fields are required for both upload and direct
		if (!(newSourceName.trim() && newSourceUrl.trim())) {
			toast.error("Source name and YouTube URL are required")
			return
		}
		if (!isYouTubeUrl(newSourceUrl)) {
			toast.error("Source URL must be a YouTube link")
			return
		}
		if (uploadMethod === "upload" && !mp3File) {
			toast.error("Please select an MP3 file to upload")
			return
		}
		if (uploadMethod === "direct" && !audioUrl.trim()) {
			toast.error("Please provide an audio URL")
			return
		}
		const formData = new FormData()
		formData.append("bundleId", selectedBundleId)
		formData.append("title", episodeTitle)
		formData.append("description", episodeDescription)
		if (episodeImageUrl) formData.append("image_url", episodeImageUrl)
		if (uploadMethod === "upload" && mp3File) formData.append("file", mp3File)
		if (uploadMethod === "direct" && audioUrl) formData.append("audioUrl", audioUrl)
		setIsLoading(true)
		const resp = await fetch("/api/admin/upload-episode", { method: "POST", body: formData })
		setIsLoading(false)
		if (!resp.ok) {
			toast.error("Failed to upload episode")
			return
		}
		toast.success("Episode uploaded")
		setSelectedBundleId("")
		setEpisodeTitle("")
		setEpisodeDescription("")
		setEpisodeImageUrl("")
		setMp3File(null)
		setAudioUrl("")
		setNewSourceName("")
		setNewSourceUrl("")
		if (fileInputRef.current) fileInputRef.current.value = ""
	}

	return (
		<div className="space-y-6">
			{/* Step 1: Select bundle (always visible) */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Stepper step={1} /> Select Bundle
					</CardTitle>
					<CardDescription>Choose which curated bundle to generate an episode for</CardDescription>
				</CardHeader>
				<CardContent className="p-4">
					<Select value={selectedBundleId} onValueChange={setSelectedBundleId}>
						<SelectTrigger>
							<SelectValue placeholder="Select a bundle..." />
						</SelectTrigger>
						<SelectContent>
							{bundles.map(b => (
								<SelectItem key={b.bundle_id} value={b.bundle_id} disabled={b.canInteract === false}>
									{b.name} ({b.podcasts.length} shows){b.canInteract === false ? " – Locked" : ""}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{selectedBundle && selectedBundle.canInteract === false && (
						<div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
							<Lock className="w-3 h-3" />
							<span>{selectedBundle.lockReason || "This bundle requires a higher plan."}</span>
						</div>
					)}
					{selectedBundle && (
						<div className="mt-4 p-4 bg-muted rounded-lg">
							<h4 className="font-semibold mb-2">{selectedBundle.name}</h4>
							<p className="text-sm text-muted-foreground mb-3">{selectedBundle.description}</p>
							<div className="flex flex-wrap gap-2">
								{selectedBundle.podcasts.map(p => (
									<Badge size="sm" key={p.podcast_id} variant="outline">
										{p.name}
									</Badge>
								))}
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Step 2: Episode details (only when a bundle is selected) */}
			{selectedBundleId && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Stepper step={2} /> Episode Details
						</CardTitle>
						<CardDescription>Provide basic information for the episode</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4 p-4">
						<div>
							<Label htmlFor="title">Episode Title *</Label>
							<Input id="title" value={episodeTitle} onChange={e => setEpisodeTitle(e.target.value)} />
						</div>
						<div>
							<Label htmlFor="description">Episode Description (Optional)</Label>
							<Textarea id="description" rows={3} value={episodeDescription} onChange={e => setEpisodeDescription(e.target.value)} />
						</div>
						<div>
							<Label htmlFor="episodeImageUrl">Episode Image URL (Optional)</Label>
							<Input id="episodeImageUrl" value={episodeImageUrl} onChange={e => setEpisodeImageUrl(e.target.value)} />
						</div>
					</CardContent>
				</Card>
			)}

			{/* Step 3: Method + contextual fields (only when a bundle is selected) */}
			{selectedBundleId && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Stepper step={3} />
							{uploadMethod === "upload" ? "Upload Audio" : uploadMethod === "direct" ? "Provide Audio URL" : "Add Episode Sources"}
						</CardTitle>
						<CardDescription>
							{uploadMethod === "upload"
								? "Choose how to provide the episode audio"
								: uploadMethod === "direct"
									? "Provide a direct MP3 URL"
									: "Add YouTube videos or other sources for each show in the bundle"}
						</CardDescription>
					</CardHeader>
					<CardContent className="p-4 space-y-4">
						<div>
							<Label>Creation Method</Label>
							<div className="flex gap-2 mt-2">
								<Button type="button" variant={uploadMethod === "upload" ? "default" : "outline"} size="sm" onClick={() => setUploadMethod("upload")}>
									Upload MP3
								</Button>
								<Button type="button" variant={uploadMethod === "direct" ? "default" : "outline"} size="sm" onClick={() => setUploadMethod("direct")}>
									Direct Link
								</Button>
								<Button type="button" variant={uploadMethod === "generate" ? "default" : "outline"} size="sm" onClick={() => setUploadMethod("generate")}>
									Generate Episode
								</Button>
							</div>
						</div>

						{uploadMethod === "upload" ? (
							<form onSubmit={uploadEpisode} className="space-y-4">
								<div>
									<Label htmlFor="mp3File">Audio File (MP3)</Label>
									<Input id="mp3File" type="file" accept="audio/mp3,audio/mpeg" ref={fileInputRef} onChange={e => setMp3File(e.target.files?.[0] || null)} />
									{mp3File && <div className="mt-2 text-sm text-muted-foreground">Selected file: {mp3File.name}</div>}
								</div>
								<div>
									<Label htmlFor="sourceName3">Source Name *</Label>
									<Input id="sourceName3" value={newSourceName} onChange={e => setNewSourceName(e.target.value)} />
								</div>
								<div>
									<Label htmlFor="sourceUrl3">Source URL (YouTube) *</Label>
									<Input id="sourceUrl3" value={newSourceUrl} onChange={e => setNewSourceUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
								</div>
								<CardContent className="pt-2 p-0">
									<Button type="submit" disabled={isLoading || !selectedBundleId || !episodeTitle} className="w-full" size="lg" variant="default">
										{isLoading ? (
											<>
												<AppSpinner size="sm" variant="simple" color="default" className="mr-2" />
												Uploading...
											</>
										) : (
											"Upload Episode"
										)}
									</Button>
								</CardContent>
							</form>
						) : uploadMethod === "direct" ? (
							<form onSubmit={uploadEpisode} className="space-y-4">
								<div>
									<Label htmlFor="audioUrl">Audio URL (MP3) *</Label>
									<Input id="audioUrl" type="url" value={audioUrl} onChange={e => setAudioUrl(e.target.value)} placeholder="https://example.com/audio.mp3" />
								</div>
								<div>
									<Label htmlFor="sourceName4">Source Name *</Label>
									<Input id="sourceName4" value={newSourceName} onChange={e => setNewSourceName(e.target.value)} />
								</div>
								<div>
									<Label htmlFor="sourceUrl4">Source URL (YouTube) *</Label>
									<Input id="sourceUrl4" value={newSourceUrl} onChange={e => setNewSourceUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
								</div>
								<CardContent className="pt-2 p-0">
									<Button type="submit" disabled={isLoading || !selectedBundleId || !episodeTitle} className="w-full" size="lg" variant="default">
										{isLoading ? (
											<>
												<AppSpinner size="sm" variant="simple" color="default" className="mr-2" />
												Uploading...
											</>
										) : (
											"Upload Episode"
										)}
									</Button>
								</CardContent>
							</form>
						) : (
							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor="sourceName">Source Name</Label>
										<Input id="sourceName" value={newSourceName} onChange={e => setNewSourceName(e.target.value)} />
									</div>
									<div>
										<Label htmlFor="sourceUrl">Source URL (YouTube)</Label>
										<Input id="sourceUrl" value={newSourceUrl} onChange={e => setNewSourceUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
									</div>
								</div>
								<Button onClick={addSource} variant="outline" className="w-full">
									Add Source
								</Button>
								{sources.length > 0 && (
									<div className="space-y-2">
										<h4 className="font-semibold">Added Sources ({sources.length})</h4>
										{sources.map(s => (
											<div key={s.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
												<div>
													<p className="font-medium">{s.name}</p>
													<p className="text-sm text-muted-foreground truncate">{s.url}</p>
												</div>
												<Button onClick={() => removeSource(s.id)} variant="ghost" size="sm">
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										))}
									</div>
								)}
								<CardContent className="pt-2 p-0">
									<Button onClick={generateEpisode} disabled={isLoading || !selectedBundleId || !episodeTitle || sources.length === 0} className="w-full" size="lg" variant="default">
										{isLoading ? (
											<>
												<AppSpinner size="sm" variant="simple" color="default" className="mr-2" />
												Generating Episode...
											</>
										) : (
											<>
												<Sparkles className="w-4 h-4 mr-2" />
												Generate Episode
											</>
										)}
									</Button>
								</CardContent>
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	)
}
