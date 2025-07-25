# Vercel Build Troubleshooting Checklist

This file tracks the steps taken to diagnose and resolve the Vercel build failures.

## 1. Initial Diagnosis & Fixes

- [x] **Added `postinstall` Script**: Added `"postinstall": "npx prisma generate"` to `package.json` to ensure Prisma Client is generated correctly during Vercel's build process.
- [x] **Simplified `build` Script**: Removed the redundant `prisma generate` command from the `build` script in `package.json` since `postinstall` now handles it.
- [x] **Verified `schema.prisma`**: Confirmed that the project is not using a custom `output` path for the Prisma client, which is the correct setup for Vercel.
- [x] **Fixed Recursive Build Loop**: Corrected the `build` script in `package.json` from `"pnpm run build"` back to `"next build"` after an incorrect change.

## 2. Investigating Build-Time Errors

- [x] **Analyzed Build Logs**: Reviewed detailed logs and identified that the critical error was a `404 Not Found` response when the build process tried to connect to Prisma Accelerate.
- [x] **Purged Vercel Cache**: Confirmed that the Vercel build cache for the project was successfully purged through the Vercel dashboard.

## 3. Isolating the Problem

- [x] **Temporarily Disabled Prisma Accelerate**: Modified `lib/prisma.ts` to bypass the Accelerate extension for diagnostic purposes. This forces the build to attempt a direct database connection.

## 4. Current Step

- [ ] **Test with Direct Database Connection**: Re-deploy the project on Vercel with two conditions:
    1. Prisma Accelerate is disabled in the code.
    2. The `DATABASE_URL` environment variable in Vercel is set to the **direct `postgresql://`** connection string.
- [ ] **Re-enable Prisma Accelerate**: Once the direct connection build is successful, revert the changes in `lib/prisma.ts` and ensure the Vercel `DATABASE_URL` is set to the `prisma://` Accelerate connection string.

## 5. Overriding Vercel's Prisma Optimization

- [x] **Disabled Automatic Data Proxy**: Add the environment variable `PRISMA_GENERATE_DATAPROXY` with a value of `false` in the Vercel project settings to prevent Vercel from overriding the Prisma client configuration.

## 6. Component/Service Level Isolation (If Direct Connection Fails)

- [ ] **Create a Diagnostic Branch**: Create a new git branch to systematically disable parts of the application for testing.
- [ ] **Identify and Disable External Services**: Sequentially comment out or disable major external services to isolate the build failure. Good candidates to start with include:
  - Clerk auth components and middleware
  - Google Cloud Storage upload logic
  - Inngest server functions
  - ElevenLabs API calls
  - Stripe integration points
- [ ] **Deploy and Test**: After disabling each service, trigger a new Vercel deployment and observe the result.
- [ ] **Record Findings**: Note which service, when disabled, allows the build to succeed.

## 7. Final Test Configuration

- [x] **Fully Removed Prisma Accelerate**: The `@prisma/extension-accelerate` package has been removed from `package.json` to prevent Vercel from automatically activating the Data Proxy.
- [x] **Restored Prisma Client Logic**: Reverted `lib/prisma.ts` back to its original state.
- [ ] **Run Definitive Test**: Deploy with a direct `postgresql://` connection string to confirm if the build succeeds without Accelerate. This will isolate the problem to either the Accelerate connection or the application code.
