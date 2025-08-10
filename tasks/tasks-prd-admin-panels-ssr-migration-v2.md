## Relevant Files

- `app/(protected)/admin/_components/BundlesPanel.server.tsx` - Server panel for Bundles; server-side reads and data shaping.
- `app/(protected)/admin/_components/BundlesPanel.client.tsx` - Client panel for Bundles; interactivity and mutations.
- `app/(protected)/admin/_components/PodcastsPanel.server.tsx` - Server panel for Podcasts; server-side reads.
- `app/(protected)/admin/_components/PodcastsPanel.client.tsx` - Client panel for Podcasts; interactivity.
- `app/(protected)/admin/_components/EpisodeGenerationPanel.server.tsx` - Server panel for Episodes; server-side reads.
- `app/(protected)/admin/_components/EpisodeGenerationPanel.client.tsx` - Client panel for Episodes; generation/upload flows.
- `app/(protected)/admin/_components/stepper.tsx` - Episode flow stepper (UI only).
- `app/(protected)/admin/bundles/page.tsx` - Thin page composing Bundles panel.
- `app/(protected)/admin/podcasts/page.tsx` - Thin page composing Podcasts panel.
- `app/(protected)/admin/episodes/page.tsx` - Thin page composing Episodes panel.
- `app/(protected)/admin/bundles/loading.tsx` - Loading fallback for Bundles admin route.
- `app/(protected)/admin/podcasts/loading.tsx` - Loading fallback for Podcasts admin route.
- `app/(protected)/admin/episodes/loading.tsx` - Loading fallback for Episodes admin route.
- `app/(protected)/admin/bundles/error.tsx` - Error boundary for Bundles admin route.
- `app/(protected)/admin/podcasts/error.tsx` - Error boundary for Podcasts admin route.
- `app/(protected)/admin/episodes/error.tsx` - Error boundary for Episodes admin route.
- `app/api/admin/bundles/route.ts` - Admin Bundles mutations API.
- `app/api/admin/podcasts/route.ts` - Admin Podcasts API.
- `app/api/admin/generate-bundle-episode/route.ts` - Episode generation API.
- `app/api/admin/upload-episode/route.ts` - Episode upload API; verify safe GCS init.
- `app/api/curated-bundles/route.ts` - Curated bundles read API used by panels.
- `app/api/curated-podcasts/route.ts` - Curated podcasts read API used by panels.
- `lib/admin-middleware.ts` - Admin gating utilities.
- `lib/prisma.ts` - Prisma client for server-side data access.
- `lib/types.ts` - Shared types; import with `import type` only.
- `lib/flags.ts` - Feature flags utility (to be added) for `ADMIN_PANELS_V2_*`.
- `components/admin-components/` - Legacy admin UI to retire (e.g., `source-list.tsx`, `source-list-item.tsx`).
- `app/(protected)/collections/[id]/page.tsx` - Current non-admin usage of `components/admin-components/source-list` to be considered before full removal.
- `tests/admin-upload-episode.test.ts` - Existing tests touching admin upload API.
- `tests/curated-bundles-api.test.ts` - Existing tests for curated bundles API.
- `tests/episodes-api-derivation.test.ts` - Existing tests for episodes API behavior.

### Notes

- Project uses Vitest. Run tests with `pnpm test` (or `pnpm test:watch`).
- Lint with `pnpm lint`; build with `pnpm build`.
- Follow workspace rules: thin pages, server reads, client interactivity, safe GCS init, and Prisma types from `lib/types.ts`.

## Tasks

- [x] 1.0 Finalize Server/Client panel structure for Bundles, Podcasts, Episodes
  - [x] 1.1 Audit existing `page.tsx` and panels to confirm thin pages and server-only reads; preserve current caching (`dynamic`/ISR)
  - [x] 1.2 Ensure Bundles/Podcasts/Episodes server panels only fetch on the server (either via `fetch` to existing APIs or Prisma)
  - [x] 1.3 Add co-located `loading.tsx` fallbacks for `bundles/`, `podcasts/`, and `episodes/` routes
  - [x] 1.4 Add co-located `error.tsx` boundaries for `bundles/`, `podcasts/`, and `episodes/` routes with minimal UX
  - [x] 1.5 Validate imports use `import type` for types and follow schema casing rules

- [ ] 2.0 Implement per-panel feature flags and wiring for rollback (`ADMIN_PANELS_V2_*`)
  - [ ] 2.1 Create `lib/flags.ts` with helpers (e.g., `isEnabled("ADMIN_PANELS_V2_BUNDLES")`); read from `process.env`
  - [ ] 2.2 Update `app/(protected)/admin/page.tsx` to conditionally surface links/entry points to new sub-pages based on flags
  - [ ] 2.3 Document `.env` usage for flags and add sensible defaults for local dev
  - [ ] 2.4 Add minimal unit tests for `lib/flags.ts`

- [ ] 3.0 Migrate simple admin mutations to Server Actions; keep complex/long-running via API routes
  - [ ] 3.1 Identify simple mutations per panel (e.g., Bundles: create, update visibility; Podcasts: create/update/toggle active)
  - [ ] 3.2 Implement Server Actions in server panels for identified simple mutations ("use server"), reusing Prisma and existing validation
  - [ ] 3.3 Update client panels to call Server Actions (keep `generate-bundle-episode` and `upload-episode` via APIs)
  - [ ] 3.4 Optional: Add optimistic UI for simple mutations where safe

- [ ] 4.0 Verify and enforce admin authorization across pages, Server Components, Server Actions, and API routes
  - [ ] 4.1 Confirm all `app/api/admin/**` routes call `requireAdminMiddleware`; add where missing
  - [ ] 4.2 Add server-side guard usage notes or wrapper to prevent accidental exposure in Server Actions
  - [ ] 4.3 Smoke test access patterns for admin vs non-admin users

- [ ] 5.0 Legacy cleanup: retire `components/admin-components/**` after replacing usages; resolve `collections/[id]` dependency
  - [ ] 5.1 Rehome `components/admin-components/source-list*` to a non-admin location (e.g., `components/data-components/`) and update imports in `collections/[id]/page.tsx`
  - [ ] 5.2 Remove `components/admin-components/**` once no references remain
  - [ ] 5.3 Remove obsolete docs references to CSS modules if any remain relevant

- [ ] 6.0 Tests and quality gates: add/adjust tests, ensure `pnpm build` and `pnpm lint` pass, and validate no regressions
  - [ ] 6.1 Add/adjust tests for server-side reads and server actions (at least one per panel)
  - [ ] 6.2 Run full test suite and fix failures
  - [ ] 6.3 Run `pnpm lint` and `pnpm build`; fix issues
  - [ ] 6.4 Prepare a brief migration notes update and verify feature flags behavior in local and CI
