## Core Application Structure

- **app**
  - **Root layout and providers**
    - `app/layout.tsx`: Root layout with `ClerkProvider`, Radix `Theme`, Vercel `Analytics`, global `Toaster`, and `ClientProviders`. Imports global styles from `app/globals.css`.
    - `app/client-providers.tsx`: Client component wrapping children with `next-themes` `ThemeProvider` (dark by default).
  - **Public pages**
    - `app/page.tsx`: Thin server page rendering the landing content.
    - `app/privacy/page.tsx`, `app/terms/page.tsx`: Static legal pages.
  - **Authentication pages**
    - `app/login/[[...rest]]/page.tsx`, `app/sign-in/[[...sign-in]]/page.tsx`, `app/sign-up/[[...sign-up]]/page.tsx`: Clerk-hosted sign-in/sign-up UIs centered on the page.
  - **Protected route group**
    - `app/(protected)/layout.tsx`: Client layout that:
      - Redirects unauthenticated users to `/sign-in` using `useAuth`.
      - Calls `/api/sync-user` once per session to ensure a local `user` row exists.
      - Provides the global shell (`AppSidebar`, header with `DynamicBreadcrumb` and `NotificationBell`, `SidebarProvider`).
      - Renders a fixed `#global-audio-player` container for portal-based players.
    - Feature pages under `(protected)` include:
      - `dashboard/page.tsx`: Client page using Zustand stores to load the user’s curation profile and combined catalog episodes. Plays audio via a portal into the fixed container.
      - `episodes/page.tsx`: Client page that fetches catalog episodes from `/api/episodes` and renders an `EpisodeList` with a portal audio player.
      - `curated-bundles/page.tsx`: Server page listing bundles with podcasts and plan gate metadata; search and filter via query params.
      - `curation-profile-management/page.tsx`: Client page to view/update the active `UserCurationProfile`, show subscription info, recent user-generated episodes (with signed URLs), and quick links to creation tools.
      - `my-episodes/page.tsx` + `_components`: Server page rendering client `EpisodeList` of user-generated episodes with signed GCS URLs, using `UserEpisodeAudioPlayer` when playable.
      - `generate-my-episodes/page.tsx`: Server page rendering `UsageDisplay` and the interactive `EpisodeCreator` to create user episodes from YouTube links.
      - `payments/[subscriptionId]/page.tsx`: Placeholder route for subscription details.
      - `welcome/page.tsx`: Client onboarding/explainer page.
    - **Admin portal**
      - `app/(protected)/admin/layout.tsx`: Thin layout with global progress bar and `AdminTabs`.
      - `app/(protected)/admin/page.tsx`: Links to Bundles, Podcasts, and Episodes admin sections.
      - `app/(protected)/admin/_components/*`: Server components fetch with Prisma (e.g., `BundlesPanel.server.tsx`), client components handle interactivity and actions (e.g., `EpisodeGenerationPanel.client.tsx`).
      - `admin/bundles|podcasts|episodes/page.tsx`: Thin pages that render their respective server panels under `Suspense`.

- **app/api**
  - Health/auth:
    - `test-auth/route.ts`: Confirms Clerk authentication works.
    - `test-db/route.ts`: Confirms Prisma DB connectivity; returns sample episodes.
    - `sync-user/route.ts`: Syncs the current Clerk user into local DB (create/update).
  - Catalog episodes (curated and user profile visibility):
    - `episodes/route.ts`: Auth required. Returns episodes that are either linked to the user’s active `UserCurationProfile`, belong to podcasts in the selected bundle, or directly linked via `bundle_id`. Includes `podcast` and `userProfile`. Ordered by `created_at desc`.
  - Curated data:
    - `curated-bundles/route.ts`: Optionally auth-aware. Returns active bundles with included podcasts and adds `canInteract`/`lockReason` based on the user’s plan (admin bypass supported).
    - `curated-podcasts/route.ts`: Auth required. Lists global podcasts (`owner_user_id: null`).
    - `plan-gates/route.ts`: Enumerates `PlanGate` values with human-friendly labels for UI.
  - Notifications:
    - `notifications/route.ts`: GET user notifications; DELETE clears notifications for the user.
    - `notifications/[id]/route.ts`: DELETE a single notification.
    - `notifications/[id]/read/route.ts`: PATCH mark a notification as read.
    - Admin-only diagnostics: `notifications/test-email/route.ts`, `notifications/verify-email-config/route.ts`.
  - User curation profiles:
    - `user-curation-profiles/route.ts`: GET active profile (with episodes and selected bundle podcasts/episodes). POST creates an active profile with plan-gate enforcement and constraints.
    - `user-curation-profiles/[id]/route.ts`: GET/PATCH/DELETE (soft deactivate) a profile; PATCH validates bundle selection against plan gate rules.
  - User-generated episodes:
    - `user-episodes/route.ts`: GET list (or `?count=true`) and returns signed GCS URLs when present; POST creates a `userEpisode`; DELETE removes all of the user’s `userEpisode` rows.
    - `user-episodes/list/route.ts`: GET a list of user-generated episodes with signed GCS URLs (uses `parseGcsUri`).
    - `user-episodes/[id]/route.ts`: GET a single user episode with signed URL if authorized.
    - `user-episodes/[id]/status/route.ts`: GET progress polling data for UI (`PENDING/PROCESSING/COMPLETED/FAILED` + step metadata).
    - `user-episodes/create/route.ts`: Validates request (Zod), enforces monthly completed-episode limit, creates `userEpisode`, and enqueues Inngest job(s) for generation.
  - Transcripts and YouTube helpers:
    - `transcripts/get/route.ts`: Orchestrated transcript retrieval based on URL kind and `allowPaid` flag; returns attempts trail.
    - `youtube-transcript/route.ts`, `youtube-transcribe/route.ts`, `youtube-metadata/route.ts`: YouTube transcript, transcription pipeline, and title lookup.
  - Payments (Paddle):
    - `paddle-webhook/route.ts`: Validates webhook, updates local `subscription` rows; on cancellation, deletes GCS audio objects and user-episode rows.
    - `account/notifications/route.ts`: GET/PATCH user notification preferences.
    - `account/subscription/route.ts`: POST upserts a local subscription on checkout complete; GET returns the latest subscription.
    - `account/subscription/cancel/route.ts`: Schedules cancellation at period end via Paddle API and flips local `cancel_at_period_end`.
  - Admin tools:
    - `admin/check/route.ts`: Admin-only sanity check.
    - `admin/fix-podcasts/route.ts`: Admin-only: sets admin-owned podcasts to global (`owner_user_id: null`).
    - `admin/upload-episode/route.ts`: Admin-only: uploads an audio file to GCS (safe lazy init) or uses a provided URL; creates an `episode` linked to a podcast (validates bundle membership if provided).
    - `admin/generate-bundle-episode/route.ts`: Admin-only: validates bundle/podcast relationship and enqueues Inngest generation.

- **lib**
  - DB and types: `lib/prisma.ts` (Prisma client with Accelerate), `lib/types.ts` (Prisma-derived types exported for app usage).
  - Storage: `lib/gcs.ts` (safe, lazy GCS init; supports JSON or path credentials; signed URL helpers and URI parsing).
  - Transcripts: `lib/transcripts/*` providers and `getTranscriptOrchestrated` orchestrator.
  - Email: `lib/email-service.ts` (Resend-based, lazy-initialized; multiple templates).
  - Inngest jobs: `lib/inngest/client.ts`, `lib/inngest/gemini-tts.ts`, `user-episode-generator*.ts` for background generation workflows.
  - Utilities: `lib/utils.ts` (`cn`, `withTimeout` variants), `lib/component-variants.ts` (UI variants), `lib/admin.ts` (admin checks; note: some API routes import `@/lib/admin-middleware` which must be present in deployment).
  - State (Zustand): `lib/stores/*` for episodes, curation profile, notifications, bundles, plan gates, and subscription.

- **config**
  - `config/ai.ts`: AI model names and feature toggles.
  - `config/paddle-config.ts`: `PRICING_TIER` with `PlanGate`-mapped plans, features, and limits.

- **hooks**
  - `hooks/useEpisodeProgress.ts`: Polls server for `userEpisode` generation status and exposes progress flags.
  - Other small UI hooks: breadcrumbs, pagination, mobile, pricing.

- **components**
  - `components/ui/*`: shadcn/Radix-based primitives (`Card`, `Alert`, `Button`, `Typography`, `AudioPlayer`, `EpisodeCard`, `sidebar` pieces, etc.).
  - `components/theme-provider.tsx`: `next-themes` wrapper.
  - Feature components for dashboard/admin UIs.

- **styles**
  - `app/globals.css`: Tailwind v4, `@theme` token definitions, custom properties, shadows, typography scales, and utilities.

- **tooling**
  - `package.json`: Next 15.2, React 19, Prisma 6.14, Clerk 6.x, Inngest 3.x, Zod, Resend, Paddle SDK, Tailwind 4, Vitest, Biome.
  - `tsconfig.json`: Strict TS, path aliases to `@/*` including `app`, `lib`, `hooks`, `components`, `config`, `prisma`, etc.


## Key Architectural Patterns

- **Thin pages; server-first data**: Server Components or API routes perform data access; Client Components handle interactivity. Admin follows server-panel + client-panel split.
- **Auth and gating**: Clerk protects routes; `(protected)/layout.tsx` redirects unauthenticated users and synchronizes the local `user` row. Admin APIs check admin privileges via a shared middleware (`requireAdminMiddleware`) or `lib/admin.ts`.
- **Data modeling**: Prisma models use snake_case columns with camelCase relations. Queries and includes follow schema truth; enums (`PlanGate`, `UserEpisodeStatus`) drive feature gating and UI labels.
- **Background processing**: Inngest jobs orchestrate transcript fetching, LLM summarization, TTS, and GCS storage; API routes enqueue jobs and UI polls status.
- **Storage safety**: GCS clients are lazily created and support JSON or path credentials without leaking secrets.
- **Client state**: Zustand stores encapsulate fetch logic and derived client-side state for dashboard-like pages.
- **Validation**: Zod schemas validate incoming requests; some endpoints also sanitize/normalize plan strings from external systems.
- **Styling/UI**: Tailwind v4 with custom tokens; shadcn/Radix primitives; `next-themes` for dark mode.


## Tech Stack Analysis

- **Framework**: Next.js 15 (App Router), React 19
- **Auth**: Clerk (`@clerk/nextjs`), Clerk server helpers in API routes
- **DB/ORM**: PostgreSQL via Prisma 6.14 (+ Accelerate extension)
- **Jobs**: Inngest 3.x with a single Next handler exposing functions
- **AI/Media**: `ai` SDK, Google GenAI (`@google/genai`), `@ai-sdk/google`; `fluent-ffmpeg` + `ffmpeg-static` for audio
- **Cloud Storage**: `@google-cloud/storage` with signed URLs and safe init helpers
- **Payments**: Paddle Node SDK / REST; custom plan mapping; webhook ingestion via Zod
- **Email**: Resend for transactional emails
- **Validation**: Zod schemas throughout APIs
- **State**: Zustand for client-side stores
- **UI**: shadcn/ui, Radix UI, Tailwind CSS v4, next-themes
- **Tooling**: Biome (lint/format), Vitest/RTL (tests), Vercel Analytics


## Key Files and Components

- **Layouts & Providers**
  - `app/layout.tsx`: Root providers; ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is configured.
  - `app/(protected)/layout.tsx`: Auth guard + user sync. Provides global shell and `#global-audio-player` for portals.

- **Database & Types**
  - `prisma/schema.prisma`: Models (`User`, `UserEpisode`, `Podcast`, `Episode`, `Bundle`, `BundlePodcast`, `UserCurationProfile`, `ProfilePodcast`, `Notification`, `Subscription`) and enums.
  - `lib/prisma.ts`: Prisma client singleton with Accelerate.
  - `lib/types.ts`: Re-exports Prisma scalar payloads and app-level helper types (e.g., `UserCurationProfileWithRelations`).

- **Episodes & Profiles**
  - `app/api/episodes/route.ts`: Core catalog episode sourcing using user profile and bundle membership.
  - `app/api/user-curation-profiles/*`: CRUD with plan gate enforcement and transformed responses including podcasts/episodes for UI.

- **User Episodes**
  - `app/(protected)/my-episodes/_components/episode-creator.tsx`: Interactive creation from YouTube URLs; uses `/api/youtube-transcribe` and `/api/transcripts/get`; enqueues Inngest.
  - `app/api/user-episodes/*`: CRUD, signed GCS URLs, status polling.
  - `hooks/useEpisodeProgress.ts`: Polls `/status` for progress state and triggers notifications refresh on completion.

- **Admin**
  - `app/(protected)/admin/_components/EpisodeGenerationPanel.server|.client.tsx`: Admin flow for bundle-based episode generation.
  - `app/api/admin/*`: Admin middleware-gated routes for generating and uploading episodes. Ensure `@/lib/admin-middleware` exists in your deployed environment.

- **Transcripts & Media**
  - `lib/transcripts/index.ts` + providers: Orchestrated transcript retrieval based on URL kind and `allowPaid`.
  - `lib/inngest/gemini-tts.ts`: End-to-end generation pipeline: transcript → text generation → TTS → GCS storage.
  - `lib/gcs.ts`: Centralized, safe GCS initialization; `parseGcsUri`, signed URL helpers.

- **Payments**
  - `app/api/paddle-webhook/route.ts`, `utils/paddle/process-webhook.ts`: Subscription lifecycle updates, cleanup on cancellation, mapping price IDs to `plan_type`.
  - `app/api/account/subscription/route.ts`: Idempotent local subscription upsert and GET endpoint for UI.

- **UI/Styling**
  - `components/ui/*`: shadcn UI primitives and custom components (`AudioPlayer`, `EpisodeCard`, etc.).
  - `app/globals.css`: Tailwind v4 with extensive design tokens and utilities.

---
This document targets junior developers and AI assistants onboarding to the codebase. It highlights architectural patterns, core flows, and file locations to implement features safely and consistently.

