# Provider Pool: Metadata-Based Transcription Pipeline

This document describes the Provider Pool architecture and the implementation delivered in this PR to make transcript generation resilient, provider-agnostic, and consistent within a long-running window (default ~60 minutes).

## Goals

- Hide operational complexity from users; they provide title/show/date/URL and reliably get a result.
- Treat all providers as peers in a “system-of-systems” (Provider Pool), not a single primary/fallback chain.
- Keep working for a bounded window, performing periodic sweeps and backstops until success or time expiry.

---

## What’s Implemented

### 1) Background workflow (Inngest)

- File: `lib/inngest/transcribe-from-metadata.ts`
- Triggered by: `user.episode.metadata.requested`
- Flow:
  1. Mark episode `PROCESSING` and log the start.
  2. Provider Pool sweep (parallel resolvers):
     - Listen Notes search → direct audio URL
     - Apple/iTunes search → RSS feed → enclosure URL
     - YouTube search (title + show with date buffer) → candidate YouTube URL
  3. If any direct audio URL is found, proceed to paid ASR.
  4. If only YouTube URL is found, use Gemini video understanding to transcribe.
  5. Paid ASR cascade with long polling:
     - AssemblyAI → Rev.ai
     - If neither yields a transcript in time, try Gemini as backstop.
  6. Store transcript and trigger the existing generation workflow (single/multi speaker).
  7. Write a final run report for admin-only review.

### 2) Provider Pool: Resolvers

- Listen Notes resolver: `lib/transcripts/search.ts`
- Apple/iTunes resolver (+RSS enclosure detection): `lib/transcripts/search.ts`
- YouTube search resolver (title + show, ±14 day buffer): `lib/transcripts/search-youtube.ts`

Resolvers run in parallel within each sweep. The pool repeats sweeps periodically until an acceptable source emerges or the window expires.

### 3) Retry Supervisor

- Implemented inside `transcribe-from-metadata.ts`.
- Configuration (env):
  - `RESOLUTION_WINDOW_MINUTES` (default 60)
  - `RESOLUTION_SWEEP_INTERVAL_SECONDS` (default 180)
- Behavior:
  - Performs periodic sweeps across all resolvers.
  - Logs attempt counts, whether any resolver returned a candidate, and which source won.
  - Breaks immediately when a usable source is found.

### 4) Transcription Backstops

- AssemblyAI (polling): short-interval loop up to ~90 minutes total.
- Rev.ai (polling): similar loop.
- Gemini video understanding: `lib/transcripts/gemini-video.ts`
  - Uses Files API (`@google/generative-ai/server`) to upload direct media or passes YouTube URLs directly, and calls `gemini-2.5-flash`.
  - Returns a single transcript string; result logged and persisted if present.

### 5) Admin-only Debugging & Reports

- GCS-backed log writer: `lib/debug-logger.ts`
  - Events path: `gs://<bucket>/debug/user-episodes/<episode_id>/logs/<timestamp>.json`
  - Final report path: `gs://<bucket>/debug/user-episodes/<episode_id>/report-*.md`
- API endpoints (admin + ENABLE_EPISODE_DEBUG only):
  - `GET /api/user-episodes/[id]/debug/logs` → JSON consolidated log events
  - `GET /api/user-episodes/[id]/debug/report` → latest markdown report
- Admin gating middleware: `lib/admin-middleware.ts`
  - Requires Clerk auth, DB `is_admin`, and `ENABLE_EPISODE_DEBUG=true`.
- UI: admin-only quick view (when `NEXT_PUBLIC_ENABLE_EPISODE_DEBUG=true`):
  - `app/(protected)/my-episodes/_components/episode-list.tsx` adds “View Run Log” button per episode (admin builds only).

### 6) API endpoint to start metadata flow

- `app/api/user-episodes/create-from-metadata/route.ts`
  - Validates request (title required; show/date optional)
  - Creates `user_episode` record in `PENDING`
  - Enqueues `user.episode.metadata.requested`

### 7) Inngest registration

- `app/api/inngest/route.ts`: Registers `transcribe-from-metadata` alongside existing generation workflows.

---

## Configuration

Required/optional env vars:

```bash
# Resolvers
LISTEN_NOTES_API_KEY=...       # Listen Notes search
YOUTUBE_API_KEY=...            # YouTube Data API v3 search

# Paid ASR
ASSEMBLYAI_API_KEY=...
REVAI_API_KEY=...

# Gemini (Files API)
GEMINI_API_KEY=...             # or GOOGLE_GENERATIVE_AI_API_KEY

# Retry Supervisor
RESOLUTION_WINDOW_MINUTES=60
RESOLUTION_SWEEP_INTERVAL_SECONDS=180

# Debug/Admin
ENABLE_EPISODE_DEBUG=true
NEXT_PUBLIC_ENABLE_EPISODE_DEBUG=true

# GCS (already used elsewhere)
GOOGLE_CLOUD_STORAGE_BUCKET_NAME=...
GCS_UPLOADER_KEY_JSON=...      # or GCS_UPLOADER_KEY / _PATH
GCS_READER_KEY_JSON=...        # or GCS_READER_KEY / _PATH
```

---

## How It Works (Summary)

1. User submits metadata (title/show/date);
2. Inngest job starts and loops over sweeps for up to the configured window;
3. Each sweep runs resolvers in parallel to get an audio or YouTube URL;
4. If a direct audio URL → paid ASR (AssemblyAI → Rev.ai) with polling;
5. If only YouTube URL → Gemini video understanding to transcribe;
6. On success → persist transcript, trigger episode generation, email user;
7. Admin sees attempts and outcome via logs/report (users see only the finished summary).

---

## Current Limitations & Notes

- Gemini URL-in-prompt (direct YouTube link) was not yet added; Files API is used to ensure robust ingestion. We can add URL-in-prompt first, Files API second.
- YouTube resolver uses YouTube Data API search; ranking favors title/show matches and a ±14-day date window.
- Apple resolver parses feeds with a lightweight regex to find enclosures quickly; the production RSS parser (`PodcastRssProvider`) remains available elsewhere for deeper parsing if needed.

---

## Future Enhancements

- Add YouTube URL-in-prompt path before Files API to reduce download/upload time when allowed.
- Add more resolvers: Spotify episode pages (when publicly accessible), generic RSS auto-discovery from show websites.
- Escalation logic: if multiple transcripts are produced, reconcile by completeness and confidence; keep the best canonical version.
- De-duplication of near-duplicate episodes across resolvers.
- Smarter ranking: incorporate duration similarity and channel ID match, not just title text.
- Adaptive backoff: vary sweep interval based on last attempt status and provider quotas.
- Automatic log cleanup: GCS lifecycle rule for `debug/` paths (e.g., 14-day retention).
- Cost controls: per-user caps on ASR/Gemini usage; admin kill-switch per provider.

---

## Critical Edge Cases to Test

- Title or show name slightly off; date missing or outside buffer → ensure resolution still succeeds within window.
- No resolver returns anything initially → confirm multiple sweeps happen and logs include attempt counters.
- YouTube-only availability → confirm Gemini path completes with a reasonable transcript.
- Large/long episodes → Files API uploads succeed; Gemini returns text; run time stays within SLA.
- Provider quotas/5xx → verify retries, backoff, and eventual success or clear final failure.
- Missing/invalid env vars → ensure safe failures and informative admin logs.
- Admin gating: debug endpoints 404 when `ENABLE_EPISODE_DEBUG` is false, and 403 for non-admins.

---

## Files Touched / Added

- New:
  - `lib/inngest/transcribe-from-metadata.ts`
  - `lib/transcripts/search-youtube.ts`
  - `lib/debug-logger.ts`
  - `app/api/user-episodes/create-from-metadata/route.ts`
  - `app/api/user-episodes/[id]/debug/logs/route.ts`
  - `app/api/user-episodes/[id]/debug/report/route.ts`
  - `lib/transcripts/gemini-video.ts`
- Updated:
  - `app/api/inngest/route.ts` (register new function)
  - `lib/transcripts/search.ts` (Apple resolver added)
  - `app/(protected)/my-episodes/_components/episode-list.tsx` (admin “View Run Log”)

---

## TL;DR

We implemented a Provider Pool: multiple resolvers and transcribers working together with periodic retries, date-buffered ranking, and a clear admin-only audit trail. Users get a reliable transcript and summary without seeing the underlying complexity.

     - YouTube search (title + show with date buffer) → candidate YouTube URL
  3. If any direct audio URL is found, proceed to paid ASR.
  4. If only YouTube URL is found, use Gemini video understanding to transcribe.
  5. Paid ASR cascade with long polling:
     - AssemblyAI → Rev.ai
     - If neither yields a transcript in time, try Gemini as backstop.
  6. Store transcript and trigger the existing generation workflow (single/multi speaker).
  7. Write a final run report for admin-only review.

### 2) Provider Pool: Resolvers

- Listen Notes resolver: `lib/transcripts/search.ts`
- Apple/iTunes resolver (+RSS enclosure detection): `lib/transcripts/search.ts`
- YouTube search resolver (title + show, ±14 day buffer): `lib/transcripts/search-youtube.ts`

Resolvers run in parallel within each sweep. The pool repeats sweeps periodically until an acceptable source emerges or the window expires.

### 3) Retry Supervisor

- Implemented inside `transcribe-from-metadata.ts`.
- Configuration (env):
  - `RESOLUTION_WINDOW_MINUTES` (default 60)
  - `RESOLUTION_SWEEP_INTERVAL_SECONDS` (default 180)
- Behavior:
  - Performs periodic sweeps across all resolvers.
  - Logs attempt counts, whether any resolver returned a candidate, and which source won.
  - Breaks immediately when a usable source is found.

### 4) Transcription Backstops

- AssemblyAI (polling): short-interval loop up to ~90 minutes total.
- Rev.ai (polling): similar loop.
- Gemini video understanding: `lib/transcripts/gemini-video.ts`
  - Uses Files API (`@google/generative-ai/server`) to upload the media (audio/YouTube-derived) and call `gemini-1.5-flash`.
  - Returns a single transcript string; result logged and persisted if present.

### 5) Admin-only Debugging & Reports

- GCS-backed log writer: `lib/debug-logger.ts`
  - Events path: `gs://<bucket>/debug/user-episodes/<episode_id>/logs/<timestamp>.json`
  - Final report path: `gs://<bucket>/debug/user-episodes/<episode_id>/report-*.md`
- API endpoints (admin + ENABLE_EPISODE_DEBUG only):
  - `GET /api/user-episodes/[id]/debug/logs` → JSON consolidated log events
  - `GET /api/user-episodes/[id]/debug/report` → latest markdown report
- Admin gating middleware: `lib/admin-middleware.ts`
  - Requires Clerk auth, DB `is_admin`, and `ENABLE_EPISODE_DEBUG=true`.
- UI: admin-only quick view (when `NEXT_PUBLIC_ENABLE_EPISODE_DEBUG=true`):
  - `app/(protected)/my-episodes/_components/episode-list.tsx` adds “View Run Log” button per episode (admin builds only).

### 6) API endpoint to start metadata flow

- `app/api/user-episodes/create-from-metadata/route.ts`
  - Validates request (title required; show/date optional)
  - Creates `user_episode` record in `PENDING`
  - Enqueues `user.episode.metadata.requested`

### 7) Inngest registration

- `app/api/inngest/route.ts`: Registers `transcribe-from-metadata` alongside existing generation workflows.

---

## Configuration

Required/optional env vars:

```bash
# Resolvers
LISTEN_NOTES_API_KEY=...       # Listen Notes search
YOUTUBE_API_KEY=...            # YouTube Data API v3 search

# Paid ASR
ASSEMBLYAI_API_KEY=...
REVAI_API_KEY=...

# Gemini (Files API)
GEMINI_API_KEY=...             # or GOOGLE_GENERATIVE_AI_API_KEY

# Retry Supervisor
RESOLUTION_WINDOW_MINUTES=60
RESOLUTION_SWEEP_INTERVAL_SECONDS=180

# Debug/Admin
ENABLE_EPISODE_DEBUG=true
NEXT_PUBLIC_ENABLE_EPISODE_DEBUG=true

# GCS (already used elsewhere)
GOOGLE_CLOUD_STORAGE_BUCKET_NAME=...
GCS_UPLOADER_KEY_JSON=...      # or GCS_UPLOADER_KEY / _PATH
GCS_READER_KEY_JSON=...        # or GCS_READER_KEY / _PATH
```

---

## How It Works (Summary)

1. User submits metadata (title/show/date);
2. Inngest job starts and loops over sweeps for up to the configured window;
3. Each sweep runs resolvers in parallel to get an audio or YouTube URL;
4. If a direct audio URL → paid ASR (AssemblyAI → Rev.ai) with polling;
5. If only YouTube URL → Gemini video understanding to transcribe;
6. On success → persist transcript, trigger episode generation, email user;
7. Admin sees attempts and outcome via logs/report (users see only the finished summary).

---

## Current Limitations & Notes

- Gemini URL-in-prompt (direct YouTube link) was not yet added; Files API is used to ensure robust ingestion. We can add URL-in-prompt first, Files API second.
- YouTube resolver uses YouTube Data API search; ranking favors title/show matches and a ±14-day date window.
- Apple resolver parses feeds with a lightweight regex to find enclosures quickly; the production RSS parser (`PodcastRssProvider`) remains available elsewhere for deeper parsing if needed.

---

## Future Enhancements

- Add YouTube URL-in-prompt path before Files API to reduce download/upload time when allowed.
- Add more resolvers: Spotify episode pages (when publicly accessible), generic RSS auto-discovery from show websites.
- Escalation logic: if multiple transcripts are produced, reconcile by completeness and confidence; keep the best canonical version.
- De-duplication of near-duplicate episodes across resolvers.
- Smarter ranking: incorporate duration similarity and channel ID match, not just title text.
- Adaptive backoff: vary sweep interval based on last attempt status and provider quotas.
- Automatic log cleanup: GCS lifecycle rule for `debug/` paths (e.g., 14-day retention).
- Cost controls: per-user caps on ASR/Gemini usage; admin kill-switch per provider.

---

## Critical Edge Cases to Test

- Title or show name slightly off; date missing or outside buffer → ensure resolution still succeeds within window.
- No resolver returns anything initially → confirm multiple sweeps happen and logs include attempt counters.
- YouTube-only availability → confirm Gemini path completes with a reasonable transcript.
- Large/long episodes → Files API uploads succeed; Gemini returns text; run time stays within SLA.
- Provider quotas/5xx → verify retries, backoff, and eventual success or clear final failure.
- Missing/invalid env vars → ensure safe failures and informative admin logs.
- Admin gating: debug endpoints 404 when `ENABLE_EPISODE_DEBUG` is false, and 403 for non-admins.

---

## Files Touched / Added

- New:
  - `lib/inngest/transcribe-from-metadata.ts`
  - `lib/transcripts/search-youtube.ts`
  - `lib/debug-logger.ts`
  - `app/api/user-episodes/create-from-metadata/route.ts`
  - `app/api/user-episodes/[id]/debug/logs/route.ts`
  - `app/api/user-episodes/[id]/debug/report/route.ts`
  - `lib/transcripts/gemini-video.ts`
- Updated:
  - `app/api/inngest/route.ts` (register new function)
  - `lib/transcripts/search.ts` (Apple resolver added)
  - `app/(protected)/my-episodes/_components/episode-list.tsx` (admin “View Run Log”)

---

## TL;DR

We implemented a Provider Pool: multiple resolvers and transcribers working together with periodic retries, date-buffered ranking, and a clear admin-only audit trail. Users get a reliable transcript and summary without seeing the underlying complexity.

