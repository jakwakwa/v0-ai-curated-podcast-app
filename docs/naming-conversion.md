# Database Schema Naming Conversion Reference

This document maps old database naming to the new unified schema with proper conventions.

## Overview

We unified the schema to eliminate duplicate episode tables and applied database naming best practices:

- **Tables**: snake_case, singular (e.g., `podcast`, `bundle_podcast`)
- **Primary keys**: `<table>_id` (never bare `id`)
- **Foreign keys**: identical to target PK (eliminates join ambiguity)
- **Timestamps & flags**: `created_at`, `updated_at`, `is_active`, etc.

## Model & Table Mapping

```
┌───────────────────────────────┬───────────────────────────────────────────┐
│              OLD              │                  NEW                     │
├───────────────────────────────┼───────────────────────────────────────────┤
│               MODELS / TABLES                                          │
├───────────────────────────────┼───────────────────────────────────────────┤
│ CuratedPodcast      → table curated_podcasts      │ Podcast       → table podcast          │
│ Source              → table sources               │ (merged into Podcast)                  │
│ CuratedBundle       → table curated_bundles       │ Bundle        → table bundle           │
│ CuratedBundlePodcast→ table curated_bundle_podcasts│ BundlePodcast → table bundle_podcast  │
│ CuratedBundleEpisode→ table curated_bundle_episodes│ Episode       → table episode          │
│ (kept) Episode (user)  table episodes             │ Episode (same table, unified)          │
│ — (new)                                            │ ProfilePodcast → table profile_podcast│
│                                                    │  (junction: user profile ↔ podcast)   │
├───────────────────────────────┼───────────────────────────────────────────┤
│            PRIMARY KEYS (PK) & TABLE-WIDE MAPS                           │
├───────────────────────────────┼───────────────────────────────────────────┤
│ id                → curated_podcast_id           │ podcast_id                           │
│ id                → source_id                    │ ← merged into podcast_id             │
│ id                → curated_bundle_id            │ bundle_id                            │
│ id                → curated_bundle_episode_id    │ episode_id                           │
│ id (episodes)     → episode_id                   │ episode_id (unchanged)               │
│ id (user profile) → collection_id                │ profile_id                           │
│ id (user)         → user_id                      │ user_id (unchanged)                  │
├───────────────────────────────┼───────────────────────────────────────────┤
│            FOREIGN KEYS (FK) — identical to target PK names              │
├───────────────────────────────┼───────────────────────────────────────────┤
│ curated_podcast_id     (in curated_bundle_podcast) │ podcast_id                        │
│ curated_bundle_id      (in curated_bundle_podcast) │ bundle_id                         │
│ curated_bundle_id      (in curated_bundle_episode) │ bundle_id                         │
│ source_id              (in episode)                │ podcast_id (now points to Podcast)│
│ collection_id          (in episode)                │ profile_id                        │
│ curated_bundle_id      (in user_curation_profile)  │ selected_bundle_id → bundle_id    │
│ — (new) profile_id + podcast_id (junction)         │ profile_id + podcast_id           │
├───────────────────────────────┼───────────────────────────────────────────┤
│            COMMON COLUMN RENAMES (applied everywhere)                    │
├───────────────────────────────┼───────────────────────────────────────────┤
│ createdAt       → created_at               │ updatedAt      → updated_at            │
│ publishedAt     → published_at             │ imageUrl       → image_url             │
│ audioUrl        → audio_url                │ ownerUserId    → owner_user_id         │
│ isActive        → is_active                │ isBundleSelection → is_bundle_selection│
│ lastGenerationDate → last_generation_date  │ nextGenerationDate → next_generation_date│
│ weekNr          → week_nr                  │ isRead         → is_read               │
└───────────────────────────────┴───────────────────────────────────────────┘
```

## Key Schema Changes

### 1. Unified Episode Table

- **Before**: Two tables (`Episode` for user episodes, `CuratedBundleEpisode` for bundle episodes)
- **After**: Single `Episode` table with optional `profile_id` and `bundle_id` columns
- **Benefit**: No more runtime merging of episode lists in UI code

### 2. Unified Podcast Catalog

- **Before**: `CuratedPodcast` (global) + `Source` (user-specific)
- **After**: Single `Podcast` table with optional `owner_user_id` (null = global catalog)
- **Benefit**: Consistent interface for all podcast sources

### 3. Explicit Many-to-Many Relations

- **New**: `ProfilePodcast` junction table for user's custom podcast selections
- **Renamed**: `CuratedBundlePodcast` → `BundlePodcast`
- **Benefit**: Clear separation between bundle selection vs. custom selection

### 4. Consistent Naming

- All table names: `snake_case`, singular
- All PKs: `{table}_id` (never bare `id`)
- All FKs: identical to target PK name
- All boolean flags: `is_*`
- All timestamps: `*_at`

## Migration Strategy

1. **Schema diff**: Applied via Prisma `@@map` and `@map` attributes
2. **Data migration**: Copy existing data to new unified tables
3. **API updates**: Replace dual-table queries with single-table queries
4. **Frontend cleanup**: Remove episode merging logic

## Code Impact

### TypeScript/Prisma Client

- `prisma.curatedPodcast` → `prisma.podcast`
- `prisma.curatedBundle` → `prisma.bundle`
- `prisma.curatedBundleEpisode` → merged into `prisma.episode`
- Field names remain camelCase in TS (e.g., `podcast.imageUrl`)

### API Routes

- `/api/curated-bundles` → queries `Bundle` with `isStatic = true`
- `/api/episodes` → single query across all episode types
- Admin routes → use unified models

### Database Queries (Raw SQL)

- Table names: `podcast`, `bundle`, `episode`, etc.
- Column names: `podcast_id`, `image_url`, `created_at`, etc.
- FK joins: `e.podcast_id = p.podcast_id` (no ambiguity)

## Future Benefits

1. **Performance**: Single queries replace dual queries + merging
2. **Maintainability**: One episode model, one podcast model
3. **Extensibility**: Easy to add new episode types or podcast sources
4. **Analytics**: Unified data makes reporting simpler
5. **Pruning**: Single episode table with clear indexing strategy

---

**Last Updated**: January 2025
**Migration Applied**: [Date when migration runs]
