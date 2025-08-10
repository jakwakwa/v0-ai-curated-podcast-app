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
- `app/api/admin/bundles/route.ts` - Admin Bundles mutations API.
- `app/api/admin/podcasts/route.ts` - Admin Podcasts API.
- `app/api/admin/generate-bundle-episode/route.ts` - Episode generation API.
- `app/api/admin/upload-episode/route.ts` - Episode upload API; verify safe GCS init.
- `app/api/curated-bundles/route.ts` - Curated bundles read API used by panels.
- `app/api/curated-podcasts/route.ts` - Curated podcasts read API used by panels.
- `lib/admin-middleware.ts` - Admin gating utilities.
- `lib/prisma.ts` - Prisma client for server-side data access.
- `lib/types.ts` - Shared types; import with `import type` only.
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

- [ ] 1.0 Finalize Server/Client panel structure for Bundles, Podcasts, Episodes
- [ ] 2.0 Implement per-panel feature flags and wiring for rollback (`ADMIN_PANELS_V2_*`)
- [ ] 3.0 Migrate simple admin mutations to Server Actions; keep complex/long-running via API routes
- [ ] 4.0 Verify and enforce admin authorization across pages, Server Components, Server Actions, and API routes
- [ ] 5.0 Legacy cleanup: retire `components/admin-components/**` after replacing usages; resolve `collections/[id]` dependency
- [ ] 6.0 Tests and quality gates: add/adjust tests, ensure `pnpm build` and `pnpm lint` pass, and validate no regressions
