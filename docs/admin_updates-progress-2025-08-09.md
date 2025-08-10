## Progress Report — 2025-08-09

### Overview
- Implemented bundle gating groundwork (PlanGate + min_plan), admin bypass, and UI that reflects lock states.
- Modularized admin surface further; added inline editing for bundle visibility (min_plan).
- Continued migration to podcast-centric episode model and secured GCS initialization/logging.

### Key Changes (Code)
- `app/api/curated-bundles/route.ts`
  - Admin bypass: treat admins as highest plan when computing allowed gates.
  - Returns `canInteract` and `lockReason` per bundle; sets `Cache-Control: no-store`.

- `components/features/bundle-list.tsx`
  - Honors `canInteract`; disables click/hover for locked bundles; dims card and shows lock reason.

- `app/(protected)/admin/_components/EpisodeGenerationPanel.server.tsx`
  - Fetches only active bundles.

- `app/(protected)/admin/_components/EpisodeGenerationPanel.client.tsx`
  - Bundle dropdown disables locked options; displays lock message with icon.
  - Safer upload method typing; avoids TS comparison error.
  - Disables upload button when selected bundle is locked.

- `app/(protected)/admin/_components/BundlesPanel.client.tsx`
  - Creation: includes Visibility selector (min_plan).
  - New “Edit visibility” dialog on each bundle; PATCHes `min_plan` via `/api/admin/bundles`.

- `app/(protected)/admin/bundles/page.tsx`, `app/(protected)/admin/podcasts/page.tsx`
  - Removed unnecessary `@ts-expect-error` directives.

- `app/api/admin/bundles/route.ts`
  - `PATCH` accepts `min_plan` and atomically replaces `bundle_podcast` relationships.
  - `POST` returns created bundle with relations (normalized shape).

- Testing & Validation (new)
  - Added Vitest-based test environment with project-specific configuration.
  - Implemented DB reset helper compatible with shared DBs (DELETE fallback).
  - Global mocks for `@clerk/nextjs/server` to enable API route testing.
  - Wrote podcast-centric derivation tests:
    - Admin upload creates episodes with `podcast_id` and no `bundle_id`.
    - Curated bundles API returns podcasts + gating; admin bypass validated.
    - Episodes API derives visibility from selected bundle podcasts + user’s profile episodes.
  - Stabilized imports by mapping `@/` to repo root for Vitest and replacing brittle aliases with relative imports where necessary.

- Prior (already in place):
  - `prisma/schema.prisma`: `PlanGate` enum + `Bundle.min_plan`; migration completed.
  - Podcast-centric episode flow in `inngest/gemini-tts.ts` and `app/api/admin/upload-episode/route.ts`.
  - Secure, lazy GCS initialization with redacted logs.

### UX Behavior
- All bundles remain visible. Locked bundles:
  - Show lock indicator and reason (“This bundle requires a higher plan.” by default).
  - Are disabled in selectors; cards dimmed and non-interactive.
- Admins implicitly bypass gating when retrieving curated bundles.

### Pending / Next
- Audit and update any remaining bundle selectors to respect `canInteract`.
- Optional: Make upgrade/lock copy configurable via admin or config source.
- Continue migrating older admin logic into server/client panel pattern where applicable.

### Notes
- Build was not run per instruction. The last local fixes addressed prior TS errors in the episode generation panel and removed unused `@ts-expect-error` annotations.

- Test suite now passes end-to-end against test DB; use `pnpm test:db:deploy` then `pnpm test`.

# Admin Updates Progress – 2025-08-09

## Admin Panels V2 Flags

New non-sensitive feature flags control visibility of the SSR admin panels links on the legacy Admin Dashboard page:

- `ADMIN_PANELS_V2_BUNDLES` (or `NEXT_PUBLIC_ADMIN_PANELS_V2_BUNDLES`)
- `ADMIN_PANELS_V2_PODCASTS` (or `NEXT_PUBLIC_ADMIN_PANELS_V2_PODCASTS`)
- `ADMIN_PANELS_V2_EPISODES` (or `NEXT_PUBLIC_ADMIN_PANELS_V2_EPISODES`)

Parsing is handled via `lib/flags.ts`. Accepted truthy values: `1,true,t,yes,y,on` (case-insensitive). Falsy values: `0,false,f,no,n,off`.

Recommended local `.env.local` entries:

```
NEXT_PUBLIC_ADMIN_PANELS_V2_BUNDLES=1
NEXT_PUBLIC_ADMIN_PANELS_V2_PODCASTS=1
NEXT_PUBLIC_ADMIN_PANELS_V2_EPISODES=1
```

These flags only control link visibility in the dashboard. Actual admin routes remain protected and functional regardless of flags.


