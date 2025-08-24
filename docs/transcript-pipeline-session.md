# Hybrid Transcript Pipeline - Session Summary and Next Steps

## Completed in this session

- Orchestrator and Providers
  - Added `lib/transcripts/types.ts` with provider interfaces and typed responses
  - Implemented orchestrator `lib/transcripts/index.ts` with source-kind detection and ordered provider chaining
  - Providers:
    - `youtube` (server captions via ytdl/youtube-transcript)
    - `youtube-client` (browser hint only)
    - `podcast-rss` (reads `podcast:transcript`, falls back to `enclosure` audio)
    - `listen-notes` (optional) resolves episode audio URL via search
    - `revai` (paid ASR) with short polling
    - temporary `paid-asr` (Whisper) retained for YouTube fallback
- API
  - `GET /api/transcripts/get` with Clerk auth + Zod validation
  - Returns success with transcript, or 404 with attempts trail
- UI Integration
  - Wired fallback pipeline into `EpisodeCreator`
  - Added “Use paid fallback (Rev.ai)” toggle
  - Shows provider attempts and errors; supports non-YouTube URLs
- Feature Flags & Quotas
  - `ENABLE_LISTEN_NOTES` (default off; can enable to test)
  - In-memory monthly quota for Listen Notes (default 300 via `LISTEN_NOTES_MONTHLY_QUOTA`)
  - Optional in-memory aggregate paid-service usage counters (Listen Notes, Rev.ai)
- Build/Infra hygiene
  - Lazy OpenAI client init to avoid build-time env requirement
  - All builds green

## Current runtime behavior

- YouTube: captions → server transcriber → orchestrator (paid if enabled)
- Podcast/RSS/Show URL: RSS transcript → RSS enclosure audio → Listen Notes (optional) → Rev.ai (if `allowPaid=true`)
- Single user input URL; internal resolution to direct audio when needed

---

## Detailed plans (future work)

### 1) Caching strategy

Goals:
- Reduce repeat external calls (YouTube captions, RSS fetch, Listen Notes search)
- Avoid re-paying for the same Rev.ai job when possible

Proposed cache layers:
- Transcript cache: key = `url|lang|provider`, value = `{ transcript, provider, createdAt }`, TTL 7d
- Resolution cache: key = `url`, value = `{ audioUrl, discoveredAt }`, TTL 7d
- Provider attempt cache (optional for diagnostics): key = `url`, compact list of last attempts

Store options:
- Phase 1: In-memory Map (dev/testing)
- Phase 2: Redis (preferred) or Prisma table `TranscriptCache` with:
  - `cache_key (pk)`, `payload (jsonb)`, `expires_at (timestamp)`

Edge cases:
- Invalidate or shorten TTL when provider responds with rate-limit or unstable errors
- Respect signed URLs TTLs by reducing cache TTL to min(signedUrlTTL, defaultTTL)

UI behavior:
- If cache hit present, use immediately and display “cached” label in attempts

### 2) Unit tests

Scope:
- Orchestrator ordering and nextUrl handoff
- Provider success/failure paths (mock fetch)
- Flag and quota behavior (Listen Notes gate)
- API route validation and responses

Test plan:
- Mock network at provider boundaries; use fixtures for RSS/LN responses
- Snapshot attempts trail for known scenarios
- Run in CI; ensure determinism by seeding RNG and using fixed dates

### 3) API rate limiting

Goals:
- Prevent abuse and costly fallbacks
- Keep UX smooth for legit users

Approach:
- Lightweight token bucket per user for `/api/transcripts/get`
  - Example: 10 req/10 min, burst 5
- Global circuit breakers
  - If aggregate external error rate spikes, temporarily degrade to RSS-only for N minutes
- Implementation options:
  - Phase 1: In-memory limiter per instance (fast to ship)
  - Phase 2: Shared limiter (Redis or DB) for multi-instance correctness

HTTP semantics:
- On limit exceeded: 429 with `Retry-After`
- Include headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

### 4) Paid-usage persistence (later)

- Add Prisma model `SystemUsage` with monthly `month_key` and `data jsonb`
- Move counters into DB; migrate from in-memory using a simple upsert
- Dashboard endpoint to view snapshot and toggle `ENABLE_LISTEN_NOTES`

---

## Environment variables checklist

- Required for paid fallback:
  - `REVAI_API_KEY`
- Optional discovery:
  - `ENABLE_LISTEN_NOTES=true|false`
  - `LISTEN_NOTES_API_KEY`
  - `LISTEN_NOTES_MONTHLY_QUOTA=300`
- Optional Whisper fallback:
  - `OPENAI_API_KEY`

## How to test quickly

- YouTube with captions:
  - `GET /api/transcripts/get?url=<youtube_url>`
- Podcast feed/page (paid on):
  - `GET /api/transcripts/get?url=<rss_or_show_url>&allowPaid=true`
- Direct audio (paid on):
  - `GET /api/transcripts/get?url=https://example.com/ep.mp3&allowPaid=true`

This document captures what shipped and the plan for caching, tests, and rate limiting to pick up later.