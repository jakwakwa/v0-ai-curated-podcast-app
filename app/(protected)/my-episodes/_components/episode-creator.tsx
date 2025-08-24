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

const EPISODE_LIMIT = 10 // Assuming a limit of 10 for now

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

    // Transcript extraction with multiple fallbacks
    const extractTranscriptWithFallbacks = async (url: string) => {
        console.log("🔄 Starting transcript extraction with fallbacks...")

        // Method 1: Try our custom transcriber first
        try {
            console.log("Attempting custom transcription...")
            const customRes = await fetch("/api/youtube-transcribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, validate: false }),
            })

            if (customRes.ok) {
                const customData = await customRes.json()
                if (customData.success && customData.transcript) {
                    console.log("✅ Custom transcription successful!")
                    return {
                        success: true,
                        transcript: customData.transcript,
                        method: "custom",
                    }
                }
            }
        } catch (error) {
            console.log("❌ Custom transcription failed:", error)
        }

        // Method 2: Fall back to client-side extraction
        try {
            console.log("Attempting client-side extraction...")
            const clientResult = await extractYouTubeTranscript(url)
            if (clientResult.success && clientResult.transcript) {
                console.log("✅ Client-side extraction successful!")
                return {
                    success: true,
                    transcript: clientResult.transcript,
                    method: "client",
                }
            }
        } catch (error) {
            console.log("❌ Client-side extraction failed:", error)
        }

        // All methods failed
        return {
            success: false,
            error: "All transcript extraction methods failed. Please use manual input.",
            method: "none",
        }
    }

    useEffect(() => {
        const fetchUsage = async () => {
            try {
                setIsLoadingUsage(true)
                const res = await fetch("/api/user-episodes?count=true")
                if (res.ok) {
                    const { count } = await res.json()
                    setUsage({
                        count: count,
                        limit: EPISODE_LIMIT, // TODO: This should come from plan data
                    })
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

                    // Fetch title and transcript in parallel
                    const titlePromise = fetch(`/api/youtube-metadata?url=${encodeURIComponent(youtubeUrl)}`)
                        .then(res => (res.ok ? res.json() : null))
                        .then(data => data?.title || "")
                        .catch(() => "")

                    // Try multiple transcript extraction methods
                    const transcriptPromise = extractTranscriptWithFallbacks(youtubeUrl)

                    const [title, transcriptResult] = await Promise.all([titlePromise, transcriptPromise])

                    // Set title
                    setEpisodeTitle(title)

                    // Set transcript
                    if (transcriptResult.success && transcriptResult.transcript) {
                        setTranscript(transcriptResult.transcript)
                        setExtractionMethod(transcriptResult.method || "unknown")
                        console.log(`✅ Transcript extraction successful (${transcriptResult.method}): ${transcriptResult.transcript.length} characters`)
                    } else {
                        setTranscript("")
                        setExtractionMethod("")
                        setError(transcriptResult.error || "Failed to extract transcript. The video may not have captions available.")
                        console.log(`❌ Transcript extraction failed: ${transcriptResult.error}`)
                    }
                } catch (error) {
                    setTranscript("")
                    setError("Failed to fetch video data. Please check the YouTube URL.")
                    console.error("Error in transcript extraction:", error)
                } finally {
                    setIsFetchingTitle(false)
                    setIsFetchingTranscript(false)
                }
            } else {
                // Reset when URL is not a valid YouTube URL
                setTranscript("")
                setEpisodeTitle("")
                setError(null)
            }
        }, 1000) // Increased delay to reduce API calls

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

            const res = await fetch("/api/user-episodes/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ youtubeUrl, episodeTitle, transcript: finalTranscript }),
            })

            if (!res.ok) {
                const errorData = await res.text()
                throw new Error(errorData || "Failed to create episode.")
            }

            const newEpisode = await res.json()
            setSuccessMessage(`Successfully started generation for: "${newEpisode.episode_title}"`)

            // Start progress tracking
            setCurrentEpisodeId(newEpisode.episode_id)
            setShowProgress(true)

            // Reset form
            setYoutubeUrl("")
            setEpisodeTitle("")
            setTranscript("")
            setManualTranscript("")
            // Optimistically update usage count
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
        // Refresh the episodes list if needed
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
                                <Input
                                    id="episodeTitle"
                                    placeholder="Episode title will be fetched automatically"
                                    value={episodeTitle}
                                    onChange={e => setEpisodeTitle(e.target.value)}
                                    disabled={isCreating || isFetchingTitle}
                                    required
                                />
                            </div>

                            <div className="space-y-4">
                                <Label>Transcript Source</Label>
                                <Tabs value={transcriptMethod} onValueChange={value => setTranscriptMethod(value as "auto" | "manual")}>
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="auto">Auto Extract</TabsTrigger>
                                        <TabsTrigger value="manual">Manual Input</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="auto" className="space-y-2">
                                        <div className="text-sm text-gray-600">
                                            {isFetchingTranscript ? (
                                                <span className="text-blue-600">🔄 Extracting transcript from video...</span>
                                            ) : transcript && transcript.trim().length > 0 ? (
                                                <span className="text-green-600">
                                                    ✓ Transcript extracted ({transcript.length} characters) via {extractionMethod}
                                                </span>
                                            ) : youtubeUrl && !isFetchingTranscript ? (
                                                <span className="text-red-500">✗ Could not extract transcript automatically</span>
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
                                        <Label htmlFor="manualTranscript" className="text-sm">
                                            Paste transcript text here
                                        </Label>
                                        <Textarea
                                            id="manualTranscript"
                                            placeholder="Paste the video transcript here..."
                                            value={manualTranscript}
                                            onChange={e => setManualTranscript(e.target.value)}
                                            disabled={isCreating}
                                            rows={6}
                                            className="resize-none"
                                        />
                                        {manualTranscript && <div className="text-xs text-gray-500">{manualTranscript.length} characters</div>}
                                    </TabsContent>
                                </Tabs>
                            </div>

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
