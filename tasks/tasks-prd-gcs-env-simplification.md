## Relevant Files

- `lib/gcs.ts` - Main GCS client initialization module that will be refactored to use environment-driven credential loading
- `app/api/admin/upload-episode/route.ts` - Admin upload route that currently has inline Storage initialization logic to be removed
- `lib/inngest/gemini-tts.ts` - Inngest workflow that has duplicate GCS initialization logic to be removed
- `globals.d.ts` - TypeScript declarations file that needs updating for new environment variable types
- `docs/gcs-credentials-migration.md` - New documentation file to be created for migration guidance

### Notes

- The current implementation has three separate GCS initialization patterns across different files
- All files currently use `looksLikeJson` heuristics and base64 decoding which will be removed
- Environment detection will use `VERCEL_ENV` if present, otherwise fall back to `NODE_ENV`
- Development environment will only support key file paths, production/preview will only support JSON strings
- Legacy `GCS_*_KEY` variables will be completely removed

## Tasks

- [ ] 1.0 Refactor lib/gcs.ts with environment-driven credential loading
  - [ ] 1.1 Remove `looksLikeJson` and `maybeDecodeBase64` helper functions
  - [ ] 1.2 Implement environment detection using `VERCEL_ENV` (if present) or `NODE_ENV`
  - [ ] 1.3 Create environment-specific credential loading logic (dev=PATH only, prod/preview=JSON only)
  - [ ] 1.4 Update `initStorageClients()` to use new environment-driven approach
  - [ ] 1.5 Remove support for legacy `GCS_*_KEY` variables entirely
  - [ ] 1.6 Add appropriate logging (debug in dev, silent in prod/preview)
  - [ ] 1.7 Ensure all exported functions have explicit return types
  - [ ] 1.8 Test the refactored initialization logic

- [ ] 2.0 Update admin upload route to use centralized GCS helpers
  - [ ] 2.1 Remove inline `_storageUploader` variable and `getStorageUploader()` function
  - [ ] 2.2 Remove `looksLikeJson()` and `getUploaderRaw()` helper functions
  - [ ] 2.3 Import `getStorageUploader()` and `ensureBucketName()` from `lib/gcs.ts`
  - [ ] 2.4 Update `uploadContentToBucket()` to use imported helpers
  - [ ] 2.5 Replace direct `process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME` usage with `ensureBucketName()`
  - [ ] 2.6 Verify the route still works with `export const runtime = "nodejs"`
  - [ ] 2.7 Test admin upload functionality

- [ ] 3.0 Update Inngest Gemini TTS workflow to use centralized GCS helpers
  - [ ] 3.1 Remove inline `storageUploader` and `storageReader` variables
  - [ ] 3.2 Remove `looksLikeJson()` and `initStorageClients()` functions
  - [ ] 3.3 Remove `ensureBucketName()` function (use shared version)
  - [ ] 3.4 Import `getStorageUploader()`, `getStorageReader()`, and `ensureBucketName()` from `lib/gcs.ts`
  - [ ] 3.5 Update `uploadContentToBucket()` to use imported `getStorageUploader()`
  - [ ] 3.6 Update `_readContentFromBucket()` to use imported `getStorageReader()`
  - [ ] 3.7 Replace direct bucket name access with `ensureBucketName()` calls
  - [ ] 3.8 Test Inngest workflow functionality

- [ ] 4.0 Update TypeScript declarations for new environment variables
  - [ ] 4.1 Update `globals.d.ts` to change `GCS_UPLOADER_KEY_PATH` and `GCS_READER_KEY_PATH` from `Blob` to `string`
  - [ ] 4.2 Add `GCS_UPLOADER_KEY_JSON` and `GCS_READER_KEY_JSON` as `string` types
  - [ ] 4.3 Remove legacy `GCS_UPLOADER_KEY` and `GCS_READER_KEY` declarations
  - [ ] 4.4 Verify TypeScript compilation passes with new declarations

- [ ] 5.0 Create migration documentation and test the implementation
  - [ ] 5.1 Create `docs/gcs-credentials-migration.md` with migration guide
  - [ ] 5.2 Document new environment variable requirements per environment
  - [ ] 5.3 Provide examples for Vercel project settings and local `.env` files
  - [ ] 5.4 Document the removal of legacy variables and heuristics
  - [ ] 5.5 Test development environment with PATH variables only
  - [ ] 5.6 Test production/preview environment simulation with JSON variables only
  - [ ] 5.7 Verify no sensitive information appears in logs
  - [ ] 5.8 Run `pnpm build` and `pnpm lint` to ensure no errors
