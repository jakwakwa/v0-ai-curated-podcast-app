## Codebase Architecture and Feature Report

### Executive Summary
Podslice is a Next.js App Router application that generates and curates AI-powered podcast episodes and weekly summaries. Users authenticate via Clerk, create a Personalized Feed (either selecting a static curated bundle or assembling custom sources), and receive AI-generated episodes synthesized with Gemini TTS. The system supports ad hoc episode generation from YouTube transcripts, uses Google Cloud Storage (GCS) for audio hosting, and employs Paddle for subscription management and plan gating. In-app and optional email notifications announce episode readiness. The business model offers subscription tiers (Free Slice, Casual Listener, Curate Control) that control bundle access and generation limits.

### Core Application Structure
- **app/**: Next.js App Router pages and API route handlers
  - `app/layout.tsx`: Global layout (ClerkProvider, Radix Theme, Theme provider, Toaster, analytics)
  - `app/(protected)/**`: Authenticated pages sharing a sidebar/header layout
  - `app/login`, `app/sign-in`, `app/sign-up`: Clerk-auth pages
  - `app/api/**`: API endpoints (episodes, user profiles, transcripts, Paddle, notifications, Inngest webhook, admin upload)
- **lib/**: Server-side utilities and domain logic
  - Prisma client, Inngest client and functions, transcript orchestrator/providers, GCS helpers, email service, Paddle server wrapper, Zustand stores, UI variants
- **hooks/**: Client-side hooks (breadcrumbs, episode progress polling, responsive utilities, pagination)
- **prisma/**: Database models, relations, enums, and migrations
- **config/**: AI configuration and Paddle pricing tier definitions
- **utils/**: General helpers and Paddle plan mapping/webhook processing
- **types/**: Type augmentations for external packages and app-wide types aggregation via `lib/types.ts`
- **components.json**: shadcn UI configuration and path aliases (e.g., `ui` → `@/components/ui`, `lib` → `@/lib`)
- **package.json**: Dependencies and scripts (Next.js 15, React 19, Prisma 6, Inngest 3, Tailwind 4, Clerk)
- **app/globals.css**: Tailwind 4 global styles and CSS variable theme system

### Application Domain & Business Logic
- **Personalized Feeds**
  - Users create `user_curation_profile` either by selecting a curated static `bundle` or by assembling custom podcasts (`profile_podcast` junction).
  - Access to curated bundles is controlled by `PlanGate` (NONE, FREE_SLICE, CASUAL_LISTENER, CURATE_CONTROL), derived from user subscription via Paddle.

- **Episodes**
  - Curated/profile-linked episodes are stored in unified `episode` with optional `profile_id` and `bundle_id` and required `podcast_id`.
  - User-generated episodes are stored in `user_episode` with lifecycle statuses: PENDING → PROCESSING → COMPLETED/FAILED.

- **AI Pipeline**
  - Inngest functions orchestrate: content aggregation (transcripts), summarization (Gemini), script generation (Gemini), TTS synthesis (Gemini), upload to GCS, DB writes, and notifications.
  - Flows include: `generatePodcastWithGeminiTTS` (profile-based), `generateAdminBundleEpisodeWithGeminiTTS` (admin bundle), `generateUserEpisode` and `generateUserEpisodeMulti` (user-created episodes).
  - Transcript orchestration (`lib/transcripts`) chooses providers based on URL kind, supporting paid ASR with Whisper as fallback when enabled.

- **Storage**
  - Admin/generated episodes upload to GCS buckets (safe, lazy init supporting JSON blobs and key paths, with base64 decoding support).
  - User episodes use a user-episodes bucket (or admin bucket as configured); signed URLs are generated for playback.

- **Subscriptions (Paddle)**
  - Webhooks update `subscription` and attach `paddle_customer_id` to matching `user` rows; plan gates are enforced during profile creation/update and bundle listing.
  - Generation limits (e.g., 16 completed user episodes for Curate Control) are enforced in `/api/user-episodes/create`.

- **Notifications**
  - In-app notifications created for episode readiness or failure; optional email via Resend (lazy initialization and preference-aware).

### Key Architectural Patterns
- **Next.js App Router with route groups**: `app/(protected)` wraps authenticated pages with a shared sidebar and header.
- **Server Components for data, Client Components for interactivity**: Thin pages that delegate interactivity to client components and state stores.
- **API route conventions**: Clerk `auth()` guards, Zod validation for payloads, Prisma queries with correct snake_case fields and mapped relations.
- **Background processing**: Inngest 3 with Next.js runtime. The handler at `/api/inngest` registers all functions.
- **State management**: Focused Zustand stores (`episodes`, `user-curation-profile`, `notifications`) with devtools in development.
- **Config-driven flags**: `config/ai.ts` toggles TTS model, episode length, and simulation.

### Tech Stack Analysis
- **Core**: Next.js 15.2, React 19
- **Auth**: Clerk (`@clerk/nextjs`)
- **Styling/UI**: Tailwind CSS 4, Radix UI, shadcn components; extensive theme variables in `globals.css`
- **Database**: Prisma 6.14 + Accelerate; PostgreSQL
- **Background jobs**: Inngest 3.40
- **AI**: `@ai-sdk/google`, `@google/genai`, `ai`; Whisper via OpenAI for ASR
- **Media**: `@distube/ytdl-core`, `fluent-ffmpeg`, `ffmpeg-static`
- **Storage**: `@google-cloud/storage` with safe lazy init (`lib/gcs.ts`)
- **Payments**: Paddle JS/Node SDK; API wrapper at `lib/paddle-server/paddle.ts`
- **Email**: Resend client with lazy initialization (`lib/email-service.ts`)
- **Tooling**: Biome (lint/format), Vitest, Vercel Analytics

### Key Files and Components
- **Global Layout & Providers**
  - `app/layout.tsx`: Sets up `ClerkProvider`, Radix `Theme`, `ClientProviders` (theme), `GlobalProgressBar`, `Toaster`, analytics.
  - `app/(protected)/layout.tsx` (client): Auth check using Clerk, triggers `/api/sync-user`, provides sidebar/header and a fixed portal container for the global audio player.
  - `app/client-providers.tsx`: Theme provider wrapper.
  - `app/globals.css`: Tailwind v4 with custom CSS variables and UI utility classes.

- **Authentication Pages**
  - `app/login/[[...rest]]/page.tsx`, `app/sign-in/[[...sign-in]]/page.tsx`, `app/sign-up/[[...sign-up]]/page.tsx`: Clerk SignIn/SignUp components on a simple centered layout.

- **Dashboard and Episodes**
  - `app/(protected)/dashboard/page.tsx`: Client page using `useEpisodesStore` to fetch `/api/episodes` and `/api/user-curation-profiles`. Renders `EpisodeList`, profile cards, and portals the audio player.
  - `app/(protected)/episodes/page.tsx`: Client page fetching `/api/episodes` with loading, errors, and audio player portal.

- **Curated Bundles**
  - `app/(protected)/curated-bundles/page.tsx`: Server page fetching bundles with optional filters; displays bundle cards. Plan gates are applied in API and/or UI.
  - `app/api/curated-bundles/route.ts`: Applies allowed plan gates derived from subscription plan or admin override.

- **User Curation Profiles**
  - `app/api/user-curation-profiles/route.ts` & `[id]/route.ts`: CRUD endpoints with plan gate checks against `PlanGate`. Transforms selected bundles to expose podcasts list and computed episodes.

- **Episodes APIs**
  - `app/api/episodes/route.ts`: Returns curated/profile-linked episodes for signed-in user considering selected bundle membership.
  - `app/api/episodes/invalidate.ts`: Invalidates Accelerate cache tags.

- **User-Generated Episodes**
  - `app/api/user-episodes/create/route.ts`: Validates request, enforces episode-generation limits, enqueues single/multi-speaker Inngest jobs.
  - `app/api/user-episodes/list/route.ts`, `/[id]/route.ts`, `/[id]/status/route.ts`, `/route.ts`: Lists with signed URLs, returns per-episode with signed URL, status polling, count-only mode for usage.

- **Transcripts**
  - `lib/transcripts/index.ts`, `providers/*`: Orchestrates transcript providers (Podcast RSS, Listen Notes optional, RevAI, Paid ASR via Whisper), detects kind from URL, and returns best successful provider result.
  - `lib/custom-transcriber.ts`: YouTube audio extraction, compression/chunking, and Whisper transcription.

- **Inngest Functions**
  - `lib/inngest/gemini-tts.ts`: Profile/bundle workflows – summarize, script, TTS, upload to GCS, create `episode`, and notify users.
  - `lib/inngest/user-episode-generator.ts`: User episode workflow – summarize transcript, TTS, upload to GCS, update `user_episode`, and notify.
  - `app/api/inngest/route.ts`: Registers functions for Next.js handler.

- **Storage (GCS)**
  - `lib/gcs.ts`: Safe lazy initialization supporting JSON or path credentials (with base64 decode for Vercel envs), helper to parse `gs://` URIs, and ensure bucket names.
  - `app/api/admin/upload-episode/route.ts`: Admin-only file upload path to GCS with safe init and episode creation.

- **Subscriptions and Payments (Paddle)**
  - `utils/paddle/process-webhook.ts`, `app/api/paddle-webhook/route.ts`: Webhook signature verification, subscription updates, and cancellation cleanup.
  - `app/api/account/subscription/*`: Create/get subscription, cancel, swap plan, portal session, and sync diagnostic endpoint.
  - `lib/paddle-server/paddle.ts`: REST-level wrapper for Paddle Billing API (env-aware base URLs). `config/paddle-config.ts` and `utils/paddle/plan-utils.ts` map price IDs to `PlanGate` names.

- **Notifications & Email**
  - `app/api/notifications/*`: Fetch and clear notifications; mark single notification as read.
  - `lib/email-service.ts`: Resend integration with lazy client initialization; templates for episode ready, trial ending, subscription expiring, weekly reminder.

- **State Management (Zustand)**
  - `lib/stores/episodes-store.ts`: Manage curated/profile-linked episodes and profile data, combined list with display type and sort order.
  - `lib/stores/user-curation-profile-store.ts`: Create/update/deactivate API calls with toasts.
  - `lib/stores/notification-store.ts`: Preferences and notifications with counts and convenience actions.

### Database Schema Highlights (prisma/schema.prisma)
- **User**: Fields include `paddle_customer_id`, notification preferences, and relations to subscriptions, notifications, user episodes, and owned content.
- **UserEpisode**: `episode_title`, `youtube_url`, `transcript`, `summary`, `gcs_audio_url`, `status` (enum), and relations to user.
- **Podcast**: Catalog with `url` (unique), optional `owner_user_id`, related to bundles and profiles.
- **Episode**: Unified episodes with `podcast_id`, optional `profile_id`, optional `bundle_id`, media fields, `published_at`, `week_nr`.
- **Bundle** and **BundlePodcast**: Static curated collections of podcasts with `min_plan` gate.
- **UserCurationProfile** and **ProfilePodcast**: Personalized feed with either `selected_bundle_id` or custom podcast list.
- **Subscription**: Paddle subscription details; `plan_type` string aligned to `PlanGate` via mapping.
- **Notification**: In-app messages with timestamps and read flag.
- **Enums**: `UserEpisodeStatus`, `FeedbackRating`, `PlanGate`.

### Guidance for New Contributors
- Use exact Prisma field names (snake_case) and relation names (camelCase) as defined in `prisma/schema.prisma`.
- Keep pages thin and prefer Server Components for data fetching. Move interactivity to Client Components.
- For new APIs: guard with Clerk `auth()`, validate with Zod, and handle nullables carefully. Enforce plan gates where applicable.
- For long-running tasks: add an Inngest function and register it in `/api/inngest`.
- For storage: use `lib/gcs.ts` helpers. Do not log credentials or file system paths.
- For signed audio playback: generate signed URLs with `getStorageReader()` and `parseGcsUri()`.
- For subscriptions: use `priceIdToPlanType` mapping and `resolveAllowedGates` patterns before gating actions.
- UI: use shadcn/UI components via `ui` alias, Radix primitives, and keep styles consistent with existing utilities.

### Tech Notes and Scripts
- Dev: `pnpm dev` runs Prisma generate and Next dev. `pnpm build` for prod builds. Lint/format with Biome. Tests with Vitest.
- Prisma Accelerate: used via `$extends(withAccelerate())`. Cache invalidation endpoint exists at `/api/episodes/invalidate`.
- Environment: safe, lazy initialization patterns for GCS and Resend. Avoid leaking secrets in logs.

---

This report provides a high-signal map of the codebase to enable quick onboarding and confident extension of features (AI pipelines, bundles, user episodes, subscriptions, notifications) while adhering to established patterns.

