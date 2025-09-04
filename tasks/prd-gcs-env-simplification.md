## PRD: Simplify GCS Environment Credential Loading

### 1. Introduction/Overview
The current Google Cloud Storage (GCS) initialization relies on heuristics such as `looksLikeJson` and optional base64 decoding to infer whether credentials are JSON content or a filesystem path. On Vercel environments this can mis-detect, causing initialization failures. This PRD defines a deterministic, environment-driven approach: development uses key file paths; preview/production use JSON strings only. Logic is centralized in `lib/gcs.ts`, and all consumers reuse the canonical helpers.

### 2. Goals
- Establish a clear, deterministic mapping from environment → credential format.
- Centralize GCS client initialization in `lib/gcs.ts` with shared helpers.
- Remove `looksLikeJson` and base64 heuristics.
- Standardize variables and precedence; drop legacy names.
- Provide minimal, safe logging (debug in dev only; generic errors elsewhere).
- Keep return values consistent from upload helpers (object name only).

### 3. User Stories
- As a developer running locally, I provide key file paths via `GCS_UPLOADER_KEY_PATH` and `GCS_READER_KEY_PATH`, and uploads work reliably without JSON strings or heuristics.
- As an operator deploying to Vercel (preview/prod), I provide JSON strings via `GCS_UPLOADER_KEY_JSON` and `GCS_READER_KEY_JSON`, and uploads work without path checks.
- As an admin user, uploading an episode succeeds across environments and never logs secrets or credential paths.
- As a system owner, the Inngest Gemini TTS workflow can upload audio using the same shared initialization logic.

### 4. Functional Requirements
1. Centralization
   - Implement canonical helpers in `lib/gcs.ts`:
     - `getStorageUploader(): Storage`
     - `getStorageReader(): Storage`
     - `ensureBucketName(): string`
   - Internally cache singleton `Storage` clients per process.

2. Environment detection
   - Authoritative detection: use `VERCEL_ENV` if present; otherwise, fall back to `NODE_ENV`.
   - Map environments to credential formats:
     - Development: PATH only.
     - Preview/Production: JSON only.

3. Variables and precedence (no legacy)
   - JSON (preview/prod): `GCS_UPLOADER_KEY_JSON`, `GCS_READER_KEY_JSON` (required; hard fail if missing).
   - PATH (dev): `GCS_UPLOADER_KEY_PATH`, `GCS_READER_KEY_PATH` (required; hard fail if missing).
   - Drop legacy `GCS_*_KEY` variables entirely; no fallback to them.
   - Do not use ADC (`GOOGLE_APPLICATION_CREDENTIALS`) as a fallback.

4. Remove heuristics
   - Remove `looksLikeJson` and base64 decoding. Require plain JSON strings in `*_KEY_JSON` and plain filesystem paths in `*_KEY_PATH`.

5. Logging and errors
   - Dev: allow minimal debug logs indicating which mode (PATH/JSON) is used. Never log credential contents or absolute paths.
   - Preview/Prod: no debug logs; only generic error messages (no env var names, contents, or paths).

6. Upload helper outputs
   - Upload helpers return the object name only (e.g., `podcasts/<id>.wav`). Callers construct public URLs using `https://storage.cloud.google.com/${bucket}/${object}` when needed.

7. Consumers must reuse shared helpers
   - `app/api/admin/upload-episode/route.ts`: remove inline `Storage` init; use `getStorageUploader()` and `ensureBucketName()` from `lib/gcs.ts`.
   - `lib/inngest/gemini-tts.ts`: remove duplicate init; use `getStorageUploader()`/`getStorageReader()` and `ensureBucketName()` from `lib/gcs.ts`.

8. Types and declarations
   - Update `globals.d.ts` so all `GCS_*` env entries are type `string` and include only the standardized variables listed above.

9. Security
   - Absolutely no logging of credential contents or absolute paths in any environment.

### 5. Non-Goals (Out of Scope)
- Signed URL generation or public ACL changes.
- Token rotation or dynamic credential refresh.
- Changing bucket naming or access policies.
- Introducing client-side uploads.

### 6. Design Considerations
- Keep `page.tsx` thin patterns unaffected; this change targets server-only modules.
- Node runtime is required where file I/O may occur (already set on admin upload route).
- Centralized initialization avoids drift and reduces surface for secrets exposure.
- Prefer explicit, early failures with actionable but generic errors.
- Follow project rules: explicit typing, no `any`, import types via `import type`.

### 7. Technical Considerations
- `lib/gcs.ts` should export typed functions with explicit return types.
- Cache instantiated `Storage` clients to prevent repeated init cost.
- Use `ensureBucketName()` to validate `GOOGLE_CLOUD_STORAGE_BUCKET_NAME` early.
- Public URL construction remains in callers to keep storage helpers transport-agnostic.
- Ensure the admin route keeps `export const runtime = "nodejs"`.

### 8. Success Metrics
- Zero initialization failures attributable to env detection on Vercel preview/prod.
- Admin uploads succeed locally (PATH) and on Vercel (JSON) without code changes.
- Inngest Gemini TTS uploads succeed across environments using the shared helpers.
- No logs contain credential contents or absolute paths.

### 9. Open Questions
- Confirm authoritative environment precedence: use `VERCEL_ENV` when defined; otherwise `NODE_ENV`. (Default assumed in this PRD.)
- Confirm whether logging the bucket name is acceptable in dev (default: yes; never log credential paths or values).

### 10. Test Plan
- Smoke tests only (no unit test harness required):
  - Development (local): set `GCS_UPLOADER_KEY_PATH`, `GCS_READER_KEY_PATH` to valid key file paths; run admin upload route and Inngest flow; verify uploads and absence of sensitive logs.
  - Mocked preview/prod: set `VERCEL_ENV=preview` or `VERCEL_ENV=production` with `GCS_UPLOADER_KEY_JSON`, `GCS_READER_KEY_JSON` as plain JSON strings; verify uploads succeed; ensure no debug logs.
  - Failure cases: missing required variables in each environment produce generic error messages and no sensitive output.

### 11. Acceptance Criteria
- [ ] Admin upload works locally using PATH variables only.
- [ ] Admin upload works on Vercel preview/prod using JSON variables only.
- [ ] Inngest Gemini TTS upload works in all targeted environments.
- [ ] No reliance on `looksLikeJson` or base64 heuristics.
- [ ] No secrets or absolute paths appear in logs.

### 12. Migration Plan
- Replace existing logic outright; remove support for legacy `GCS_*_KEY` variables.
- Provide migration notes in both the PR description and a dedicated docs page:
  - Location suggestion: `docs/gcs-credentials-migration.md`.
  - Content: new environment mapping, required variables per environment, examples for Vercel project settings and local `.env`.

### 13. Risks and Mitigations
- Risk: Existing deployments relying on legacy variables will fail.
  - Mitigation: Clearly communicate in PR + docs, and update environment variables prior to rollout.
- Risk: Local developers without key files cannot run uploads.
  - Mitigation: Provide instructions to obtain service account keys and set PATH variables; document that JSON is not supported in dev by design.

### 14. File-level Changes
- `lib/gcs.ts`: implement environment-driven initialization and export canonical helpers; remove heuristics and base64 handling.
- `app/api/admin/upload-episode/route.ts`: remove inline Storage init; call `getStorageUploader()` and `ensureBucketName()`.
- `lib/inngest/gemini-tts.ts`: remove duplicate init; reuse `lib/gcs.ts` helpers.
- `globals.d.ts`: update env var types to `string` for `GCS_UPLOADER_KEY_PATH`, `GCS_READER_KEY_PATH`, `GCS_UPLOADER_KEY_JSON`, `GCS_READER_KEY_JSON`.


