# Schema Unification Migration Plan

Since the automated Prisma migration is having database connection issues, here's a manual migration plan for the schema unification.

## Option 1: Fresh Start (Recommended for Development)

Since you mentioned no user base and being OK with breaking changes:

```bash
# 1. Reset the database completely
npx prisma migrate reset --force

# 2. Apply all migrations with the new schema
npx prisma migrate dev

# 3. Seed with new unified data structure
npx prisma db seed
```

This will recreate all tables with the new naming convention and unified structure.

## Option 2: Data-Preserving Migration (For Later Production Use)

When you do have data to preserve, here's the SQL migration approach:

### Step 1: Create New Tables

```sql
-- New unified tables will be created by Prisma migrate
-- podcast, bundle, episode, profile_podcast, etc.
```

### Step 2: Migrate Data

```sql
-- Copy CuratedPodcast + Source → Podcast
INSERT INTO "podcast"(podcast_id, name, description, url, image_url, category, is_active, owner_user_id, created_at)
SELECT id, name, description, url, image_url, category, is_active, NULL, created_at
FROM "curated_podcasts";

INSERT INTO "podcast"(podcast_id, name, description, url, image_url, category, is_active, owner_user_id, created_at)
SELECT id, name, description, url, image_url, 'Custom', true, user_curation_profile_id, created_at
FROM "sources";

-- Copy CuratedBundle → Bundle
INSERT INTO "bundle"(bundle_id, name, description, image_url, is_static, is_active, created_at)
SELECT id, name, description, image_url, true, is_active, created_at
FROM "curated_bundles";

-- Copy Junction Tables
INSERT INTO "bundle_podcast"(bundle_id, podcast_id)
SELECT bundle_id, podcast_id
FROM "curated_bundle_podcasts";

-- Copy Episodes (User Episodes)
INSERT INTO "episode"(episode_id, podcast_id, profile_id, title, description, audio_url, image_url, published_at, week_nr, created_at)
SELECT id, source_id, user_curation_profile_id, title, description, audio_url, image_url, published_at, week_nr, created_at
FROM "episodes";

-- Copy Episodes (Bundle Episodes)
INSERT INTO "episode"(episode_id, podcast_id, bundle_id, title, description, audio_url, image_url, published_at, week_nr, created_at)
SELECT cbe.id, bp.podcast_id, cbe.bundle_id, cbe.title, cbe.description, cbe.audio_url, cbe.image_url, cbe.published_at, cbe.week_nr, cbe.created_at
FROM "curated_bundle_episodes" cbe
JOIN "bundle_podcast" bp ON bp.bundle_id = cbe.bundle_id
LIMIT 1; -- Each bundle episode maps to first podcast in bundle (adjust logic as needed)

-- Update User Profiles to point to new Bundle IDs
UPDATE "user_curation_profile"
SET selected_bundle_id = bundle_id
FROM "bundle"
WHERE "user_curation_profile".selected_bundle_id = "bundle".bundle_id;
```

### Step 3: Drop Old Tables

```sql
DROP TABLE "curated_bundle_episodes";
DROP TABLE "curated_bundle_podcasts";
DROP TABLE "curated_bundles";
DROP TABLE "curated_podcasts";
DROP TABLE "sources";
-- Note: Keep "episodes" structure but data was copied to unified table
```

## Current Recommendation

For development, go with **Option 1** (fresh start):

1. Back up any test data you want to keep
2. Run `npx prisma migrate reset --force`
3. Run `npx prisma migrate dev`
4. Run `npx prisma generate`
5. Update API routes and frontend code
6. Test the unified schema

This gives you a clean slate with the proper naming conventions and unified structure.

## Next Steps After Migration

1. Update API routes (`/api/episodes`, `/api/curated-bundles`, etc.)
2. Remove episode merging logic from dashboard pages
3. Run `pnpm build && pnpm lint` to verify everything works
4. Update any remaining references to old model names

---

**Status**: Ready to execute Option 1
**Blockers**: Database connection timeout for automated migration
**Risk**: Low (development environment, no users)
