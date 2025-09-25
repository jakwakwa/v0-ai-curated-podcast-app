# PODSLICE AI-Curated Podcast App - AI Agent Instructions

## Project Overview
PODSLICE is an AI-powered podcast curation platform built on Next.js 15 App Router with a sophisticated content pipeline for generating AI summaries and TTS audio from YouTube/RSS sources. The architecture supports tiered SaaS subscriptions with plan-based feature gates.

## Core Architecture Patterns

### 1. Next.js App Router Structure
- **Protected pages**: Place authenticated pages under `app/(protected)/...` to inherit global sidebar/header from `app/(protected)/layout.tsx`
- **Thin pages**: Keep `page.tsx` minimal - do data fetching in Server Components, push interactivity to child Client Components
- **Co-location**: Place `loading.tsx`, `error.tsx`, `route.ts`, and `layout.tsx` alongside `page.tsx`
- **API routes**: Use `app/api/.../route.ts` pattern for REST endpoints

### 2. Type Safety & Data Flow
- **Schema as truth**: `prisma/schema.prisma` is the single source of truth - use exact field names (snake_case) and relation names (camelCase)
- **Type imports**: Always use `import type` for Prisma types from `@/lib/types.ts` or generated types directly
- **Runtime validation**: Validate API responses with Zod schemas after fetching
- **Explicit typing**: All functions must have explicit return types, especially data-fetching ones

### 3. Authentication & Authorization
- **Hybrid approach**: Clerk for identity + local User sync in database
- **Plan gates**: Use `@/lib/usage/plan-gates.ts` for feature access control
- **Middleware**: Protected by existing middleware (in .cursorignore) - don't modify it

## Critical Integration Patterns

### Background Job Processing (Inngest)
- **Client**: Import from `@/lib/inngest/client.ts` 
- **Content pipeline**: YouTube → Transcript → AI Summary → TTS → GCS Storage
- **Job types**: Transcription, AI generation, audio synthesis in `lib/inngest/`
- **Webhooks**: Paddle subscription events trigger plan updates via `app/api/paddle-webhook/`

### Google Cloud Storage
- **Lazy initialization**: Use `@/lib/gcs.ts` for safe GCS client setup
- **Credential handling**: Accepts `GCS_UPLOADER_KEY_JSON` | `GCS_UPLOADER_KEY` | `GCS_UPLOADER_KEY_PATH`
- **Buckets**: Single bucket via `GOOGLE_CLOUD_STORAGE_BUCKET_NAME` environment variable
- **Never log credentials or absolute paths**

### AI Services Integration
- **Gemini API**: Used for summarization in content pipeline via `@google/genai`
- **TTS**: Google Cloud TTS for audio synthesis (https://ai.google.dev/gemini-api/docs/speech-generation?hl=en)[gemini-api/docs/speech-generation?hl=en]


## Development Workflows




### Component Patterns
- **UI Components**: Use shadcn/ui components from `@/components/ui/`
- **Data Components**: Server Components in `components/data-components/`
- **Feature Components**: Organized by domain in `components/features/`
- **Client Components**: Mark with `"use client"` only when needed for interactivity

### Testing Approach
- **Vitest configuration**: Single-threaded pool in `vitest.config.ts`
- **Database testing**: Separate test database via `TEST_DATABASE_URL`
- **Path aliases**: `@/` resolves to project root

## Business Logic Patterns

### Subscription Management
- **Paddle integration**: Webhook processing for subscription events
- **Plan hierarchy**: Free Slice → Casual Listener → Curate Control
- **Feature gates**: Plan-based access control throughout the app
- **Real-time validation**: Plan checks integrated with content delivery

### Content Processing
- **User episodes**: Custom content via `UserEpisode` model with processing states
- **Curated content**: Admin-managed `Podcast`/`Episode` via `Bundle` collections  
- **Transcription**: YouTube captions extraction + fallback transcription services
- **AI pipeline**: Transcript → Summary → Script → Audio via Inngest jobs

## Key Files to Understand
- `prisma/schema.prisma` - Data models and relationships
- `app/(protected)/layout.tsx` - Main app shell with sidebar/header
- `lib/types.ts` - Centralized type definitions  
- `lib/gcs.ts` - Google Cloud Storage integration

## Common Pitfalls to Avoid
- Don't create custom interfaces in pages/components - use `@/lib/types.ts`
- Don't modify middleware - it's protected and working
- Don't batch multiple Inngest jobs - use proper job orchestration patterns

## CRITICAL: Coding Standards
- Always use `import type` for types
- Always define explicit return types for functions
- Always validate external data with Zod schemas
- Always handle errors gracefully - never let unhandled exceptions crash the app
- Never log sensitive information (API keys, credentials)
- Don't use `any` types - leverage Prisma's generated types