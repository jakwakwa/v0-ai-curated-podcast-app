# GCS Credentials Migration Guide

This document outlines the migration from the old Google Cloud Storage (GCS) credential system to the new environment-driven approach.

## Overview

The GCS initialization has been refactored to use environment-specific credential loading, removing the complex heuristic-based detection and legacy variable support. This simplifies configuration and improves security.

## Key Changes

### Removed Features
- ❌ `looksLikeJson()` and `maybeDecodeBase64()` helper functions
- ❌ Support for legacy `GCS_UPLOADER_KEY` and `GCS_READER_KEY` variables
- ❌ Automatic detection of JSON vs file path credentials
- ❌ Base64 decoding of environment variables

### New Features
- ✅ Environment-driven credential loading (`VERCEL_ENV` or `NODE_ENV`)
- ✅ Strict separation: Development uses PATH variables, Production/Preview uses JSON variables
- ✅ Centralized GCS helpers in `lib/gcs.ts`
- ✅ Explicit TypeScript declarations
- ✅ Improved error messages

## Environment Variable Requirements

### Development Environment
When `VERCEL_ENV=development` or `NODE_ENV=development`:

```bash
# Required - Key file paths
GCS_UPLOADER_KEY_PATH=/path/to/uploader-key.json
GCS_READER_KEY_PATH=/path/to/reader-key.json
GOOGLE_CLOUD_STORAGE_BUCKET_NAME=your-bucket-name
```

### Production/Preview Environment
When `VERCEL_ENV=production` or `VERCEL_ENV=preview`:

```bash
# Required - JSON credentials
GCS_UPLOADER_KEY_JSON={"type":"service_account","project_id":"..."}
GCS_READER_KEY_JSON={"type":"service_account","project_id":"..."}
GOOGLE_CLOUD_STORAGE_BUCKET_NAME=your-bucket-name
```

## Migration Steps

### 1. Update Environment Variables

#### Local Development (.env.local)
```bash
# Remove these legacy variables:
# GCS_UPLOADER_KEY=...
# GCS_READER_KEY=...

# Add these new variables:
GCS_UPLOADER_KEY_PATH=/path/to/your/uploader-service-account.json
GCS_READER_KEY_PATH=/path/to/your/reader-service-account.json
GOOGLE_CLOUD_STORAGE_BUCKET_NAME=your-bucket-name
```

#### Vercel Project Settings
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Remove legacy variables:
   - `GCS_UPLOADER_KEY`
   - `GCS_READER_KEY`
4. Add new variables for Production/Preview:
   - `GCS_UPLOADER_KEY_JSON` - Paste your uploader service account JSON
   - `GCS_READER_KEY_JSON` - Paste your reader service account JSON
   - `GOOGLE_CLOUD_STORAGE_BUCKET_NAME` - Your GCS bucket name

### 2. Update Service Account Permissions

Ensure your service accounts have the following minimum permissions:

**Uploader Service Account:**
- `roles/storage.objectAdmin` on the bucket
- `roles/storage.legacyBucketWriter` on the bucket

**Reader Service Account:**
- `roles/storage.objectViewer` on the bucket

### 3. Test the Migration

#### Development Testing
```bash
# Set development environment
export NODE_ENV=development
export GCS_UPLOADER_KEY_PATH=/path/to/uploader-key.json
export GCS_READER_KEY_PATH=/path/to/reader-key.json
export GOOGLE_CLOUD_STORAGE_BUCKET_NAME=your-bucket

# Run tests
pnpm build
pnpm lint
```

#### Production Testing
```bash
# Simulate production environment
export VERCEL_ENV=production
export GCS_UPLOADER_KEY_JSON='{"type":"service_account",...}'
export GCS_READER_KEY_JSON='{"type":"service_account",...}'
export GOOGLE_CLOUD_STORAGE_BUCKET_NAME=your-bucket

# Run tests
pnpm build
pnpm lint
```

### 4. Deploy and Verify

1. Deploy to Vercel
2. Test GCS operations (upload/download)
3. Verify no sensitive information appears in logs
4. Confirm admin upload functionality works
5. Confirm Inngest workflows function correctly

## Troubleshooting

### Common Issues

**Error: "Missing Google Cloud credentials for development environment"**
- Ensure `GCS_UPLOADER_KEY_PATH` and `GCS_READER_KEY_PATH` are set
- Verify the key files exist and are readable

**Error: "Missing Google Cloud credentials for production environment"**
- Ensure `GCS_UPLOADER_KEY_JSON` and `GCS_READER_KEY_JSON` are set
- Verify the JSON is valid and properly formatted

**Error: "Failed to initialize Google Cloud Storage clients"**
- Check service account JSON format
- Verify key file paths are correct
- Ensure bucket exists and service accounts have proper permissions

### Debugging

Enable development logging by setting `NODE_ENV=development`:
```bash
export NODE_ENV=development
# This will show "Initializing Storage clients (development - key file paths)"
```

## Security Considerations

- Never log or expose service account credentials
- Use environment-specific service accounts with minimal required permissions
- Regularly rotate service account keys
- Store JSON credentials securely in Vercel (they are encrypted at rest)

## Rollback Plan

If issues arise during migration:

1. Revert the `lib/gcs.ts` changes
2. Restore the old environment variables
3. Update imports in affected files to use the old approach
4. Test functionality before re-attempting migration

## Files Modified

- `lib/gcs.ts` - Refactored GCS initialization
- `app/api/admin/upload-episode/route.ts` - Updated to use centralized helpers
- `lib/inngest/gemini-tts.ts` - Updated to use centralized helpers
- `globals.d.ts` - Updated TypeScript declarations

## Validation Checklist

- [x] Environment variables updated in local `.env` files
- [x] Vercel project environment variables configured
- [x] Service account permissions verified
- [x] Local development testing passed (`pnpm build && pnpm lint`)
- [x] Production simulation testing passed
- [x] Deployed to Vercel successfully
- [ ] GCS operations (upload/download) working
- [x] No sensitive information in logs
- [ ] Admin upload functionality verified
- [ ] Inngest workflows verified
