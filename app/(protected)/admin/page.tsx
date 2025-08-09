"use client"

import { Edit, Eye, EyeOff, FolderPlus, Mic, Plus, Sparkles, Trash2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { AppSpinner } from "@/components/ui/app-spinner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import type { Bundle, Podcast } from "@/lib/types"

interface EpisodeSource {
	id: string
	name: string
	url: string
	showId?: string // For future show updates
}

interface AdminGenerationRequest {
	bundleId: string
	title: string
	description?: string
	image_url?: string
	sources: EpisodeSource[]
}

// Type for bundle with podcasts array from API
type BundleWithPodcasts = Bundle & { podcasts: Podcast[] }

export default function AdminPage() {
	const router = useRouter()
	const [adminStatus, setAdminStatus] = useState<boolean | null>(null)
	const [isCheckingAdmin, setIsCheckingAdmin] = useState(true)

	const [bundles, setBundles] = useState<BundleWithPodcasts[]>([])
	const [selectedBundleId, setSelectedBundleId] = useState<string>("")
	const [episodeTitle, setEpisodeTitle] = useState<string>("")
	const [episodeDescription, setEpisodeDescription] = useState<string>("")
	const [episodeImageUrl, setEpisodeImageUrl] = useState<string>("")
	const [sources, setSources] = useState<EpisodeSource[]>([])
	const [newSourceName, setNewSourceName] = useState<string>("")
	const [newSourceUrl, setNewSourceUrl] = useState<string>("")
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingBundles, setIsLoadingBundles] = useState(true)

	// Episode mode and upload state
	const [episodeMode, setEpisodeMode] = useState<"generate" | "upload">("generate")
	const [mp3File, setMp3File] = useState<File | null>(null)
	const [audioUrl, setAudioUrl] = useState<string>("")
	const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file")
	const fileInputRef = useRef<HTMLInputElement | null>(null)

	// Bundle management state
	const [showCreateBundle, setShowCreateBundle] = useState(false)
	const [newBundleName, setNewBundleName] = useState<string>("")
	const [newBundleDescription, setNewBundleDescription] = useState<string>("")
	const [newBundleImageUrl, setNewBundleImageUrl] = useState<string>("")
	const [availablePodcasts, setAvailablePodcasts] = useState<Podcast[]>([])
	const [selectedPodcastIds, setSelectedPodcastIds] = useState<string[]>([])
	const [isCreatingBundle, setIsCreatingBundle] = useState(false)
	const [isDeletingBundle, setIsDeletingBundle] = useState<string | null>(null)

	// Podcast management state
	const [showCreatePodcast, setShowCreatePodcast] = useState(false)
	const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null)
	const [newPodcastName, setNewPodcastName] = useState<string>("")
	const [newPodcastDescription, setNewPodcastDescription] = useState<string>("")
	const [newPodcastUrl, setNewPodcastUrl] = useState<string>("")
	const [newPodcastImageUrl, setNewPodcastImageUrl] = useState<string>("")
	const [newPodcastCategory, setNewPodcastCategory] = useState<string>("")
	const [isCreatingPodcast, setIsCreatingPodcast] = useState(false)
	const [isUpdatingPodcast, setIsUpdatingPodcast] = useState(false)
	const [isDeletingPodcast, setIsDeletingPodcast] = useState<string | null>(null)

	const checkAdminStatus = useCallback(async () => {
		try {
			const response = await fetch("/api/admin/check")

			if (!response.ok) {
				console.error("Admin check API returned error:", response.status)
				setAdminStatus(false)
				toast.error("Access denied. Admin privileges required.")
				router.back()
				return
			}

			const data = await response.json()

			// Check if the response indicates admin access
			if (data.success && data.message === "Admin access confirmed") {
				setAdminStatus(true)
			} else {
				setAdminStatus(false)
				toast.error("Access denied. Admin privileges required.")
				router.back()
			}
		} catch (error) {
			console.error("Error checking admin status:", error)
			toast.error("Error checking admin status")
			setAdminStatus(false)
			router.back()
		} finally {
			setIsCheckingAdmin(false)
		}
	}, [router])

	useEffect(() => {
		checkAdminStatus()
	}, [checkAdminStatus])

	const fetchBundles = useCallback(async () => {
		try {
			const response = await fetch("/api/curated-bundles")
			if (!response.ok) throw new Error("Failed to fetch bundles")
			const data = await response.json()
			setBundles(data)
		} catch (error) {
			console.error("Error fetching bundles:", error)
			toast.error("Failed to load bundles")
		} finally {
			setIsLoadingBundles(false)
		}
	}, [])

	const fetchAvailablePodcasts = useCallback(async () => {
		try {
			const response = await fetch("/api/curated-podcasts")
			if (!response.ok) throw new Error("Failed to fetch podcasts")
			const data = await response.json()
			setAvailablePodcasts(data)
		} catch (error) {
			console.error("Error fetching podcasts:", error)
			toast.error("Failed to load available podcasts")
		}
	}, [])

	const refreshPodcasts = useCallback(async () => {
		await fetchAvailablePodcasts()
	}, [fetchAvailablePodcasts])

	useEffect(() => {
		if (adminStatus) {
			fetchBundles()
			fetchAvailablePodcasts()
		}
	}, [adminStatus, fetchBundles, fetchAvailablePodcasts])

	const addSource = () => {
		if (!(newSourceName.trim() && newSourceUrl.trim())) {
			toast.error("Please provide both name and URL for the source")
			return
		}

		const newSource: EpisodeSource = {
			id: Date.now().toString(),
			name: newSourceName.trim(),
			url: newSourceUrl.trim(),
		}

		setSources([...sources, newSource])
		setNewSourceName("")
		setNewSourceUrl("")
	}

	const removeSource = (id: string) => {
		setSources(sources.filter(source => source.id !== id))
	}

	const generateEpisode = async () => {
		if (!selectedBundleId) {
			toast.error("Please select a bundle")
			return
		}

		if (!episodeTitle.trim()) {
			toast.error("Please provide an episode title")
			return
		}

		if (sources.length === 0) {
			toast.error("Please add at least one source")
			return
		}

		setIsLoading(true)

		try {
			const request: AdminGenerationRequest = {
				bundleId: selectedBundleId,
				title: episodeTitle.trim(),
				description: episodeDescription.trim() || undefined,
				image_url: episodeImageUrl.trim() || undefined,
				sources,
			}

			const response = await fetch("/api/admin/generate-bundle-episode", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(request),
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || "Failed to generate episode")
			}

			await response.json()
			toast.success("Episode generation started successfully!")

			// Reset form
			setSelectedBundleId("")
			setEpisodeTitle("")
			setEpisodeDescription("")
			setEpisodeImageUrl("")
			setSources([])
		} catch (error) {
			console.error("Error generating episode:", error)
			toast.error(error instanceof Error ? error.message : "Failed to generate episode")
		} finally {
			setIsLoading(false)
		}
	}

	const uploadEpisode = async (e: React.FormEvent) => {
		e.preventDefault()

		// Validate based on upload method
		if (uploadMethod === "file") {
			if (!(mp3File && selectedBundleId && episodeTitle)) {
				toast.error("Please fill all required fields and select a file.")
				return
			}
		} else {
			if (!(audioUrl && selectedBundleId && episodeTitle)) {
				toast.error("Please fill all required fields and provide an audio URL.")
				return
			}
		}

		const formData = new FormData()
		formData.append("bundleId", selectedBundleId)
		formData.append("title", episodeTitle)
		formData.append("description", episodeDescription)
		if (episodeImageUrl.trim()) {
			formData.append("image_url", episodeImageUrl.trim())
		}

		// Add either file or audioUrl based on upload method
		if (uploadMethod === "file") {
			formData.append("file", mp3File!)
		} else {
			formData.append("audioUrl", audioUrl.trim())
		}

		setIsLoading(true)
		try {
			const response = await fetch("/api/admin/upload-episode", {
				method: "POST",
				body: formData,
			})
			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || "Failed to upload episode")
			}
			toast.success("Episode uploaded successfully!")
			setSelectedBundleId("")
			setEpisodeTitle("")
			setEpisodeDescription("")
			setEpisodeImageUrl("")
			setMp3File(null)
			setAudioUrl("")
			if (fileInputRef.current) fileInputRef.current.value = ""
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to upload episode")
		} finally {
			setIsLoading(false)
		}
	}

	const createBundle = async () => {
		if (!newBundleName.trim()) {
			toast.error("Please provide a bundle name")
			return
		}

		if (!newBundleDescription.trim()) {
			toast.error("Please provide a bundle description")
			return
		}

		if (selectedPodcastIds.length === 0) {
			toast.error("Please select at least one podcast")
			return
		}

		setIsCreatingBundle(true)

		try {
			const response = await fetch("/api/admin/bundles", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: newBundleName.trim(),
					description: newBundleDescription.trim(),
					image_url: newBundleImageUrl.trim() || null,
					podcast_ids: selectedPodcastIds,
				}),
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || "Failed to create bundle")
			}

			const newBundle = await response.json()
			setBundles([...bundles, newBundle])
			toast.success("Bundle created successfully!")

			// Reset form
			setNewBundleName("")
			setNewBundleDescription("")
			setNewBundleImageUrl("")
			setSelectedPodcastIds([])
			setShowCreateBundle(false)
		} catch (error) {
			console.error("Error creating bundle:", error)
			toast.error(error instanceof Error ? error.message : "Failed to create bundle")
		} finally {
			setIsCreatingBundle(false)
		}
	}

	const deleteBundle = async (bundleId: string) => {
		if (!confirm("Are you sure you want to delete this bundle? This action cannot be undone.")) {
			return
		}

		setIsDeletingBundle(bundleId)

		try {
			const response = await fetch(`/api/admin/bundles?id=${bundleId}`, {
				method: "DELETE",
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || "Failed to delete bundle")
			}

			setBundles(bundles.filter(b => b.bundle_id !== bundleId))
			toast.success("Bundle deleted successfully!")

			// Reset selected bundle if it was the deleted one
			if (selectedBundleId === bundleId) {
				setSelectedBundleId("")
			}
		} catch (error) {
			console.error("Error deleting bundle:", error)
			toast.error(error instanceof Error ? error.message : "Failed to delete bundle")
		} finally {
			setIsDeletingBundle(null)
		}
	}

	const togglePodcastSelection = (podcastId: string) => {
		setSelectedPodcastIds(prev => (prev.includes(podcastId) ? prev.filter(id => id !== podcastId) : [...prev, podcastId]))
	}

	// Podcast management functions
	const resetPodcastForm = () => {
		setNewPodcastName("")
		setNewPodcastDescription("")
		setNewPodcastUrl("")
		setNewPodcastImageUrl("")
		setNewPodcastCategory("")
		setEditingPodcast(null)
		setShowCreatePodcast(false)
	}

	const startEditPodcast = (podcast: Podcast) => {
		setEditingPodcast(podcast)
		setNewPodcastName(podcast.name)
		setNewPodcastDescription(podcast.description || "")
		setNewPodcastUrl(podcast.url)
		setNewPodcastImageUrl(podcast.image_url || "")
		setNewPodcastCategory(podcast.category || "")
		setShowCreatePodcast(true)
	}

	const createPodcast = async () => {
		if (!newPodcastName.trim()) {
			toast.error("Please provide a podcast name")
			return
		}

		if (!newPodcastDescription.trim()) {
			toast.error("Please provide a podcast description")
			return
		}

		if (!newPodcastUrl.trim()) {
			toast.error("Please provide a podcast URL")
			return
		}

		setIsCreatingPodcast(true)

		try {
			const response = await fetch("/api/admin/podcasts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: newPodcastName.trim(),
					description: newPodcastDescription.trim(),
					url: newPodcastUrl.trim(),
					image_url: newPodcastImageUrl.trim() || null,
					category: newPodcastCategory,
				}),
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || "Failed to create podcast")
			}

			const newPodcast = await response.json()
			console.log("New podcast created:", newPodcast)
			console.log("Current availablePodcasts count:", availablePodcasts.length)
			setAvailablePodcasts(prev => {
				const updated = [...prev, newPodcast]
				console.log("Updated availablePodcasts count:", updated.length)
				return updated
			})
			toast.success("Podcast created successfully!")
			resetPodcastForm()
		} catch (error) {
			console.error("Error creating podcast:", error)
			toast.error(error instanceof Error ? error.message : "Failed to create podcast")
		} finally {
			setIsCreatingPodcast(false)
		}
	}

	const updatePodcast = async () => {
		if (!editingPodcast) return

		if (!newPodcastName.trim()) {
			toast.error("Please provide a podcast name")
			return
		}

		if (!newPodcastDescription.trim()) {
			toast.error("Please provide a podcast description")
			return
		}

		if (!newPodcastUrl.trim()) {
			toast.error("Please provide a podcast URL")
			return
		}

		setIsUpdatingPodcast(true)

		try {
			const response = await fetch("/api/admin/podcasts", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: editingPodcast.podcast_id,
					name: newPodcastName.trim(),
					description: newPodcastDescription.trim(),
					url: newPodcastUrl.trim(),
					image_url: newPodcastImageUrl.trim() || null,
					category: newPodcastCategory,
				}),
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || "Failed to update podcast")
			}

			const updatedPodcast = await response.json()
			setAvailablePodcasts(availablePodcasts.map(p => (p.podcast_id === updatedPodcast.podcast_id ? updatedPodcast : p)))
			toast.success("Podcast updated successfully!")
			resetPodcastForm()
		} catch (error) {
			console.error("Error updating podcast:", error)
			toast.error(error instanceof Error ? error.message : "Failed to update podcast")
		} finally {
			setIsUpdatingPodcast(false)
		}
	}

	const deletePodcast = async (podcastId: string) => {
		if (!confirm("Are you sure you want to delete this podcast? This action cannot be undone.")) {
			return
		}

		setIsDeletingPodcast(podcastId)

		try {
			const response = await fetch(`/api/admin/podcasts?id=${podcastId}`, {
				method: "DELETE",
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || "Failed to delete podcast")
			}

			setAvailablePodcasts(availablePodcasts.filter(p => p.podcast_id !== podcastId))
			toast.success("Podcast deleted successfully!")
		} catch (error) {
			console.error("Error deleting podcast:", error)
			toast.error(error instanceof Error ? error.message : "Failed to delete podcast")
		} finally {
			setIsDeletingPodcast(null)
		}
	}

	const togglePodcastActive = async (podcast: Podcast) => {
		try {
			const response = await fetch("/api/admin/podcasts", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: podcast.podcast_id,
					is_active: !podcast.is_active,
				}),
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || "Failed to update podcast")
			}

			const updatedPodcast = await response.json()
			setAvailablePodcasts(availablePodcasts.map(p => (p.podcast_id === updatedPodcast.podcast_id ? updatedPodcast : p)))
			toast.success(`Podcast ${updatedPodcast.is_active ? "activated" : "deactivated"} successfully!`)
		} catch (error) {
			console.error("Error updating podcast:", error)
			toast.error(error instanceof Error ? error.message : "Failed to update podcast")
		}
	}

	if (isCheckingAdmin) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<AppSpinner size="lg" label="Checking admin access..." />
			</div>
		)
	}

	if (adminStatus === false) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>Access Denied</CardTitle>
						<CardDescription>You don't have admin privileges to access this page.</CardDescription>
					</CardHeader>
				</Card>
			</div>
		)
	}

	if (isLoadingBundles) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<AppSpinner size="lg" label="Loading bundles..." />
			</div>
		)
	}

	const selectedBundle = bundles.find(b => b.bundle_id === selectedBundleId)

	// Group podcasts by category dynamically
	const podcastsByCategory = availablePodcasts.reduce(
		(acc, podcast) => {
			const category = podcast.category || "Uncategorized"
			if (!acc[category]) {
				acc[category] = []
			}
			acc[category].push(podcast)
			return acc
		},
		{} as Record<string, Podcast[]>
	)
	const categories = Object.keys(podcastsByCategory).sort()

	console.log("Available podcasts:", availablePodcasts.length)
	console.log("Categories:", categories)
	console.log("Podcasts by category:", podcastsByCategory)

	return (
		<div className="container mx-auto p-6 max-w-6xl">
			<div className="mb-8">
				<div className="flex items-center justify-between mb-4">
					<div>
						<h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
						<p className="text-muted-foreground">Manage curated content and generate weekly podcast episodes</p>
					</div>
				</div>
			</div>

			<Tabs defaultValue="episode-generation" className="space-y-6">
				<TabsList className="grid w-full grid-cols-4 bg-[var(--color-card-neutral)] border border-[var(--color-border)] h-12">
					<TabsTrigger
						value="episode-generation"
						className="data-[state=active]:bg-[var(--color-button-secondary-bg)] data-[state=active]:text-[var(--color-button-secondary-foreground)] text-muted-foreground hover:bg-[var(--color-accent)] hover:text-foreground"
					>
						Episode Generation
					</TabsTrigger>
					<TabsTrigger
						value="bundle-management"
						className="data-[state=active]:bg-[var(--color-button-secondary-bg)] data-[state=active]:text-[var(--color-button-secondary-foreground)] text-muted-foreground hover:bg-[var(--color-accent)] hover:text-foreground"
					>
						Bundle Management
					</TabsTrigger>
					<TabsTrigger
						value="podcast-management"
						className="data-[state=active]:bg-[var(--color-button-secondary-bg)] data-[state=active]:text-[var(--color-button-secondary-foreground)] text-muted-foreground hover:bg-[var(--color-accent)] hover:text-foreground"
					>
						Podcast Management
					</TabsTrigger>
					<TabsTrigger
						value="testing"
						className="data-[state=active]:bg-[var(--color-button-secondary-bg)] data-[state=active]:text-[var(--color-button-secondary-foreground)] text-muted-foreground hover:bg-[var(--color-accent)] hover:text-foreground"
					>
						Testing
					</TabsTrigger>
				</TabsList>

				{/* Episode Generation Tab */}
				<TabsContent value="episode-generation" className="space-y-6">
					<div className="flex gap-4 mb-4">
						<Button variant={episodeMode === "generate" ? "default" : "outline"} onClick={() => setEpisodeMode("generate")}>
							Generate Episode
						</Button>
						<Button variant={episodeMode === "upload" ? "default" : "outline"} onClick={() => setEpisodeMode("upload")}>
							Upload MP3
						</Button>
					</div>

					{episodeMode === "generate" ? (
						<div className="grid gap-6">
							{/* Step 1: Select Bundle */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
										Select Bundle
									</CardTitle>
									<CardDescription>Choose which curated bundle to generate an episode for</CardDescription>
								</CardHeader>
								<CardContent className="p-4">
									<Select onValueChange={setSelectedBundleId}>
										<SelectTrigger className="select-custom-trigger hover:select-custom-content-hover	">
											<SelectValue placeholder="Select a bundle..." />
										</SelectTrigger>
										<SelectContent className="select-custom-content">
											{bundles.map(bundle => (
												<SelectItem className="select-custom-item" key={bundle.bundle_id} value={bundle.bundle_id}>
													{bundle.name} ({bundle.podcasts.length} shows)
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									{selectedBundle && (
										<div className="mt-4 p-4 bg-muted rounded-lg">
											<h4 className="font-semibold mb-2">{selectedBundle.name}</h4>
											<p className="text-sm text-muted-foreground mb-3">{selectedBundle.description}</p>
											<div className="flex flex-wrap gap-2">
												{selectedBundle.podcasts.map(podcast => (
													<Badge size="sm" key={podcast.podcast_id} variant="outline">
														{podcast.name}
													</Badge>
												))}
											</div>
										</div>
									)}
								</CardContent>
							</Card>

							{/* Step 2: Episode Details */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
										Episode Details
									</CardTitle>
									<CardDescription>Provide basic information for the episode</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4 p-4">
									<div>
										<Label htmlFor="title">Episode Title *</Label>
										<Input id="title" value={episodeTitle} onChange={e => setEpisodeTitle(e.target.value)} placeholder="e.g., Tech Weekly - January 15, 2024" />
									</div>
									<div>
										<Label htmlFor="description">Episode Description (Optional)</Label>
										<Textarea
											id="description"
											value={episodeDescription}
											onChange={e => setEpisodeDescription(e.target.value)}
											placeholder="Brief description of this week's episode content..."
											rows={3}
										/>
									</div>
									<div>
										<Label htmlFor="episodeImageUrl">Episode Image URL (Optional)</Label>
										<Input id="episodeImageUrl" value={episodeImageUrl} onChange={e => setEpisodeImageUrl(e.target.value)} placeholder="https://images.unsplash.com/photo-... (direct image URL)" />
										<p className="text-xs text-muted-foreground mt-1">If not provided, the bundle's image will be used. Use direct image URLs for best results.</p>
									</div>
								</CardContent>
							</Card>

							{/* Step 3: Add Sources */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
										Add Episode Sources
									</CardTitle>
									<CardDescription>Add YouTube videos or other sources for each show in the bundle</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4 p-4	">
									{/* Add new source form */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<Label htmlFor="sourceName">Source Name</Label>
											<Input id="sourceName" value={newSourceName} onChange={e => setNewSourceName(e.target.value)} placeholder="e.g., Lex Fridman - AI Discussion" />
										</div>
										<div>
											<Label htmlFor="sourceUrl">Source URL</Label>
											<Input id="sourceUrl" value={newSourceUrl} onChange={e => setNewSourceUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
										</div>
									</div>
									<Button onClick={addSource} variant="outline" className="w-full">
										<Plus className="w-4 h-4 mr-2" />
										Add Source
									</Button>

									{/* Display added sources */}
									{sources.length > 0 && (
										<div className="space-y-2">
											<h4 className="font-semibold">Added Sources ({sources.length})</h4>
											{sources.map(source => (
												<div key={source.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
													<div>
														<p className="font-medium">{source.name}</p>
														<p className="text-sm text-muted-foreground truncate">{source.url}</p>
													</div>
													<Button onClick={() => removeSource(source.id)} variant="ghost" size="sm">
														<Trash2 className="w-4 h-4" />
													</Button>
												</div>
											))}
										</div>
									)}
								</CardContent>
							</Card>

							{/* Generate Button */}
							<Card>
								<Button onClick={generateEpisode} disabled={isLoading || !selectedBundleId || !episodeTitle || sources.length === 0} className="w-full" size="lg" variant={"default"}>
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
							</Card>
						</div>
					) : (
						<form onSubmit={uploadEpisode} className="space-y-4">
							{/* Step 1: Select Bundle */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
										Select Bundle
									</CardTitle>
									<CardDescription>Choose which curated bundle to upload an episode for</CardDescription>
								</CardHeader>
								<CardContent className="p-4">
									<Select value={selectedBundleId} onValueChange={setSelectedBundleId}>
										<SelectTrigger>
											<SelectValue placeholder="Select a bundle..." />
										</SelectTrigger>
										<SelectContent>
											{bundles.map(bundle => (
												<SelectItem key={bundle.bundle_id} value={bundle.bundle_id}>
													{bundle.name} ({bundle.podcasts.length} shows)
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									{selectedBundle && (
										<div className="mt-4 p-4 bg-muted rounded-lg">
											<h4 className="font-semibold mb-2">{selectedBundle.name}</h4>
											<p className="text-sm text-muted-foreground mb-3">{selectedBundle.description}</p>
											<div className="flex flex-wrap gap-2">
												{selectedBundle.podcasts.map(podcast => (
													<Badge size="sm" key={podcast.podcast_id} variant="outline">
														{podcast.name}
													</Badge>
												))}
											</div>
										</div>
									)}
								</CardContent>
							</Card>

							{/* Step 2: Episode Details */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
										Episode Details
									</CardTitle>
									<CardDescription>Provide basic information for the episode</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4 p-4">
									<div>
										<Label htmlFor="title">Episode Title *</Label>
										<Input id="title" value={episodeTitle} onChange={e => setEpisodeTitle(e.target.value)} placeholder="e.g., Tech Weekly - January 15, 2024" />
									</div>
									<div>
										<Label htmlFor="description">Episode Description (Optional)</Label>
										<Textarea
											id="description"
											value={episodeDescription}
											onChange={e => setEpisodeDescription(e.target.value)}
											placeholder="Brief description of this week's episode content..."
											rows={3}
										/>
									</div>
									<div>
										<Label htmlFor="episodeImageUrl">Episode Image URL (Optional)</Label>
										<Input id="episodeImageUrl" value={episodeImageUrl} onChange={e => setEpisodeImageUrl(e.target.value)} placeholder="https://images.unsplash.com/photo-... (direct image URL)" />
										<p className="text-xs text-muted-foreground mt-1">If not provided, the bundle's image will be used. Use direct image URLs for best results.</p>
									</div>
								</CardContent>
							</Card>

							{/* Step 3: Upload Audio */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
										Upload Audio
									</CardTitle>
									<CardDescription>Choose how to provide the episode audio</CardDescription>
								</CardHeader>
								<CardContent className="p-4">
									{/* Upload Method Toggle */}
									<div className="mb-4">
										<Label>Upload Method</Label>
										<div className="flex gap-2 mt-2">
											<Button type="button" variant={uploadMethod === "file" ? "default" : "outline"} size="sm" onClick={() => setUploadMethod("file")}>
												Upload File
											</Button>
											<Button type="button" variant={uploadMethod === "url" ? "default" : "outline"} size="sm" onClick={() => setUploadMethod("url")}>
												Direct URL
											</Button>
										</div>
									</div>

									{/* File Upload Option */}
									{uploadMethod === "file" && (
										<div>
											<Label htmlFor="mp3File">Audio File (MP3)</Label>
											<Input id="mp3File" type="file" accept="audio/mp3,audio/mpeg" ref={fileInputRef} onChange={e => setMp3File(e.target.files?.[0] || null)} />
											{mp3File && <div className="mt-2 text-sm text-muted-foreground">Selected file: {mp3File.name}</div>}
										</div>
									)}

									{/* URL Input Option */}
									{uploadMethod === "url" && (
										<div>
											<Label htmlFor="audioUrl">Audio URL</Label>
											<Input id="audioUrl" type="url" value={audioUrl} onChange={e => setAudioUrl(e.target.value)} placeholder="https://example.com/audio.mp3" />
											<p className="text-xs text-muted-foreground mt-1">Provide a direct link to the audio file (MP3 recommended)</p>
										</div>
									)}
								</CardContent>
							</Card>

							{/* Upload Button */}
							<Card>
								<CardContent className="pt-6 p-4">
									<Button
										type="submit"
										disabled={!(selectedBundleId && episodeTitle && ((uploadMethod === "file" && mp3File) || (uploadMethod === "url" && audioUrl))) || isLoading}
										className="w-full"
										size="lg"
										variant={"default"}
									>
										{isLoading ? (
											<>
												<AppSpinner size="sm" variant="simple" color="default" className="mr-2" />
												Uploading...
											</>
										) : (
											<>
												<Sparkles className="w-4 h-4 mr-2" />
												Upload Episode
											</>
										)}
									</Button>
								</CardContent>
							</Card>
						</form>
					)}
				</TabsContent>

				{/* Bundle Management Tab */}
				<TabsContent value="bundle-management" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FolderPlus className="w-5 h-5" />
								Bundle Management
							</CardTitle>
							<CardDescription>Create new bundles or remove existing ones</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4 p-4">
							<Button onClick={() => setShowCreateBundle(!showCreateBundle)} variant="outline" className="w-full">
								<Plus className="w-4 h-4 mr-2" />
								{showCreateBundle ? "Cancel" : "Create New Bundle"}
							</Button>

							{showCreateBundle && (
								<div className="space-y-4 p-4 border rounded-lg bg-card">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<Label htmlFor="bundleName">Bundle Name *</Label>
											<Input id="bundleName" value={newBundleName} onChange={e => setNewBundleName(e.target.value)} placeholder="e.g., Tech Weekly" />
										</div>
										<div>
											<Label htmlFor="bundleImageUrl">Image URL (Optional)</Label>
											<Input
												id="bundleImageUrl"
												value={newBundleImageUrl}
												onChange={e => setNewBundleImageUrl(e.target.value)}
												placeholder="https://images.unsplash.com/photo-... (direct image URL)"
											/>
											<p className="text-xs text-muted-foreground mt-1">Use direct image URLs (e.g., https://images.unsplash.com/photo-...)</p>
										</div>
									</div>

									<div>
										<Label htmlFor="bundleDescription">Bundle Description *</Label>
										<Textarea
											id="bundleDescription"
											value={newBundleDescription}
											onChange={e => setNewBundleDescription(e.target.value)}
											placeholder="Describe what this bundle is about..."
											rows={2}
										/>
									</div>

									<div>
										<Label>Select Podcasts *</Label>
										<div className="mt-2 max-h-60 overflow-y-auto border rounded-lg p-3 space-y-2">
											{availablePodcasts
												.filter(p => p.is_active)
												.map(podcast => (
													<div key={podcast.podcast_id} className="flex items-start space-x-2">
														<Checkbox
															id={`bundle-podcast-${podcast.podcast_id}`}
															checked={selectedPodcastIds.includes(podcast.podcast_id)}
															onCheckedChange={() => togglePodcastSelection(podcast.podcast_id)}
														/>
														<div className="flex-1">
															<label htmlFor={`bundle-podcast-${podcast.podcast_id}`} className="text-sm font-medium cursor-pointer">
																{podcast.name}
															</label>
															<p className="text-xs text-muted-foreground">{podcast.description}</p>
															<Badge size="sm" variant="secondary" className="text-xs mt-1">
																{podcast.category}
															</Badge>
														</div>
													</div>
												))}
										</div>
										<p className="text-xs text-muted-foreground mt-1">Selected: {selectedPodcastIds.length} podcasts</p>
									</div>

									<Button onClick={createBundle} disabled={isCreatingBundle} className="w-full" variant={"default"}>
										{isCreatingBundle ? (
											<>
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
												Creating Bundle...
											</>
										) : (
											<>
												<Plus className="w-4 h-4 mr-2" />
												Create Bundle
											</>
										)}
									</Button>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Existing Bundles */}
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
													{bundle.podcasts.map(podcast => (
														<Badge size="sm" key={podcast.podcast_id} variant="outline" className="text-xs">
															{podcast.name}
														</Badge>
													))}
												</div>
											</div>
											<Button
												onClick={() => deleteBundle(bundle.bundle_id)}
												disabled={isDeletingBundle === bundle.bundle_id}
												variant="ghost"
												size="sm"
												className="text-destructive hover:text-destructive hover:bg-destructive/10"
											>
												{isDeletingBundle === bundle.bundle_id ? <AppSpinner size="sm" variant="simple" /> : <Trash2 className="w-4 h-4" />}
											</Button>
										</div>
									</div>
								))}
								{bundles.length === 0 && <p className="text-center text-muted-foreground py-8">No bundles created yet. Create your first bundle above.</p>}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Podcast Management Tab */}
				<TabsContent value="podcast-management" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Mic className="w-5 h-5" />
									Podcast Management
								</div>
								<div className="flex gap-2">
									<Button onClick={refreshPodcasts} variant="outline" size="sm">
										Refresh
									</Button>
									<Button
										onClick={async () => {
											try {
												const response = await fetch("/api/admin/fix-podcasts", { method: "POST" })
												const result = await response.json()
												if (result.success) {
													toast.success(result.message)
													refreshPodcasts()
												} else {
													toast.error("Failed to fix podcasts")
												}
											} catch (error) {
												console.error("Error fixing podcasts:", error)
												toast.error("Failed to fix podcasts")
											}
										}}
										variant="outline"
										size="sm"
									>
										Fix Global
									</Button>
								</div>
							</CardTitle>
							<CardDescription>Create, edit, and manage curated podcasts</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4 p-4">
							<div className="p-4 bg-muted rounded-lg">
								<h4 className="font-semibold mb-2">Create New Bundle</h4>
								<p className="text-sm text-muted-foreground mb-4">Create a new bundle to group related podcasts together.</p>
							</div>
							<Button
								onClick={() => {
									resetPodcastForm()
									setShowCreatePodcast(!showCreatePodcast)
								}}
								variant="outline"
								className="w-full"
							>
								<Plus className="w-4 h-4 mr-2" />
								{showCreatePodcast ? "Cancel" : "Create New Podcast"}
							</Button>

							{showCreatePodcast && (
								<div className="space-y-4 p-4 border rounded-lg bg-background">
									<div className="flex items-center justify-between mb-4">
										<h4 className="font-semibold">{editingPodcast ? "Edit Podcast" : "Create New Podcast"}</h4>
										{editingPodcast && (
											<Button onClick={resetPodcastForm} variant="ghost" size="sm">
												<X className="w-4 h-4" />
											</Button>
										)}
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<Label htmlFor="podcastName">Podcast Name *</Label>
											<Input id="podcastName" value={newPodcastName} onChange={e => setNewPodcastName(e.target.value)} placeholder="e.g., Lex Fridman Podcast" />
										</div>
										<div>
											<Label htmlFor="podcastCategory">Category *</Label>
											<Input id="podcastCategory" value={newPodcastCategory} onChange={e => setNewPodcastCategory(e.target.value)} placeholder="e.g., Technology, Health, Comedy, etc." />
										</div>
									</div>

									<div>
										<Label htmlFor="podcastUrl">Podcast URL *</Label>
										<Input id="podcastUrl" value={newPodcastUrl} onChange={e => setNewPodcastUrl(e.target.value)} placeholder="https://www.youtube.com/@example" />
									</div>

									<div>
										<Label htmlFor="podcastImageUrl">Image URL (Optional)</Label>
										<Input id="podcastImageUrl" value={newPodcastImageUrl} onChange={e => setNewPodcastImageUrl(e.target.value)} placeholder="https://images.unsplash.com/..." />
									</div>

									<div>
										<Label htmlFor="podcastDescription">Description *</Label>
										<Textarea
											id="podcastDescription"
											value={newPodcastDescription}
											onChange={e => setNewPodcastDescription(e.target.value)}
											placeholder="Brief description of this podcast..."
											rows={3}
										/>
									</div>

									<Button onClick={editingPodcast ? updatePodcast : createPodcast} disabled={isCreatingPodcast || isUpdatingPodcast} className="w-full" variant={"default"}>
										{isCreatingPodcast || isUpdatingPodcast ? (
											<>
												<AppSpinner size="sm" variant="simple" color="default" className="mr-2" />
												{editingPodcast ? "Updating..." : "Creating..."}
											</>
										) : editingPodcast ? (
											<>
												<Edit className="w-4 h-4 mr-2" />
												Update Podcast
											</>
										) : (
											<>
												<Plus className="w-4 h-4 mr-2" />
												Create Podcast
											</>
										)}
									</Button>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Existing Podcasts by Category */}
					{categories.map((category, index) => (
						<Card key={`category-${category}-${index}-${podcastsByCategory[category].length}`}>
							<CardHeader>
								<CardTitle className="flex items-center justify-between">
									<span>
										{category} Podcasts ({podcastsByCategory[category].length})
									</span>
									<Badge size="sm" variant="outline">
										{category}
									</Badge>
								</CardTitle>
							</CardHeader>
							<CardContent className="p-4">
								<div className="space-y-3">
									{podcastsByCategory[category].map(podcast => (
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
												<Button onClick={() => togglePodcastActive(podcast)} variant="ghost" size="sm" title={podcast.is_active ? "Deactivate" : "Activate"}>
													{podcast.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
												</Button>
												<Button onClick={() => startEditPodcast(podcast)} variant="ghost" size="sm" title="Edit">
													<Edit className="w-4 h-4" />
												</Button>
												<Button
													onClick={() => deletePodcast(podcast.podcast_id)}
													disabled={isDeletingPodcast === podcast.podcast_id}
													variant="ghost"
													size="sm"
													className="text-destructive hover:text-destructive hover:bg-destructive/10"
													title="Delete"
												>
													{isDeletingPodcast === podcast.podcast_id ? <AppSpinner size="sm" variant="simple" /> : <Trash2 className="w-4 h-4" />}
												</Button>
											</div>
										</div>
									))}
									{podcastsByCategory[category].length === 0 && <p className="text-center text-muted-foreground py-4">No {category.toLowerCase()} podcasts yet.</p>}
								</div>
							</CardContent>
						</Card>
					))}
				</TabsContent>

				{/* Testing Tab */}
				<TabsContent value="testing" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Sparkles className="w-5 h-5" />
								Notification Testing
							</CardTitle>
							<CardDescription>Test the notification system by creating sample notifications</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4 p-4">
							<div className="p-4 bg-muted rounded-lg">
								<h4 className="font-semibold mb-2">Test Notification System</h4>
								<p className="text-sm text-muted-foreground mb-4">This will create a test notification that you can see in the notification bell and notifications page.</p>
								<Button
									onClick={async () => {
										try {
											const response = await fetch("/api/notifications/test", {
												method: "POST",
											})
											if (!response.ok) {
												throw new Error("Failed to create test notification")
											}
											toast.success("Test notification created! Check your notification bell.")
										} catch (error) {
											console.error("Error creating test notification:", error)
											toast.error("Failed to create test notification")
										}
									}}
									variant="outline"
									className="w-full mb-2"
								>
									<Sparkles className="w-4 h-4 mr-2" />
									Create Test Notification
								</Button>
								<Button
									onClick={async () => {
										try {
											const response = await fetch("/api/notifications/verify-email-config")
											if (!response.ok) {
												throw new Error("Failed to verify email config")
											}
											const result = await response.json()
											if (result.success) {
												toast.success("✅ Email configuration verified successfully!")
											} else {
												toast.error(`❌ Email config error: ${result.error}`)
												console.error("Email config details:", result)
											}
										} catch (error) {
											console.error("Error verifying email config:", error)
											toast.error("Failed to verify email configuration")
										}
									}}
									variant="outline"
									className="w-full mb-2"
								>
									<Sparkles className="w-4 h-4 mr-2" />
									Verify Email Config
								</Button>
								<Button
									onClick={async () => {
										try {
											const response = await fetch("/api/notifications/test-email", {
												method: "POST",
											})
											if (!response.ok) {
												throw new Error("Failed to send test email")
											}
											toast.success("Test email sent! Check your email inbox.")
										} catch (error) {
											console.error("Error sending test email:", error)
											toast.error("Failed to send test email")
										}
									}}
									variant="outline"
									className="w-full"
								>
									<Sparkles className="w-4 h-4 mr-2" />
									Send Test Email
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
