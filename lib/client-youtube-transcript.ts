/**
 * Client-side YouTube transcript extraction
 * This runs in the browser to avoid server-side blocking
 */

export interface TranscriptSegment {
	text: string
	start: number
	duration: number
}

export interface TranscriptResult {
	success: boolean
	transcript?: string
	segments?: TranscriptSegment[]
	error?: string
}

/**
 * Extract YouTube video ID from various URL formats
 */
export function extractVideoId(url: string): string | null {
	const patterns = [/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/, /^([a-zA-Z0-9_-]{11})$/]

	for (const pattern of patterns) {
		const match = url.match(pattern)
		if (match) return match[1]
	}

	return null
}

/**
 * Parse XML transcript data
 */
function parseTranscriptXML(xmlText: string): TranscriptSegment[] {
	try {
		const parser = new DOMParser()
		const xmlDoc = parser.parseFromString(xmlText, "text/xml")

		// Check for parse errors
		const parserError = xmlDoc.querySelector("parsererror")
		if (parserError) {
			throw new Error("XML parsing failed")
		}

		const textElements = xmlDoc.querySelectorAll("text")
		const segments: TranscriptSegment[] = []

		textElements.forEach(element => {
			const text = element.textContent || ""
			const start = parseFloat(element.getAttribute("start") || "0")
			const duration = parseFloat(element.getAttribute("dur") || "1")

			if (text.trim()) {
				segments.push({ text: text.trim(), start, duration })
			}
		})

		return segments
	} catch (error) {
		console.error("Error parsing transcript XML:", error)
		return []
	}
}

/**
 * Fetch transcript from YouTube using browser context
 */
async function fetchTranscriptData(videoId: string): Promise<string> {
	try {
		// First, get video info from YouTube's player API
		const playerUrl = `https://www.youtube.com/youtubei/v1/player`
		const playerData = {
			context: {
				client: {
					clientName: "WEB",
					clientVersion: "2.20240101.00.00",
				},
			},
			videoId: videoId,
		}

		const playerResponse = await fetch(playerUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"User-Agent": navigator.userAgent,
				Referer: "https://www.youtube.com/",
				Origin: "https://www.youtube.com",
			},
			body: JSON.stringify(playerData),
		})

		if (!playerResponse.ok) {
			throw new Error(`Player API failed: ${playerResponse.status}`)
		}

		const playerJson = await playerResponse.json()
		const captionTracks = playerJson?.captions?.playerCaptionsTracklistRenderer?.captionTracks

		if (!captionTracks || captionTracks.length === 0) {
			throw new Error("No captions found for this video")
		}

		// Find the best caption track (prefer English auto-generated)
		const selectedTrack =
			captionTracks.find((track: { languageCode?: string; kind?: string }) => track.languageCode === "en" && track.kind === "asr") ||
			captionTracks.find((track: { languageCode?: string }) => track.languageCode === "en") ||
			captionTracks[0]

		if (!selectedTrack?.baseUrl) {
			throw new Error("No suitable caption track found")
		}

		// Fetch the transcript XML
		const transcriptResponse = await fetch(selectedTrack.baseUrl, {
			headers: {
				"User-Agent": navigator.userAgent,
				Referer: `https://www.youtube.com/watch?v=${videoId}`,
				Origin: "https://www.youtube.com",
			},
		})

		if (!transcriptResponse.ok) {
			throw new Error(`Transcript fetch failed: ${transcriptResponse.status}`)
		}

		const xmlText = await transcriptResponse.text()

		if (!xmlText || xmlText.trim().length === 0) {
			throw new Error("Empty transcript received")
		}

		return xmlText
	} catch (error) {
		console.error("Error fetching transcript data:", error)
		throw error
	}
}

/**
 * Main function to extract transcript from YouTube URL
 */
export async function extractYouTubeTranscript(url: string): Promise<TranscriptResult> {
	try {
		const videoId = extractVideoId(url)
		if (!videoId) {
			return {
				success: false,
				error: "Invalid YouTube URL",
			}
		}

		console.log(`Extracting transcript for video ID: ${videoId}`)

		const xmlText = await fetchTranscriptData(videoId)
		const segments = parseTranscriptXML(xmlText)

		if (segments.length === 0) {
			return {
				success: false,
				error: "No transcript content found",
			}
		}

		const transcript = segments.map(seg => seg.text).join(" ")

		return {
			success: true,
			transcript,
			segments,
		}
	} catch (error) {
		console.error("Client-side transcript extraction failed:", error)
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		}
	}
}

/**
 * Alternative approach using iframe and postMessage
 * This creates a hidden iframe that loads the YouTube page
 */
export async function extractTranscriptViaIframe(url: string): Promise<TranscriptResult> {
	return new Promise(resolve => {
		try {
			const videoId = extractVideoId(url)
			if (!videoId) {
				resolve({
					success: false,
					error: "Invalid YouTube URL",
				})
				return
			}

			// Create hidden iframe
			const iframe = document.createElement("iframe")
			iframe.style.display = "none"
			iframe.src = `https://www.youtube.com/watch?v=${videoId}`

			let timeoutId: NodeJS.Timeout | undefined

			const cleanup = () => {
				if (iframe.parentNode) {
					iframe.parentNode.removeChild(iframe)
				}
				if (timeoutId) {
					clearTimeout(timeoutId)
				}
			}

			// Set timeout
			timeoutId = setTimeout(() => {
				cleanup()
				resolve({
					success: false,
					error: "Transcript extraction timed out",
				})
			}, 15000)

			// Add load listener
			iframe.onload = () => {
				try {
					// Try to access the iframe content (will fail due to CORS)
					// This approach is limited by same-origin policy
					cleanup()
					resolve({
						success: false,
						error: "Cannot access YouTube content due to CORS restrictions",
					})
				} catch (_error) {
					cleanup()
					resolve({
						success: false,
						error: "CORS restriction prevents iframe access",
					})
				}
			}

			iframe.onerror = () => {
				cleanup()
				resolve({
					success: false,
					error: "Failed to load YouTube page",
				})
			}

			document.body.appendChild(iframe)
		} catch (err) {
			resolve({
				success: false,
				error: err instanceof Error ? err.message : "Unknown error",
			})
		}
	})
}
