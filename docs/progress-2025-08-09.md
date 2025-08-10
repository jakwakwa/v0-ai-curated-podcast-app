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


