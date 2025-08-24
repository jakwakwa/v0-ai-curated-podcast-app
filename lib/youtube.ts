import ytdl from "@distube/ytdl-core"
import { XMLParser } from "fast-xml-parser"
// Removed youtube-transcript; keep ytdl-core based approach only
import { z } from "zod"

export async function getYouTubeVideoTitle(videoUrl: string): Promise<string> {
	// Try oEmbed first (reliable, no API key), then fall back to parsing HTML
	try {
		const viaOEmbed = await getYouTubeTitleViaOEmbed(videoUrl)
		if (viaOEmbed) return viaOEmbed
	} catch {}

	try {
		const viaHtml = await getYouTubeTitleViaHTML(videoUrl)
		if (viaHtml) return viaHtml
	} catch {}

	return "Untitled YouTube Video"
}

export async function getYouTubeTitleViaOEmbed(videoUrl: string): Promise<string | null> {
	const endpoint = new URL("https://www.youtube.com/oembed")
	endpoint.searchParams.set("url", videoUrl)
	endpoint.searchParams.set("format", "json")

	const res = await fetch(endpoint.toString(), { next: { revalidate: 3600 } })
	if (!res.ok) return null

	const data = await res.json()
	const OEmbedSchema = z.object({ title: z.string() })
	const parsed = OEmbedSchema.safeParse(data)
	if (!parsed.success) return null
	return parsed.data.title
}

export async function getYouTubeTitleViaHTML(videoUrl: string): Promise<string | null> {
	const res = await fetch(videoUrl, { next: { revalidate: 3600 } })
	if (!res.ok) return null

	const html = await res.text()

	// Prefer OpenGraph title
	let match = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i)
	if (match?.[1]) return decodeHTMLEntities(match[1])

	// Fallback: meta name="title"
	match = html.match(/<meta\s+name=["']title["']\s+content=["']([^"']+)["']/i)
	if (match?.[1]) return decodeHTMLEntities(match[1])

	// Fallback: <title> tag
	match = html.match(/<title>([^<]+)<\/title>/i)
	if (match?.[1]) return decodeHTMLEntities(match[1])

	return null
}

function decodeHTMLEntities(text: string): string {
	return text
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
}

export function extractYouTubeVideoId(urlOrId: string): string | null {
	// If already a plausible 11-char ID, return as-is
	if (/^[\w-]{11}$/.test(urlOrId)) return urlOrId

	const urlMatch = urlOrId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.*?&v=))([\w-]{11})/)
	return urlMatch ? urlMatch[1] : null
}

export type YouTubeTranscriptItem = { text: string; duration: number; offset: number }
export async function getYouTubeTranscriptSegments(videoUrlOrId: string, lang?: string): Promise<YouTubeTranscriptItem[]> {
	// Only use ytdl-core based attempt
	return await getYouTubeTranscriptSegmentsViaYtdl(videoUrlOrId, lang)
}

export async function getYouTubeTranscriptText(videoUrlOrId: string, lang?: string): Promise<string> {
	const segments = await getYouTubeTranscriptSegments(videoUrlOrId, lang)
	return segments.map(s => s.text).join(" ")
}

async function parseTranscriptXML(xmlData: string): Promise<YouTubeTranscriptItem[]> {
	if (!xmlData || xmlData.trim().length === 0) {
		throw new Error("Empty caption data received")
	}

	// Check if the response is actually XML
	if (!(xmlData.includes("<transcript>") || xmlData.includes("<text"))) {
		console.log("Unexpected response format:", xmlData.substring(0, 200))
		throw new Error("Invalid caption format - not XML")
	}

	// Parse the XML to extract transcript segments
	const parser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: "",
	})

	const parsed = parser.parse(xmlData)
	const texts = parsed.transcript?.text || []

	if (!Array.isArray(texts)) {
		throw new Error("Invalid caption format")
	}

	// Convert to TranscriptResponse format
	return texts.map((item: { "#text"?: string; dur?: string; start?: string } | string, index: number) => {
		const xmlItem = item as { "#text"?: string; dur?: string; start?: string } | string
		return {
			text: typeof xmlItem === "string" ? xmlItem : xmlItem["#text"] || "",
			duration: typeof xmlItem === "object" && xmlItem.dur ? parseFloat(xmlItem.dur) : 1,
			offset: typeof xmlItem === "object" && xmlItem.start ? parseFloat(xmlItem.start) : index,
		}
	}) as YouTubeTranscriptItem[]
}

async function getYouTubeTranscriptSegmentsViaYtdl(videoUrlOrId: string, lang?: string): Promise<YouTubeTranscriptItem[]> {
	try {
		const videoUrl = videoUrlOrId.startsWith("http") ? videoUrlOrId : `https://www.youtube.com/watch?v=${videoUrlOrId}`
		const info = await ytdl.getInfo(videoUrl)

		const playerResponse: unknown = (info as unknown as { player_response?: unknown }).player_response
		const captions: Array<{ languageCode?: string; kind?: string; baseUrl?: string; name?: { simpleText?: string } }> | undefined = (
			playerResponse as { captions?: { playerCaptionsTracklistRenderer?: { captionTracks?: Array<{ languageCode?: string; kind?: string; baseUrl?: string; name?: { simpleText?: string } }> } } }
		)?.captions?.playerCaptionsTracklistRenderer?.captionTracks
		if (!captions || captions.length === 0) {
			throw new Error("No captions available for this video")
		}

		console.log(`Found ${captions.length} caption tracks:`)
		captions.forEach((caption, index) => {
			console.log(`  ${index}: ${caption.name?.simpleText || caption.languageCode} (${caption.kind || "manual"}) - ${caption.baseUrl ? "URL available" : "No URL"}`)
		})

		// Find the best caption track
		let selectedCaption = captions.find(c => c.languageCode === (lang || "en") && c.kind === "asr") // Auto-generated
		if (!selectedCaption) {
			selectedCaption = captions.find(c => c.languageCode === (lang || "en")) // Manual captions
		}
		if (!selectedCaption) {
			selectedCaption = captions.find(c => c.kind === "asr") // Any auto-generated
		}
		if (!selectedCaption) {
			selectedCaption = captions[0] // Any caption
		}

		console.log("Selected caption:", selectedCaption?.name?.simpleText || selectedCaption?.languageCode, selectedCaption?.kind || "manual")

		if (!selectedCaption?.baseUrl) {
			throw new Error("No suitable caption track found")
		}

		// Fetch the caption XML with enhanced headers and retry logic
		let captionUrl = selectedCaption.baseUrl

		// Add additional parameters that might help with access
		if (!captionUrl.includes("fmt=")) {
			captionUrl += captionUrl.includes("?") ? "&fmt=xml3" : "?fmt=xml3"
		}

		console.log("Attempting to fetch caption from URL:", `${captionUrl.substring(0, 100)}...`)

		// Add delay to avoid rate limiting
		await new Promise(resolve => setTimeout(resolve, 1000))

		// Try multiple approaches as YouTube blocks automated access
		const attempts: Array<{ url?: string; headers: Record<string, string> }> = [
			// Attempt 1: Direct fetch with browser-like headers
			{
				headers: {
					"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
					Accept: "*/*",
					"Accept-Language": "en-US,en;q=0.9",
					"Accept-Encoding": "gzip, deflate, br",
					"Sec-CH-UA": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
					"Sec-CH-UA-Mobile": "?0",
					"Sec-CH-UA-Platform": '"macOS"',
					"Sec-Fetch-Dest": "empty",
					"Sec-Fetch-Mode": "cors",
					"Sec-Fetch-Site": "same-origin",
					Referer: `https://www.youtube.com/watch?v=${extractYouTubeVideoId(videoUrl)}`,
					Cookie: "VISITOR_INFO1_LIVE=1; YSC=1; PREF=f1=50000000",
				},
			},
			// Attempt 2: Without format parameter
			{
				url: selectedCaption.baseUrl,
				headers: {
					"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
					Accept: "text/xml,application/xml",
					Referer: "https://www.youtube.com/",
				},
			},
		]

		let response: Response | null = null
		let lastError: Error | null = null

		for (const [index, attempt] of attempts.entries()) {
			try {
				console.log(`Attempt ${index + 1}: Fetching with different headers...`)
				const urlToUse = attempt.url || captionUrl
				response = await fetch(urlToUse, { headers: attempt.headers })

				console.log(`Attempt ${index + 1} response:`, response.status, response.statusText)

				if (response.ok) {
					const testData = await response.text()
					if (testData && testData.trim().length > 0) {
						console.log(`Attempt ${index + 1} SUCCESS: Got ${testData.length} characters`)
						// Store the successful data and break
						const xmlData = testData
						console.log("Final caption XML data length:", xmlData.length)
						console.log("Final caption XML preview:", xmlData.substring(0, 500))

						// Parse and return the transcript immediately
						return await parseTranscriptXML(xmlData)
					} else {
						console.log(`Attempt ${index + 1} EMPTY: Response was empty`)
					}
				}
			} catch (error) {
				lastError = error as Error
				console.log(`Attempt ${index + 1} FAILED:`, error)
			}

			// Wait between attempts
			if (index < attempts.length - 1) {
				await new Promise(resolve => setTimeout(resolve, 2000))
			}
		}

		// If all attempts failed
		throw new Error(`All caption fetch attempts failed. Last error: ${lastError?.message || "Unknown error"}`)
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`ytdl-core transcript extraction failed: ${error.message}`)
		}
		throw new Error("ytdl-core transcript extraction failed")
	}
}
