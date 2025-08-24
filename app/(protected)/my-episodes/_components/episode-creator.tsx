"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EpisodeProgress } from "@/components/ui/episode-progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { extractYouTubeTranscript } from "@/lib/client-youtube-transcript"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const EPISODE_LIMIT = 10 // Assuming a limit of 10 for now

const VOICE_OPTIONS = [
	{ name: "Zephyr", label: "Zephyr — Bright" },
	{ name: "Puck", label: "Puck — Upbeat" },
	{ name: "Charon", label: "Charon — Informative" },
	{ name: "Kore", label: "Kore — Firm" },
	{ name: "Fenrir", label: "Fenrir — Excitable" },
	{ name: "Leda", label: "Leda — Youthful" },
	{ name: "Orus", label: "Orus — Firm" },
	{ name: "Aoede", label: "Aoede — Breezy" },
	{ name: "Callirrhoe", label: "Callirrhoe — Easy-going" },
	{ name: "Autonoe", label: "Autonoe — Bright" },
	{ name: "Enceladus", label: "Enceladus — Breathy" },
	{ name: "Iapetus", label: "Iapetus — Clear" },
	{ name: "Umbriel", label: "Umbriel — Easy-going" },
	{ name: "Algieba", label: "Algieba — Smooth" },
	{ name: "Despina", label: "Despina — Smooth" },
	{ name: "Erinome", label: "Erinome — Clear" },
	{ name: "Algenib", label: "Algenib — Gravelly" },
	{ name: "Rasalgethi", label: "Rasalgethi — Informative" },
	{ name: "Laomedeia", label: "Laomedeia — Upbeat" },
	{ name: "Achernar", label: "Achernar — Soft" },
	{ name: "Alnilam", label: "Alnilam — Firm" },
	{ name: "Schedar", label: "Schedar — Even" },
	{ name: "Gacrux", label: "Gacrux — Mature" },
	{ name: "Pulcherrima", label: "Pulcherrima — Forward" },
	{ name: "Achird", label: "Achird — Friendly" },
	{ name: "Zubenelgenubi", label: "Zubenelgenubi — Casual" },
	{ name: "Vindemiatrix", label: "Vindemiatrix — Gentle" },
	{ name: "Sadachbia", label: "Sadachbia — Lively" },
	{ name: "Sadaltager", label: "Sadaltager — Knowledgeable" },
	{ name: "Sulafat", label: "Sulafat — Warm" },
]

export function EpisodeCreator() {
	const [youtubeUrl, setYoutubeUrl] = useState("")
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
	const [currentEpisodeId, setCurrentEpisodeId] = useState<string | null>(null)
	const [showProgress, setShowProgress] = useState(false)
	const [generationMode, setGenerationMode] = useState<"single" | "multi">("single")
	const [voiceA, setVoiceA] = useState<string>("Zephyr")
	const [voiceB, setVoiceB] = useState<string>("Puck")
	const [useShort, setUseShort] = useState<boolean>(true)

	// Transcript extraction with client-first then server fallback
	const extractTranscriptWithFallbacks = async (url: string) => {
		// 1) Browser/client-side captions fetch (less likely to be blocked)
		try {
			const clientResult = await extractYouTubeTranscript(url)
			if (clientResult.success && clientResult.transcript) {
				return { success: true, transcript: clientResult.transcript, method: "client" }
			}
		} catch {
			// continue
		}
		// 2) Server-side extraction + Whisper
		try {
			const customRes = await fetch("/api/youtube-transcribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url, validate: false }) })
			if (customRes.ok) {
				const customData = await customRes.json()
				if (customData.success && customData.transcript) {
					return { success: true, transcript: customData.transcript, method: "custom" }
				}
			} else {
				const text = await customRes.text()
				return { success: false, error: text || "Transcription failed", method: "server" }
			}
		} catch (error) {
			return { success: false, error: error instanceof Error ? error.message : "Unknown error", method: "server" }
		}
		return { success: false, error: "All transcript extraction methods failed. Please use manual input.", method: "none" }
	}

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
			if (youtubeUrl.includes("youtube.com") || youtubeUrl.includes("youtu.be")) {
				try {
					setIsFetchingTitle(true)
					setIsFetchingTranscript(true)
					setError(null)
					const titlePromise = fetch(`/api/youtube-metadata?url=${encodeURIComponent(youtubeUrl)}`).then(res => (res.ok ? res.json() : null)).then(data => data?.title || "").catch(() => "")
					const transcriptPromise = extractTranscriptWithFallbacks(youtubeUrl)
					const [title, transcriptResult] = await Promise.all([titlePromise, transcriptPromise])
					setEpisodeTitle(title)
					if (transcriptResult.success && transcriptResult.transcript) {
						setTranscript(transcriptResult.transcript)
						setExtractionMethod(transcriptResult.method || "unknown")
					} else {
						setTranscript("")
						setExtractionMethod("")
						setError(transcriptResult.error || "Failed to extract transcript. The video may not have captions available.")
					}
				} catch (error) {
					setTranscript("")
					setError("Failed to fetch video data. Please check the YouTube URL.")
				} finally {
					setIsFetchingTitle(false)
					setIsFetchingTranscript(false)
				}
			} else {
				setTranscript("")
				setEpisodeTitle("")
				setError(null)
			}
		}, 1000)
		return () => {
			clearTimeout(handler)
		}
	}, [youtubeUrl])

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsCreating(true)
		setError(null)
		setSuccessMessage(null)
		try {
			const finalTranscript = transcriptMethod === "manual" ? manualTranscript : transcript
			const payload: any = { youtubeUrl, episodeTitle, transcript: finalTranscript, generationMode }
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
			const newEpisode = await res.json()
			setSuccessMessage(`Successfully started generation for: "${newEpisode.episode_title}"`)
			setCurrentEpisodeId(newEpisode.episode_id)
			setShowProgress(true)
			setYoutubeUrl("")
			setEpisodeTitle("")
			setTranscript("")
			setManualTranscript("")
			setUsage(prev => ({ ...prev, count: prev.count + 1 }))
		} catch (err) {
			setError(err instanceof Error ? err.message : "An unknown error occurred.")
		} finally {
			setIsCreating(false)
		}
	}

	const hasReachedLimit = usage.count >= usage.limit
	const hasValidTranscript = transcriptMethod === "manual" ? manualTranscript && manualTranscript.trim().length > 0 : transcript && transcript.trim().length > 0
	const canSubmit = youtubeUrl && episodeTitle && hasValidTranscript && !isCreating && !isFetchingTitle && !isFetchingTranscript

	const handleProgressComplete = () => {
		setShowProgress(false)
		setCurrentEpisodeId(null)
		window.location.reload()
	}

	const handleProgressError = (error: string) => {
		setError(`Episode generation failed: ${error}`)
		setShowProgress(false)
		setCurrentEpisodeId(null)
	}

	return (

		<div className="w-full lg:w-full lg:min-w-screen/[60%] lg:max-w-[1200px] h-auto mb-0 mt-4 px-12">
			{showProgress && currentEpisodeId && <EpisodeProgress episodeId={currentEpisodeId} onComplete={handleProgressComplete} onError={handleProgressError} />}

			<Card>
				<CardHeader>
					<CardTitle>Create New Episode</CardTitle>
					<CardDescription>Enter a YouTube URL to generate a new podcast episode.</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoadingUsage ? (
						<p>Loading usage data...</p>
					) : hasReachedLimit ? (
						<p className="text-red-500">You have reached your monthly limit for episode creation.</p>
					) : (
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="youtubeUrl">YouTube URL</Label>
								<Input id="youtubeUrl" placeholder="https://www.youtube.com/watch?v=..." value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} disabled={isCreating} required />
							</div>

							<div className="space-y-2">
								<Label htmlFor="episodeTitle">Episode Title</Label>
								<Input id="episodeTitle" placeholder="Episode title will be fetched automatically" value={episodeTitle} onChange={e => setEpisodeTitle(e.target.value)} disabled={isCreating || isFetchingTitle} required />
							</div>

							<div className="space-y-4">
								<Label>Transcript Source</Label>
								<Tabs value={transcriptMethod} onValueChange={value => setTranscriptMethod(value as "auto" | "manual") }>
									<TabsList className="grid w-full grid-cols-2">
										<TabsTrigger value="auto">Auto Extract (client-first)</TabsTrigger>
										<TabsTrigger value="manual">Manual Input</TabsTrigger>
									</TabsList>

									<TabsContent value="auto" className="space-y-2">
										<div className="text-sm text-gray-600">
											{isFetchingTranscript ? (
												<span className="text-blue-600">🔄 Extracting transcript from video...</span>
											) : transcript && transcript.trim().length > 0 ? (
												<span className="text-green-600">✓ Transcript extracted ({transcript.length} characters) via {extractionMethod}</span>
											) : youtubeUrl && !isFetchingTranscript ? (
												<span className="text-red-500">✗ Could not extract transcript automatically. YouTube may have blocked automated access. Try Manual Input.</span>
											) : (
												<span>Enter a YouTube URL above to auto-extract transcript</span>
											)}
										</div>
										{transcript && (
											<div className="mt-2">
												<Label className="text-xs text-gray-500">Preview:</Label>
												<div className="text-xs bg-gray-50 p-2 rounded max-h-20 overflow-y-auto">{transcript.substring(0, 200)}...</div>
											</div>
										)}
									</TabsContent>

									<TabsContent value="manual" className="space-y-2">
										<Label htmlFor="manualTranscript" className="text-sm">Paste transcript text here</Label>
										<Textarea id="manualTranscript" placeholder="Paste the video transcript here..." value={manualTranscript} onChange={e => setManualTranscript(e.target.value)} disabled={isCreating} rows={6} className="resize-none" />
										{manualTranscript && <div className="text-xs text-gray-500">{manualTranscript.length} characters</div>}
									</TabsContent>
								</Tabs>
							</div>

							<div className="space-y-2">
								<Label>Episode Type</Label>
								<div className="grid grid-cols-2 gap-2">
									<Button type="button" variant={generationMode === "single" ? "default" : "secondary"} onClick={() => setGenerationMode("single")} disabled={isCreating}>Single speaker</Button>
									<Button type="button" variant={generationMode === "multi" ? "default" : "secondary"} onClick={() => setGenerationMode("multi")} disabled={isCreating}>Multi speaker</Button>
								</div>
							</div>

							{generationMode === "multi" && (
								<div className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<Label>Voice A</Label>
											<Select value={voiceA} onValueChange={setVoiceA}>
												<SelectTrigger className="w-full">
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
												<SelectTrigger className="w-full">
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
									<div className="space-y-1">
										<Label>Developer test mode</Label>
										<div className="text-xs text-gray-600">Shorter summary and shorter episode (for faster testing)</div>
										<div>
											<Button type="button" variant={useShort ? "default" : "secondary"} onClick={() => setUseShort(true)} size="sm">Short</Button>
											<Button type="button" variant={!useShort ? "default" : "secondary"} onClick={() => setUseShort(false)} className="ml-2" size="sm">Production (3-5 min)</Button>
										</div>
									</div>
								</div>
							)}

							<Button variant="default" type="submit" disabled={!canSubmit} className="w-full">
								{isCreating ? "Generating..." : "Generate Episode"}
							</Button>
						</form>
					)}
					{error && <p className="text-red-500 mt-4">{error}</p>}
					{successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
				</CardContent>
			</Card>
		</div>
	)
}
