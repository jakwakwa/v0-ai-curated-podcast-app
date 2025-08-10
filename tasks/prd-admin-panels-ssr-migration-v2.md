## Admin Panels SSR Migration v2

### Introduction / Overview
Migrate remaining legacy admin logic to the Server/Client panel pattern aligned with the App Router. Unify server-side rendering for read operations, adopt a hybrid approach for mutations (Server Actions where simple; keep APIs for complex/long-running), and retire legacy admin UI code under `components/admin-components/**`. This phase focuses on `admin/bundles`, `admin/podcasts`, and `admin/episodes` (restructure only; keep existing long-running behavior).

### Goals
- Standardize admin pages to the Server/Client panel pattern (thin pages, data in Server Components, interactivity in Client Components).
- Remove legacy `components/admin-components/**` once functionally replaced.
- Move client-side reads to server data fetching to improve consistency, SSR, and testability.
- Prefer Server Actions over client-initiated API calls for simple mutations; keep APIs for complex/long-running.

### User Stories
- As an admin, I can manage Bundles via a server-rendered panel so lists and details load consistently and quickly.
- As an admin, I can manage Podcasts with server-fetched data to avoid stale or inconsistent client state.
- As an admin, I can initiate and monitor Episode generation from the Episodes panel with current behavior preserved.
- As a developer, I can build new admin panels quickly by following the same Server/Client panel pattern with minimal `page.tsx` code.
- As a developer, I can test data loading and mutations reliably because reads happen on the server and simple mutations use Server Actions.

### In Scope (this phase)
- Admin Bundles: `app/(protected)/admin/bundles`
- Admin Podcasts: `app/(protected)/admin/podcasts`
- Admin Episodes (generation workflow): `app/(protected)/admin/episodes` (restructure only; keep existing long-running/polling approach)

### Out of Scope (non-goals for this phase)
- No domain logic changes
- No schema changes
- No major UI redesign

### Functional Requirements
1) Adopt panel file structure
   - Create or confirm `XPanel.server.tsx` and `XPanel.client.tsx` under `app/(protected)/admin/_components` for Bundles, Podcasts, Episodes.
   - Keep `page.tsx` thin for each admin route; it should primarily compose Server/Client panels.

2) Server-side reads
   - All read operations for admin panels must execute on the server (Server Components or server-side fetch to API routes).
   - Preserve current per-page caching behavior unless it is incorrect or causes staleness/bugs (e.g., leave existing ISR/dynamic settings as-is).

3) Hybrid mutations approach
   - Use Server Actions for simple, fast, idempotent mutations (e.g., toggle flags, simple create/update/delete without long processing).
   - Retain or (re)use `app/api/admin/**` endpoints for complex/long-running operations (e.g., background tasks, multi-step processes) and keep existing polling/status flows.

4) Authorization
   - Do not weaken current admin gating. Ensure existing protections remain intact at page, Server Component, Server Action, and route-handler boundaries.

5) UI/UX constraints
   - Preserve current layout, stepper, and general interaction patterns. Only structural refactor to the panel pattern; allow light copy/accessibility polish if trivial.

6) Uploads (GCS)
   - Continue using the existing Safe Google Cloud Storage initialization pattern per workspace rules. Do not log credentials or absolute paths.

7) Legacy cleanup
   - Remove `components/admin-components/**` and other legacy admin UI helpers once fully replaced. Update all imports to new panels.

8) Testing and quality gates
   - Add or adjust tests for migrated areas (at least one per panel for server-side reads, and one for a representative mutation path).
   - Ensure `pnpm build` and `pnpm lint` pass with no errors. Keep existing tests green.

9) Feature flag / rollback
   - Introduce a minimal feature flag per panel (e.g., `ADMIN_PANELS_V2_BUNDLES`, `ADMIN_PANELS_V2_PODCASTS`, `ADMIN_PANELS_V2_EPISODES`) to allow quick rollback to legacy behavior if needed.
   - Document how to toggle each flag and fallback behavior.

### Design Considerations
- Follow workspace patterns for admin pages: thin `page.tsx`, data in Server Components, interactivity in Client Components, safe uploads.
- Co-locate `loading.tsx` and `error.tsx` next to pages where helpful for UX, but do not expand scope into redesigns.
- Keep stepper UX intact for episodes; only reorganize code into panel structure.

### Technical Considerations
- Data fetching: Prefer server `fetch` or direct Prisma access in Server Components. Maintain current caching semantics per page; fix only if demonstrably incorrect.
- Mutations: Use Server Actions for simple forms/operations; keep APIs for heavy/long-running flows and continue current polling/status update behavior.
- Security: Maintain or strengthen checks via existing middleware and server boundaries. Never expose secrets client-side.
- Types and schema: Reuse Prisma and shared types per workspace rules; do not introduce new interfaces in page files.
- Files and locations: Panels under `app/(protected)/admin/_components`, pages remain thin under each admin route.
- Observability: Keep basic logging around Server Actions and error boundaries (avoid sensitive data). Use existing error utilities.

### Acceptance Criteria
- All in-scope pages use the Server/Client panel pattern and thin `page.tsx` composition.
- No client-side data fetching for reads; reads occur on the server.
- Mutations follow the hybrid approach (Server Actions for simple, APIs for complex/long-running).
- Admin routes remain fully admin-gated; no regression in authz.
- `pnpm build` and `pnpm lint` pass; existing tests remain green.
- Add/adjust tests for migrated panels.
- Remove dead legacy admin components and imports (`components/admin-components/**`) once replacement is verified.

### Success Metrics
- Build/lint/tests pass on CI with no new warnings/errors.
- Zero regressions reported in admin functionality during verification.
- Reduced client-side runtime errors related to data fetching in admin areas.

### Risks & Rollback
- Risk: Unexpected behavior differences when moving reads to the server (e.g., caching differences). Mitigation: preserve existing caching behavior and test critical paths.
- Risk: Long-running flows may have tight coupling to client code. Mitigation: restructure files only for Episodes this phase; keep the current polling/status mechanism.
- Rollback: Per-panel feature flags to switch back to legacy behavior quickly.

### Migration Plan & Milestones (proposed; adjust as needed)
- Milestone 1: Bundles (3–4 days)
  - Implement panels, migrate reads to server, adopt hybrid mutations where applicable, remove legacy components specific to Bundles.
- Milestone 2: Podcasts (2–3 days)
  - Implement panels, migrate reads to server, adopt hybrid mutations, remove relevant legacy components.
- Milestone 3: Episodes (4–5 days)
  - Restructure into panels without changing long-running behavior; keep current polling/status; ensure tests.
- QA/Hardening (2 days)
  - Verify acceptance criteria, remove remaining dead imports, validate flags and fallbacks.

### Open Questions
- For each in-scope page, confirm the current caching mode to explicitly preserve (ISR vs dynamic) and list any necessary corrections.
- Confirm preferred data source for reads: server `fetch` to existing API routes vs direct Prisma in Server Components (initially minimize refactors; can revisit later).
- Confirm naming and scope of feature flags (`ADMIN_PANELS_V2_*`) and whether a single umbrella flag is desired.
- Identify any additional legacy helpers beyond `components/admin-components/**` that should be removed in this phase.

### Appendix: File Map (targets)
- Bundles: `app/(protected)/admin/bundles/page.tsx` -> `BundlesPanel.server.tsx` + `BundlesPanel.client.tsx`
- Podcasts: `app/(protected)/admin/podcasts/page.tsx` -> `PodcastsPanel.server.tsx` + `PodcastsPanel.client.tsx`
- Episodes: `app/(protected)/admin/episodes/page.tsx` -> `EpisodeGenerationPanel.server.tsx` + `EpisodeGenerationPanel.client.tsx` (restructure only)
- Legacy to retire once replaced: `components/admin-components/**` (e.g., `source-list.tsx`, `source-list-item.tsx`)
