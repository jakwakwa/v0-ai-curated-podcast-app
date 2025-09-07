"use client"

import { PlayCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VOICE_OPTIONS } from "@/lib/constants/voices"

const EPISODE_LIMIT = 20

export function EpisodeCreator() {
	const router = useRouter()

	// Unified single form
	const [title, setTitle] = useState("")
	const [podcastName, setPodcastName] = useState("")
	const [publishedDate, setPublishedDate] = useState("")
	const [youtubeUrl, setYouTubeUrl] = useState("")
	const [lang, _setLang] = useState("")

	// Generation options
	const [generationMode, setGenerationMode] = useState<"single" | "multi">("single")
	const [voiceA, setVoiceA] = useState<string>("Zephyr")
	const [voiceB, setVoiceB] = useState<string>("Kore")
	const [isPlaying, setIsPlaying] = useState<string | null>(null)
	const [audioUrlCache, setAudioUrlCache] = useState<Record<string, string>>({})

	// UX
	const [isCreating, setIsCreating] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [usage, setUsage] = useState({ count: 0, limit: EPISODE_LIMIT })
	const [isLoadingUsage, setIsLoadingUsage] = useState(true)

	const isBusy = isCreating
	const isAudioPlaying = isPlaying !== null
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

	async function playSample(voiceName: string) {
		try {
			setIsPlaying(voiceName)
			const cached = audioUrlCache[voiceName]
			let url = cached
			if (!url) {
				const res = await fetch(`/api/tts/voice-sample?voice=${encodeURIComponent(voiceName)}`)
				if (!res.ok) throw new Error(await res.text())
				const blob = await res.blob()
				url = URL.createObjectURL(blob)
				setAudioUrlCache(prev => ({ ...prev, [voiceName]: url }))
			}
			const audio = new Audio(url)
			audio.onended = () => setIsPlaying(null)
			await audio.play()
		} catch (err) {
			setIsPlaying(null)
			console.error("Failed to play sample", err)
			toast.error("Could not load voice sample")
		}
	}

	const hasReachedLimit = usage.count >= usage.limit

	return (
		<div className="episode-card-wrapper w-full lg:w/full lg:min-w-screen/[70%] h-auto mb-0 mt-4 px-0 md:px-12">
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
						<form
							className="space-y-6"
							onSubmit={e => {
								e.preventDefault()
								void handleCreate()
							}}>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="title">Episode Title</Label>
									<Input id="title" placeholder="Exact episode title" value={title} onChange={e => setTitle(e.target.value)} disabled={isBusy} required />
								</div>
								<div className="space-y-2">
									<Label htmlFor="podcastName">Podcast Name</Label>
									<Input id="podcastName" placeholder="Podcast show name" value={podcastName} onChange={e => setPodcastName(e.target.value)} disabled={isBusy} />
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="publishedDate">Published Date</Label>
									<Input id="publishedDate" type="date" value={publishedDate} onChange={e => setPublishedDate(e.target.value)} disabled={isBusy} />
								</div>
								<div className="space-y-2">
									<Label htmlFor="youtubeUrl">YouTube URL (required)</Label>
									<Input id="youtubeUrl" placeholder="https://www.youtube.com/watch?v=..." value={youtubeUrl} onChange={e => setYouTubeUrl(e.target.value)} disabled={isBusy} />
								</div>
							</div>

							<div className="space-y-2">
								<Label>Episode Type</Label>
								<div className="md:max-w-1/2 grid grid-cols-2 gap-2 ">
									<Button type="button" variant={generationMode === "single" ? "default" : "outline"} onClick={() => setGenerationMode("single")} disabled={isBusy} size="md">
										Single speaker
									</Button>
									<Button type="button" variant={generationMode === "multi" ? "default" : "outline"} onClick={() => setGenerationMode("multi")} disabled={isBusy} size="lg">
										Multi speaker
									</Button>
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
													<SelectItem key={v.name} value={v.name}>
														<div className="flex items-center justify-between w/full gap-3">
															<div className="flex flex-col">
																<span>{v.label}</span>
																{/* <span className="text-xs opacity-75">{v.sample}</span> */}
															</div>
															<button
																type="button"
																onMouseDown={e => e.preventDefault()}
																onClick={e => {
																	e.stopPropagation()
																	void playSample(v.name)
																}}
																aria-label={`Play ${v.name} sample`}
																className="inline-flex items-center gap-1 text-xs opacity-80 hover:opacity-100">

															</button>
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<div className="mt-2">
											<Button type="button" variant="outline" size="sm" onClick={() => void playSample(voiceA)} disabled={isBusy || isAudioPlaying}>
												<PlayCircle className="mr-2 h-4 w-4" /> {isPlaying === voiceA ? "Playing" : "Play sample"}
											</Button>
										</div>
									</div>
									<div>
										<Label>Voice B</Label>
										<Select value={voiceB} onValueChange={setVoiceB}>
											<SelectTrigger className="w/full" disabled={isBusy}>
												<SelectValue placeholder="Select Voice B" />
											</SelectTrigger>
											<SelectContent>
												{VOICE_OPTIONS.map(v => (
													<SelectItem key={v.name} value={v.name}>
														<div className="flex items-center justify-between w/full gap-3">
															<div className="flex flex-col">
																<span>{v.label}</span>
																{/* <span className="text-xs opacity-75">{v.sample}</span> */}
															</div>
															<button
																type="button"
																onMouseDown={e => e.preventDefault()}
																onClick={e => {
																	e.stopPropagation()
																	void playSample(v.name)
																}}
																aria-label={`Play ${v.name} sample`}
																className="inline-flex items-center gap-1 text-xs opacity-80 hover:opacity-100">

															</button>
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<div className="mt-2">
											<Button type="button" variant="outline" size="sm" onClick={() => void playSample(voiceB)} disabled={isBusy || isAudioPlaying}>
												<PlayCircle className="mr-2 h-4 w-4" /> {isPlaying === voiceB ? "Playing" : "Play sample"}
											</Button>
										</div>
									</div>
								</div>
							)}

							<Button type="submit" variant="default" disabled={!canSubmit} className="w-full">
								{isCreating ? "Creating..." : "Create & Generate"}
							</Button>
						</form>
					)}
					{error && <p className="text-red-500 mt-4">{error}</p>}
				</CardContent>
			</Card>
		</div>
	)
}
