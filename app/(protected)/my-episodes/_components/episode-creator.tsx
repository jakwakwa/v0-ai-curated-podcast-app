"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VOICE_OPTIONS } from "@/lib/constants/voices"

const EPISODE_LIMIT = 10

export function EpisodeCreator() {
	const router = useRouter()

	// Unified single form
	const [title, setTitle] = useState("")
	const [podcastName, setPodcastName] = useState("")
	const [publishedDate, setPublishedDate] = useState("")
	const [youtubeUrl, setYouTubeUrl] = useState("")
	const [lang, setLang] = useState("")

	// Generation options
	const [generationMode, setGenerationMode] = useState<"single" | "multi">("single")
	const [voiceA, setVoiceA] = useState<string>("Zephyr")
	const [voiceB, setVoiceB] = useState<string>("Puck")

	// UX
	const [isCreating, setIsCreating] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [usage, setUsage] = useState({ count: 0, limit: EPISODE_LIMIT })
	const [isLoadingUsage, setIsLoadingUsage] = useState(true)

	const isBusy = isCreating
	const canSubmit = Boolean(title) && !isBusy

	useEffect(() => {
		const fetchUsage = async () => {
			try {
				setIsLoadingUsage(true)
				const res = await fetch("/api/user-episodes?count=true")
				if (res.ok) {
					const { count } = await res.json()
					setUsage({ count, limit: EPISODE_LIMIT })
				}
			} catch (error) {
				console.error("Failed to fetch user episodes data:", error)
			} finally {
				setIsLoadingUsage(false)
			}
		}
		fetchUsage()
	}, [])

	async function handleCreate() {
		setIsCreating(true)
		setError(null)
		try {
			const payload = {
				title,
				podcastName: podcastName || undefined,
				publishedAt: publishedDate || undefined,
				youtubeUrl: youtubeUrl || undefined,
				lang: lang || undefined,
				generationMode,
				voiceA,
				voiceB,
			}
			const res = await fetch("/api/user-episodes/create-from-metadata", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			})
			if (!res.ok) throw new Error(await res.text())
			toast.message("We’re searching for the episode and transcribing it. We’ll email you when it’s ready.")
			router.push("/curation-profile-management")
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to start metadata flow")
		} finally {
			setIsCreating(false)
		}
	}

	const hasReachedLimit = usage.count >= usage.limit

	return (
		<div className="w-full lg:w/full lg:min-w-screen/[70%] h-auto mb-0 mt-4 px-12">
			<Card>
				<CardHeader>
					<CardTitle>Create New Episode</CardTitle>
					<CardDescription>Provide episode details. We’ll resolve sources and transcribe in the background.</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoadingUsage ? (
						<p>Loading usage data...</p>
					) : hasReachedLimit ? (
						<p className="text-red-500">You have reached your monthly limit for episode creation.</p>
					) : (
						<form className="space-y-6" onSubmit={e => { e.preventDefault(); void handleCreate() }}>
							<div className="space-y-2">
								<Label htmlFor="title">Episode Title</Label>
								<Input id="title" placeholder="Exact episode title" value={title} onChange={e => setTitle(e.target.value)} disabled={isBusy} required />
							</div>

							<div className="space-y-2">
								<Label htmlFor="podcastName">Podcast Name (optional)</Label>
								<Input id="podcastName" placeholder="Podcast show name" value={podcastName} onChange={e => setPodcastName(e.target.value)} disabled={isBusy} />
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="publishedDate">Published Date (optional)</Label>
									<Input id="publishedDate" type="date" value={publishedDate} onChange={e => setPublishedDate(e.target.value)} disabled={isBusy} />
								</div>
								<div className="space-y-2">
									<Label htmlFor="youtubeUrl">YouTube URL (optional)</Label>
									<Input id="youtubeUrl" placeholder="https://www.youtube.com/watch?v=..." value={youtubeUrl} onChange={e => setYouTubeUrl(e.target.value)} disabled={isBusy} />
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="lang">Preferred language (optional)</Label>
								<Input id="lang" placeholder="en" value={lang} onChange={e => setLang(e.target.value)} disabled={isBusy} />
							</div>

							<div className="space-y-2">
								<Label>Episode Type</Label>
								<div className="grid grid-cols-2 gap-2">
									<Button type="button" variant={generationMode === "single" ? "default" : "secondary"} onClick={() => setGenerationMode("single")} disabled={isBusy}>Single speaker</Button>
									<Button type="button" variant={generationMode === "multi" ? "default" : "secondary"} onClick={() => setGenerationMode("multi")} disabled={isBusy}>Multi speaker</Button>
								</div>
							</div>

							{generationMode === "multi" && (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label>Voice A</Label>
										<Select value={voiceA} onValueChange={setVoiceA}>
											<SelectTrigger className="w/full" disabled={isBusy}>
												<SelectValue placeholder="Select Voice A" />
											</SelectTrigger>
											<SelectContent>
												{VOICE_OPTIONS.map(v => (
													<SelectItem key={v.name} value={v.name}>{v.label}</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label>Voice B</Label>
										<Select value={voiceB} onValueChange={setVoiceB}>
											<SelectTrigger className="w/full" disabled={isBusy}>
												<SelectValue placeholder="Select Voice B" />
											</SelectTrigger>
											<SelectContent>
												{VOICE_OPTIONS.map(v => (
													<SelectItem key={v.name} value={v.name}>{v.label}</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							)}

							<Button type="submit" variant="default" disabled={!canSubmit} className="w-full">{isCreating ? "Creating..." : "Create & Generate"}</Button>
						</form>
					)}
					{error && <p className="text-red-500 mt-4">{error}</p>}
				</CardContent>
			</Card>
		</div>
	)
}
