"use client"

import { Recycle, Speech } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Typography } from "@/components/ui/typography"
import { extractYouTubeTranscript } from "@/lib/client-youtube-transcript"
import { VOICE_OPTIONS } from "@/lib/constants/voices"

const EPISODE_LIMIT = 10 // Assuming a limit of 10 for now

export function EpisodeCreator() {
	const router = useRouter()
	const [youtubeUrl, setYoutubeUrl] = useState("")
	const [mode, setMode] = useState<"byUrl" | "byMetadata">("byUrl")
	const [metaTitle, setMetaTitle] = useState("")
	const [metaPodcast, setMetaPodcast] = useState("")
	const [metaDate, setMetaDate] = useState("")
	const [episodeTitle, setEpisodeTitle] = useState("")
	const [transcript, setTranscript] = useState<string>("")
	const [manualTranscript, setManualTranscript] = useState<string>("")
	const [transcriptMethod, setTranscriptMethod] = useState<"auto" | "manual">("auto")
	const [extractionMethod, setExtractionMethod] = useState<string>("")
	const [isFetchingTitle, setIsFetchingTitle] = useState(false)
	const [isFetchingTranscript, setIsFetchingTranscript] = useState(false)
	const [isCreating, setIsCreating] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)
	const [usage, setUsage] = useState({ count: 0, limit: EPISODE_LIMIT })
	const [isLoadingUsage, setIsLoadingUsage] = useState(true)
	const [generationMode, setGenerationMode] = useState<"single" | "multi">("single")
	const [voiceA, setVoiceA] = useState<string>("Zephyr")
	const [voiceB, setVoiceB] = useState<string>("Puck")
	const [useShort, _setUseShort] = useState<boolean>(true)
	const [allowPaid, setAllowPaid] = useState<boolean>(true)
	const [attempts, setAttempts] = useState<Array<{ provider: string; success: boolean; error?: string }>>([])

	const _showDevFlags = useMemo(() => process.env.NEXT_PUBLIC_SHOW_DEV_EPISODE_FLAGS === "true", [])

	type CreatePayload = {
		youtubeUrl: string
		episodeTitle: string
		transcript: string
		generationMode: "single" | "multi"
		voiceA?: string
		voiceB?: string
		useShortEpisodesOverride?: boolean
	}

	type ExtractResult =
		| { success: true; transcript: string; method: "captions" | "orchestrator" | "unknown" }
		| { success: false; error: string; method: "none" | "captions" | "orchestrator" | "unknown" }

	const isYouTubeUrl = useCallback((url: string): boolean => {
		return url.includes("youtube.com") || url.includes("youtu.be")
	}, [])

	const extractViaOrchestrator = useCallback(async (url: string, usePaid: boolean) => {
		const qs = new URLSearchParams({ url })
		if (usePaid) qs.set("allowPaid", "true")
		const res = await fetch(`/api/transcripts/get?${qs.toString()}`)
		if (!res.ok) {
			try {
				const data = await res.json()
				setAttempts(Array.isArray(data?.attempts) ? data.attempts : [])
				return { success: false, error: data?.error || "Transcript not available" }
			} catch {
				return { success: false, error: await res.text() }
			}
		}
		const data = await res.json()
		setAttempts(Array.isArray(data?.attempts) ? data.attempts : [])
		return data as { success: true; transcript: string }
	}, [])

	// Transcript extraction: Client captions first (YouTube), then orchestrator (paid providers)
	const extractTranscriptWithFallbacks = useCallback(
		async (url: string): Promise<ExtractResult> => {
			if (isYouTubeUrl(url)) {
				try {
					const clientData = await extractYouTubeTranscript(url)
					if (clientData.success && clientData.transcript) {
						return { success: true, transcript: clientData.transcript, method: "captions" }
					}
				} catch { }
			}
			const orch = await extractViaOrchestrator(url, allowPaid)
			if ((orch as { success?: boolean }).success) return { success: true, transcript: (orch as { transcript: string }).transcript, method: "orchestrator" }
			return { success: false, error: (orch as { error?: string }).error || "All transcript methods failed", method: "none" }
		},
		[allowPaid, extractViaOrchestrator, isYouTubeUrl]
	)

	const lastProcessedUrlRef = useRef<string | null>(null)

	useEffect(() => {
		const fetchUsage = async () => {
			try {
				setIsLoadingUsage(true)
				const res = await fetch("/api/user-episodes?count=true")
				if (res.ok) {
					const { count } = await res.json()
					setUsage({ count: count, limit: EPISODE_LIMIT })
				}
			} catch (error) {
				console.error("Failed to fetch user episodes data:", error)
			} finally {
				setIsLoadingUsage(false)
			}
		}
		fetchUsage()
	}, [])

	useEffect(() => {
		const handler = setTimeout(async () => {
			const trimmedUrl = youtubeUrl.trim()
			if (!trimmedUrl) {
				lastProcessedUrlRef.current = null
				setTranscript("")
				setEpisodeTitle("")
				setError(null)
				setAttempts([])
				return
			}

			// Avoid duplicate processing for the same URL
			if (lastProcessedUrlRef.current === trimmedUrl) {
				return
			}
			lastProcessedUrlRef.current = trimmedUrl

			try {
				setIsFetchingTitle(true)
				setIsFetchingTranscript(true)
				setError(null)
				setAttempts([])
				// Only fetch YouTube title for YouTube links
				const titlePromise = isYouTubeUrl(trimmedUrl)
					? fetch(`/api/youtube-metadata?url=${encodeURIComponent(trimmedUrl)}`)
						.then(res => (res.ok ? res.json() : null))
						.then(data => data?.title || "")
						.catch(() => "")
					: Promise.resolve("")
				const transcriptPromise = extractTranscriptWithFallbacks(trimmedUrl)
				const [title, transcriptResult] = await Promise.all([titlePromise, transcriptPromise])
				setEpisodeTitle(title)
				if (transcriptResult.success) {
					setTranscript(transcriptResult.transcript)
					setExtractionMethod(transcriptResult.method || "unknown")
				} else {
					setTranscript("")
					setExtractionMethod("")
					setError(transcriptResult.error || "Failed to extract transcript.")
				}
			} catch {
				setTranscript("")
				setError("Failed to fetch data. Please check the URL.")
			} finally {
				setIsFetchingTitle(false)
				setIsFetchingTranscript(false)
			}
		}, 1000)
		return () => {
			clearTimeout(handler)
		}
	}, [youtubeUrl, extractTranscriptWithFallbacks, isYouTubeUrl])

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsCreating(true)
		setError(null)
		setSuccessMessage(null)
		try {
			const finalTranscript = transcriptMethod === "manual" ? manualTranscript : transcript
			const payload: CreatePayload = { youtubeUrl, episodeTitle, transcript: finalTranscript, generationMode }
			if (generationMode === "multi") {
				payload.voiceA = voiceA
				payload.voiceB = voiceB
				payload.useShortEpisodesOverride = useShort
			}
			const res = await fetch("/api/user-episodes/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
			if (!res.ok) {
				const errorData = await res.text()
				throw new Error(errorData || "Failed to create episode.")
			}
			toast.message("The episode is generating in the background, we will notify you in 2 - 5 mins when its completed and ready to listen to")
			router.push("/curation-profile-management")
		} catch (err) {
			setError(err instanceof Error ? err.message : "An unknown error occurred.")
		} finally {
			setIsCreating(false)
		}
	}

	const hasReachedLimit = usage.count >= usage.limit
	const hasValidTranscript = transcriptMethod === "manual" ? manualTranscript && manualTranscript.trim().length > 0 : transcript && transcript.trim().length > 0
	const isBusy = isCreating || isFetchingTitle || isFetchingTranscript
	const canSubmitUrl = youtubeUrl && episodeTitle && hasValidTranscript && !isBusy
	const canSubmitMeta = metaTitle && !isBusy

	return (
		<div className="w-full lg:w-full lg:min-w-screen/[60%] lg:max-w-[1200px] h-auto mb-0 mt-4 px-12">
			<Card variant="default">
				<CardHeader>
					<CardTitle>Create New Episode</CardTitle>
					<CardDescription>Enter a YouTube, podcast page, or RSS URL. We’ll resolve transcripts and fallbacks automatically.</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoadingUsage ? (
						<p>Loading usage data...</p>
					) : hasReachedLimit ? (
						<p className="text-red-500">You have reached your monthly limit for episode creation.</p>
					) : (
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-2">
								<Label>Creation Mode</Label>

								<Tabs value={mode} onValueChange={value => setMode(value as "byUrl" | "byMetadata")}>
									<TabsList className="bg-dark flex items-center w-full grid-cols-2">
										<TabsTrigger className="btn-custom-toggle h-2" value="byUrl">
											By URL
										</TabsTrigger>
										<TabsTrigger className="bg-accent" value="byMetadata">
											By Metadata
										</TabsTrigger>
									</TabsList>
								</Tabs>
							</div>

							{mode === "byUrl" && (
								<>
									<div className="space-y-2">
										<Label htmlFor="youtubeUrl">Source URL</Label>
										<Input
											id="youtubeUrl"
											placeholder="https://www.youtube.com/watch?v=... or https://example.com/feed.rss"
											value={youtubeUrl}
											onChange={e => setYoutubeUrl(e.target.value)}
											disabled={isCreating || isFetchingTitle || isFetchingTranscript}
											required
										/>
									</div>

									<div className="flex items-center gap-2">
										<input id="allowPaid" type="checkbox" checked={allowPaid} onChange={e => setAllowPaid(e.target.checked)} disabled={isCreating || isFetchingTitle || isFetchingTranscript} />
										<Label htmlFor="allowPaid">Use paid transcription (AssemblyAI/Rev.ai) when needed</Label>
									</div>

									<div className="space-y-2">
										<Label htmlFor="episodeTitle">Episode Title</Label>
										<Input
											id="episodeTitle"
											placeholder={isYouTubeUrl(youtubeUrl) ? "Episode title will be fetched automatically" : "Optional title"}
											value={episodeTitle}
											onChange={e => setEpisodeTitle(e.target.value)}
											disabled={isCreating || isFetchingTitle || isFetchingTranscript}
											required
										/>
									</div>

									<div className="space-y-4">
										<Label>Transcript Source</Label>
										<Tabs value={transcriptMethod} onValueChange={value => setTranscriptMethod(value as "auto" | "manual")}>
											<TabsList className="grid w-full grid-cols-2">
												<TabsTrigger value="auto" disabled={isCreating || isFetchingTitle || isFetchingTranscript}>
													Auto Extract
												</TabsTrigger>
												<TabsTrigger value="manual" disabled={isCreating || isFetchingTitle || isFetchingTranscript}>
													Manual Input
												</TabsTrigger>
											</TabsList>

											<TabsContent value="auto" className="space-y-2">
												<div className=" text-red-400">
													{isFetchingTranscript ? (
														<Typography className="text-custom-xs text-blue-600"><Recycle /> Extracting transcript...</Typography>
													) : transcript && transcript.trim().length > 0 ? (
														<Typography className="text-green-600">
															✓ Transcript extracted ({transcript.length} characters) via {extractionMethod}
														</Typography>
													) : youtubeUrl && !isFetchingTranscript ? (
														<Typography className="text-custom-xxs text-red-500">✗ Could not extract transcript automatically. Try Manual Input or enable paid fallback.</Typography>
													) : (
														<Typography as="p" className="text-custom-xs">
															Enter a URL above to auto-extract transcript
														</Typography>
													)}
												</div>
												{attempts && attempts.length > 0 && (
													<div className="mt-2 text-xs text-gray-600">
														<Label className="text-xs text-gray-500">Attempts:</Label>
														<ul className="list-disc pl-5">
															{attempts.map((a, idx) => (
																<li key={idx}>
																	{a.provider}: {a.success ? "ok" : `fail${a.error ? ` (${a.error})` : ""}`}
																</li>
															))}
														</ul>
													</div>
												)}
												{transcript && (
													<div className="mt-2">
														<Label className="text-xs text-gray-500">Preview:</Label>
														<div className="text-xs bg-gray-50 p-2 rounded max-h-20 overflow-y-auto">{transcript.substring(0, 200)}...</div>
													</div>
												)}
											</TabsContent>

											<TabsContent value="manual" className="space-y-2">
												<Label htmlFor="manualTranscript" className="text-sm">
													Paste transcript text here
												</Label>
												<Textarea
													id="manualTranscript"
													placeholder="Paste the video transcript here..."
													value={manualTranscript}
													onChange={e => setManualTranscript(e.target.value)}
													disabled={isCreating || isFetchingTitle || isFetchingTranscript}
													rows={6}
													className="resize-none"
												/>
												{manualTranscript && <div className="text-xs text-gray-500">{manualTranscript.length} characters</div>}
											</TabsContent>
										</Tabs>
									</div>

									<div className="space-y-2">
										<Label>Episode Type</Label>
										<div className="grid grid-cols-2 gap-2">
											<Button
												type="button"
												variant={generationMode === "single" ? "default" : "secondary"}
												onClick={() => setGenerationMode("single")}
												disabled={isCreating || isFetchingTitle || isFetchingTranscript}>
												Single speaker
											</Button>
											<Button
												type="button"
												variant={generationMode === "multi" ? "default" : "secondary"}
												onClick={() => setGenerationMode("multi")}
												disabled={isCreating || isFetchingTitle || isFetchingTranscript}>
												Multi speaker
											</Button>
										</div>
									</div>

									{generationMode === "multi" && (
										<div className="space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<Label>Voice A</Label>
													<Select value={voiceA} onValueChange={setVoiceA}>
														<SelectTrigger className="w/full" disabled={isCreating || isFetchingTitle || isFetchingTranscript}>
															<SelectValue placeholder="Select Voice A" />
														</SelectTrigger>
														<SelectContent>
															{VOICE_OPTIONS.map(v => (
																<SelectItem key={v.name} value={v.name}>
																	{v.label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
												<div>
													<Label>Voice B</Label>
													<Select value={voiceB} onValueChange={setVoiceB}>
														<SelectTrigger className="w/full" disabled={isCreating || isFetchingTitle || isFetchingTranscript}>
															<SelectValue placeholder="Select Voice B" />
														</SelectTrigger>
														<SelectContent>
															{VOICE_OPTIONS.map(v => (
																<SelectItem key={v.name} value={v.name}>
																	{v.label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
											</div>
										</div>
									)}

									<Button variant="default" type="submit" disabled={!canSubmitUrl} className="w-full">
										{isCreating ? "Generating..." : "Generate Episode"}
									</Button>
								</>
							)}

							{mode === "byMetadata" && (
								<>
									<div className="space-y-2">
										<Label htmlFor="metaTitle">Episode Title</Label>
										<Input id="metaTitle" placeholder="Exact episode title" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} disabled={isBusy} required />
									</div>
									<div className="space-y-2">
										<Label htmlFor="metaPodcast">Podcast Name (optional)</Label>
										<Input id="metaPodcast" placeholder="Podcast show name" value={metaPodcast} onChange={e => setMetaPodcast(e.target.value)} disabled={isBusy} />
									</div>
									<div className="space-y-2">
										<Label htmlFor="metaDate">Published Date (optional)</Label>
										<Input id="metaDate" type="date" value={metaDate} onChange={e => setMetaDate(e.target.value)} disabled={isBusy} />
									</div>

									<div className="space-y-2">
										<Label>Episode Type</Label>
										<div className="grid grid-cols-2 gap-2">
											<Button type="button" variant={generationMode === "single" ? "icon" : "secondary"} icon={<Speech className="w-4 h-4" />} onClick={() => setGenerationMode("single")} disabled={isBusy}>
												Single speaker
											</Button>
											<Button type="button" variant={generationMode === "multi" ? "default" : "secondary"} onClick={() => setGenerationMode("multi")} disabled={isBusy}>
												Multi speaker
											</Button>
										</div>
									</div>

									{generationMode === "multi" && (
										<div className="space-y-4">
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
																	{v.label}
																</SelectItem>
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
																<SelectItem key={v.name} value={v.name}>
																	{v.label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
											</div>
										</div>
									)}

									<Button
										variant="default"
										type="button"
										disabled={!canSubmitMeta}
										className="w-full"
										onClick={async () => {
											setIsCreating(true)
											setError(null)
											try {
												const res = await fetch("/api/user-episodes/create-from-metadata", {
													method: "POST",
													headers: { "Content-Type": "application/json" },
													body: JSON.stringify({ title: metaTitle, podcastName: metaPodcast || undefined, publishedAt: metaDate || undefined, generationMode, voiceA, voiceB, allowPaid }),
												})
												if (!res.ok) throw new Error(await res.text())
												toast.message("We’re searching for the episode and transcribing it. We’ll email you when it’s ready.")
												router.push("/curation-profile-management")
											} catch (err) {
												setError(err instanceof Error ? err.message : "Failed to start metadata flow")
											} finally {
												setIsCreating(false)
											}
										}}>
										{isCreating ? "Starting..." : "Start Metadata Search & Transcription"}
									</Button>
								</>
							)}
						</form>
					)}
					{error && <p className="text-red-500 mt-4">{error}</p>}
					{successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
				</CardContent>
			</Card>
		</div>
	)
}
