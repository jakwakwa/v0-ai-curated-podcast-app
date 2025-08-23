import type { TranscriptResponse } from "youtube-transcript"
import { YoutubeTranscript } from "youtube-transcript"
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

export async function getYouTubeTranscriptSegments(videoUrlOrId: string, lang?: string): Promise<TranscriptResponse[]> {
	const id = extractYouTubeVideoId(videoUrlOrId) ?? videoUrlOrId
	try {
		const segments = await YoutubeTranscript.fetchTranscript(id, lang ? { lang } : undefined)
		return segments
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Transcript unavailable: ${error.message}`)
		}
		throw new Error("Transcript unavailable")
	}
}

export async function getYouTubeTranscriptText(videoUrlOrId: string, lang?: string): Promise<string> {
	const segments = await getYouTubeTranscriptSegments(videoUrlOrId, lang)
	return segments.map(s => s.text).join(" ")
}
