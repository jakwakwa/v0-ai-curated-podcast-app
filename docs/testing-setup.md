## Testing Guide — v0-ai-curated-podcast-app

This document explains how tests are set up in this repo, issues we solved to make them reliable, and how to write new tests for this codebase.

### Quickstart

1) Provide a test database URL in `.env.test` (project root):

```
TEST_POSTGRES_PRISMA_URL=postgresql://<user>:<pass>@<host>:<port>/<db>?schema=public
# or
TEST_DATABASE_URL=postgresql://<user>:<pass>@<host>:<port>/<db>?schema=public
```

2) Apply migrations to the test DB:

```
pnpm test:db:deploy
```

3) Run tests:

```
pnpm test
```


### What’s in place

- Runner: Vitest (Node environment, global APIs enabled)
- Location: tests live under `tests/`
- DB: Postgres via Prisma. Tests run against your test DB URL loaded from `.env.test`.

Key files:

- `vitest.config.ts`
  - Node environment, global expect/vi
  - Single-thread worker mode to avoid DB concurrency surprises
  - CSS/PostCSS loading disabled to avoid pulling in the project’s PostCSS config
  - Alias mapping for `@/…` to the repository root

- `tests/setup.ts`
  - Loads `.env.test` and maps `TEST_POSTGRES_PRISMA_URL` / `TEST_DATABASE_URL` → `DATABASE_URL`
  - Mocks `@clerk/nextjs/server` globally (`auth`, `currentUser`), so route handlers depending on Clerk won’t hit the real service
  - Silences some noisy logs during tests

- `tests/test-db.ts`
  - Provides `resetDb()` using `DELETE` against tables (fallback for environments lacking `TRUNCATE` privileges)
  - Use in `beforeEach` to start from a clean slate

- `tests/factories.ts`
  - Minimal helpers to create `user`, `podcast`, and `bundle`

Current coverage (podcast‑centric model):

- `tests/admin-upload-episode.test.ts`
  - Calls `POST` from `app/api/admin/upload-episode/route.ts` directly
  - Verifies episodes are created with a `podcast_id` and no `bundle_id`
  - Seeds an admin user (`is_admin: true`) to satisfy `requireAdminMiddleware`

- `tests/curated-bundles-api.test.ts`
  - Calls `GET` from `app/api/curated-bundles/route.ts`
  - Verifies returned `podcasts` and gating (`canInteract`, admin bypass)

- `tests/episodes-api-derivation.test.ts`
  - Calls `GET` from `app/api/episodes/route.ts`
  - Verifies visibility is derived from the user’s selected bundle’s podcasts plus their own profile episodes

- `tests/episode-no-bundle-id.test.ts`
  - Direct Prisma assertion that new episodes don’t set `bundle_id`


### Troubleshooting we solved (project-specific)

- Path aliases (`@/…`) failing in Vitest
  - The repo’s `tsconfig.json` maps `@/*` to multiple roots (not just `./src`). Instead of using `vite-tsconfig-paths` (which caused ESM loader issues), we added a direct alias in `vitest.config.ts`:
    - `alias: [{ find: /^@\//, replacement: <repoRoot>/ }]`
  - In a few route files that tests import directly, we replaced `@/lib/...` with explicit relative imports to avoid resolutions failing during tests.

- PostCSS config loaded by Vitest
  - Vitest attempted to load the project’s PostCSS config and crashed; we disabled it in `vitest.config.ts` with `css: { postcss: {} }`.

- Clerk imports in route handlers
  - Admin routes and others import `@clerk/nextjs/server`. We provided a global mock in `tests/setup.ts` for `auth` and `currentUser` to keep route handlers functional under test.

- Admin gating
  - `requireAdminMiddleware` checks the DB for `is_admin`. Tests seed an admin user with the known `user_id` (e.g., `"admin-user"`) before calling admin APIs.

- Prisma reset permissions
  - Some shared DBs don’t allow `TRUNCATE`. We implemented `DELETE` resets in `tests/test-db.ts` to ensure reliable cleanup.

- Non-interactive runs
  - We set `"test": "vitest run"` so CI/local runs exit automatically. The dot reporter can be enabled via `pnpm test -- --reporter=dot` if you prefer concise output.


### How to write tests for this repo

General guidance:

- Prefer testing Server logic via API route handlers in `app/api/**/route.ts`. They are small, use Prisma directly, and reflect actual behavior.
- Call route handlers directly with the standard `Request` object: `await GET(new Request("http://test.local"))` or `await POST(new Request(...))`.
- Use `resetDb()` in `beforeEach` to ensure clean state and factories to seed data.
- Mock only what’s necessary. Clerk is globally mocked. For admin routes, create an admin user first.
- Avoid external services in tests. For uploads, pass `audioUrl` to bypass GCS in `POST /api/admin/upload-episode`.

Patterns:

- API route test (example)

```ts
// tests/my-api.test.ts
import { beforeEach, describe, expect, it } from "vitest"
import { prisma } from "../lib/prisma"
import { resetDb } from "./test-db"
import { GET } from "../app/api/episodes/route" // import route handler

describe("episodes API", () => {
  beforeEach(async () => {
    await resetDb()
    // seed minimal data via prisma.create or factories
  })

  it("returns expected data", async () => {
    const res = await GET(new Request("http://test.local"))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(Array.isArray(json)).toBe(true)
  })
})
```

- Admin route test (remember to seed admin)

```ts
import { POST } from "../app/api/admin/upload-episode/route"
import { prisma } from "../lib/prisma"

await prisma.user.create({ data: { user_id: "admin-user", email: "a@test.com", password: "x", is_admin: true } })
const fd = new FormData(); fd.set("title", "Ep"); fd.set("audioUrl", "https://cdn/foo.mp3"); fd.set("podcastId", somePodcastId)
const res = await POST(new Request("http://test.local", { method: "POST", body: fd as any }))
expect(res.status).toBe(200)
```

- Client component tests (only when necessary)
  - Default environment is Node. For client UI, set per-file `test.environment = 'jsdom'` (or run with `--environment=jsdom`) and use `@testing-library/react`.
  - This repo encourages server-first testing; prefer testing the server APIs that power the UI.

Conventions:

- Place test files in `tests/`.
- Use `resetDb()` in `beforeEach`.
- Seed data through factories or Prisma.
- For uploads, prefer `audioUrl` over file I/O.
- Keep imports stable using `@/…` where possible; if a test reaches a file whose alias can’t resolve in Vitest, prefer adjusting that import to a relative path in the module under test.


### Commands

- Run tests once: `pnpm test`
- With dot reporter: `pnpm test -- --reporter=dot`
- Apply migrations to test DB: `pnpm test:db:deploy`


### Appendix: What the podcast‑centric tests enforce

- Episodes are created with a `podcast_id` and without `bundle_id`.
- Curated bundles expose podcasts via `bundle_podcast` and honor `min_plan` gating; admins bypass gating.
- Episodes returned to a user are derived from the podcasts inside their selected bundle plus their own `profile_id` episodes.

Testing setup for podcast-centric model

1) Start local Postgres for tests

```sh
docker compose -f docker-compose.test.yml up -d
```

2) Create .env.test

Copy the example and adjust if needed:

```
TEST_POSTGRES_PRISMA_URL=postgresql://podslice:podslice@localhost:54329/podslice_test?schema=public
```

3) Apply migrations to the test DB

```sh
DATABASE_URL="$(grep ^TEST_POSTGRES_PRISMA_URL .env.test | cut -d= -f2-)" pnpm prisma migrate deploy
```

4) Run tests

```sh
pnpm test
```

Notes
- tests/setup.ts loads .env.test and maps TEST_* → DATABASE_URL
- admin upload tests pass audioUrl to bypass GCS
- APIs are imported and invoked directly (no server needed)


