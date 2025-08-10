# PRD: Fix Vercel Deployment Failure (MIDDLEWARE_INVOCATION_FAILED)

## 1. Introduction/Overview

The project is currently experiencing a critical deployment failure on Vercel. While the build step succeeds, the deployment fails to go live, presenting a `500: INTERNAL_SERVER_ERROR` with the code `MIDDLEWARE_INVOCATION_FAILED`.

The Vercel runtime logs point to a specific error within the Clerk authentication middleware: `Error: Clerk: Handshake token verification failed: Unable to find a signing key in JWKS that matches the kid of the provided session token.`

This indicates a mismatch between the Clerk authentication keys used in the deployed environment and the keys configured in the Clerk.io dashboard. This document outlines the requirements to diagnose and resolve this issue.

## 2. Goals

*   Successfully deploy the application on Vercel without encountering the `MIDDLEWARE_INVOCATION_FAILED` error.
*   Restore the functionality of the authentication flow on deployed preview environments.
*   Ensure developers can reliably deploy new changes.

## 3. User Stories

*   **As a Developer,** I want to deploy my changes to Vercel without the deployment failing, so that I can test and ship new features.
*   **As an End-User,** I want to access the deployed application preview without seeing a 500 Internal Server Error, so that I can use the service.

## 4. Functional Requirements

1.  **Investigate Key Mismatch:** The developer must verify that the `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` environment variables in the Vercel project settings for Preview/Development environments exactly match the corresponding keys from the Clerk.io dashboard.
2.  **Correct Environment Variables:** If a mismatch is found, the developer must update the environment variables in Vercel to the correct values.
3.  **Trigger Redeployment:** After verifying and/or correcting the keys, the developer must trigger a new deployment on Vercel.
4.  **Verify Fix:** The new deployment must complete successfully, and the resulting deployment URL must be accessible without any `500` errors.
5.  **Confirm Authentication:** The developer must confirm that the user login and authentication flow is fully functional on the newly deployed preview environment.

## 5. Non-Goals (Out of Scope)

*   Refactoring the authentication middleware (`src/middleware.ts`). The existing code is assumed to be correct.
*   Upgrading Clerk or other major dependencies.
*   Addressing any other unrelated deployment or build warnings.

## 6. Technical Considerations

*   The issue is highly likely to be a configuration problem, not a code problem. The investigation should start with the Vercel and Clerk dashboards.
*   The error message `jwk-kid-mismatch` is the strongest clue, pointing directly to an invalid secret key.
*   Recent changes to API keys or environment variables were confirmed, making this the most probable cause.
*   The fix should not involve code changes unless a configuration-only solution is proven to be impossible.

## 7. Success Metrics

*   A Vercel deployment initiated after applying the fix completes successfully.
*   The live deployment URL loads without showing a `500 Internal Server Error`.
*   Users can successfully authenticate via Clerk on the deployed preview environment.

## 8. Open Questions

*   Are the Vercel environment variables correctly scoped to all necessary environments (Preview, Development)?
