import { z } from "zod"

type ListenNotesEpisode = {
  id?: string
  title_original?: string
  podcast_title_original?: string
  audio?: string
  audio_length_sec?: number
  pub_date_ms?: number
  listennotes_url?: string
}

type ListenNotesSearchResponse = {
  results?: ListenNotesEpisode[]
}

export interface EpisodeSearchInput {
  title: string
  podcastName?: string
  publishedAt?: string // ISO date
}

export interface EpisodeSearchResult {
  audioUrl: string
  source: "listen-notes"
  meta?: Record<string, unknown>
}

function isDirectAudioUrl(url: string | undefined): url is string {
  return Boolean(url && /\.(mp3|m4a|wav|aac|flac)(\b|$)/i.test(url))
}

function scoreEpisodeMatch(ep: ListenNotesEpisode, query: EpisodeSearchInput): number {
  let score = 0
  const title = (ep.title_original || "").toLowerCase()
  const podcast = (ep.podcast_title_original || "").toLowerCase()

  if (title && query.title) {
    const q = query.title.toLowerCase()
    if (title.includes(q)) score += 5
  }
  if (query.podcastName) {
    const qPodcast = query.podcastName.toLowerCase()
    if (podcast.includes(qPodcast)) score += 3
  }
  if (query.publishedAt && ep.pub_date_ms) {
    const target = new Date(query.publishedAt).getTime()
    const deltaDays = Math.abs(ep.pub_date_ms - target) / (1000 * 60 * 60 * 24)
    // Prefer closer to the target date
    score += Math.max(0, 3 - Math.min(3, Math.floor(deltaDays)))
  }
  if (isDirectAudioUrl(ep.audio)) score += 2
  return score
}

export async function searchEpisodeAudioViaListenNotes(query: EpisodeSearchInput): Promise<EpisodeSearchResult | null> {
  const apiKey = process.env.LISTEN_NOTES_API_KEY
  if (!apiKey) return null

  const schema = z.object({ title: z.string().min(2), podcastName: z.string().optional(), publishedAt: z.string().optional() })
  const parsed = schema.safeParse(query)
  if (!parsed.success) return null

  const endpoint = new URL("https://listen-api.listennotes.com/api/v2/search")
  const qParts: string[] = [parsed.data.title]
  if (parsed.data.podcastName) qParts.push(parsed.data.podcastName)
  endpoint.searchParams.set("q", qParts.join(" "))
  endpoint.searchParams.set("type", "episode")
  endpoint.searchParams.set("only_in", "title,description")
  endpoint.searchParams.set("sort_by_date", "0")
  endpoint.searchParams.set("offset", "0")
  endpoint.searchParams.set("len_min", "0")
  endpoint.searchParams.set("len_max", "36000")

  const res = await fetch(endpoint.toString(), { headers: { "X-ListenAPI-Key": apiKey } })
  if (!res.ok) return null
  const data = (await res.json()) as ListenNotesSearchResponse
  const results = Array.isArray(data.results) ? data.results : []
  if (results.length === 0) return null

  let best: ListenNotesEpisode | null = null
  let bestScore = -Infinity
  for (const ep of results) {
    const s = scoreEpisodeMatch(ep, parsed.data)
    if (s > bestScore) {
      best = ep
      bestScore = s
    }
  }
  if (!best || !isDirectAudioUrl(best.audio)) return null

  return { audioUrl: best.audio!, source: "listen-notes", meta: { id: best.id, listennotes_url: best.listennotes_url } }
}

