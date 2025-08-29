import { XMLParser } from "fast-xml-parser"
import type { TranscriptProvider, TranscriptRequest, TranscriptResponse } from "../types"

function isLikelyPodcastUrl(url: string): boolean {
	return /(rss|feed|podcast|anchor|spotify|apple)\./i.test(url) || /\.rss(\b|$)/i.test(url)
}

function _looksLikeRssUrl(url: string): boolean {
	return /\.rss(\b|$)/i.test(url) || /\/feed(\b|$)/i.test(url)
}

function ensureArray<T>(value: T | T[] | undefined): T[] {
	if (!value) return []
	return Array.isArray(value) ? value : [value]
}

async function fetchText(url: string): Promise<string> {
	const res = await fetch(url)
	if (!res.ok) throw new Error(`Failed to fetch: ${url}`)
	return await res.text()
}

async function tryFetchTranscriptFromUrl(url: string): Promise<string | null> {
	try {
		const text = await fetchText(url)
		return text
	} catch {
		return null
	}
}

export const PodcastRssProvider: TranscriptProvider = {
	name: "podcast-rss",
	canHandle(request) {
		return isLikelyPodcastUrl(request.url)
	},
	async getTranscript(request: TranscriptRequest): Promise<TranscriptResponse> {
		try {
			const rssXml = await fetchText(request.url)
			const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" })
			const parsed = parser.parse(rssXml) as unknown

			function getObject(value: unknown): Record<string, unknown> | null {
				return value !== null && typeof value === "object" ? (value as Record<string, unknown>) : null
			}

			function getProp(obj: unknown, key: string): unknown {
				const rec = getObject(obj)
				return rec ? rec[key] : undefined
			}

			const root = getObject(parsed)
			const channelCandidate = getProp(getProp(root, "rss"), "channel") ?? getProp(getProp(root, "feed"), "channel") ?? getProp(root, "channel")
			const channel = getObject(channelCandidate)
			if (!channel) {
				return { success: false, error: "Not a valid RSS feed", provider: this.name }
			}

			const ch = channel as { item?: unknown | unknown[]; entry?: unknown | unknown[] }
			const items = ensureArray<unknown>(ch.item || ch.entry)
			if (items.length === 0) {
				return { success: false, error: "RSS feed has no items", provider: this.name }
			}

			for (const item of items as Array<Record<string, unknown>>) {
				const transcriptTags = ensureArray<unknown>(item["podcast:transcript"]) // Podcast namespace
				for (const tag of transcriptTags as Array<Record<string, unknown>>) {
					const href = (tag?.["@_url"] as unknown) || (tag?.url as unknown)
					if (typeof href === "string" && href.startsWith("http")) {
						const transcript = await tryFetchTranscriptFromUrl(href)
						if (transcript && transcript.trim().length > 0) {
							return { success: true, transcript, provider: this.name, meta: { transcriptUrl: href } }
						}
					}
				}
			}

			for (const item of items as Array<Record<string, unknown>>) {
				const enclosure = item.enclosure as Record<string, unknown> | undefined
				const audioUrl: string | undefined =
					(typeof enclosure?.["@_url"] === "string" ? (enclosure?.["@_url"] as string) : undefined) ||
					(typeof enclosure?.url === "string" ? (enclosure?.url as string) : undefined) ||
					(typeof item?.link === "string" ? (item.link as string) : undefined)
				if (audioUrl && /(\.mp3|\.m4a|\.wav|\.aac|\.flac)(\b|$)/i.test(audioUrl)) {
					return { success: false, error: "No transcript in RSS; use audio", provider: this.name, meta: { nextUrl: audioUrl } }
				}
			}

			return { success: false, error: "No transcript found in RSS", provider: this.name }
		} catch (error) {
			return { success: false, error: error instanceof Error ? error.message : "RSS provider error", provider: this.name }
		}
	},
}
