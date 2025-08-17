# Product Requirements Document: Removal of Legacy Payment and Subscription Logic

## 1. Introduction/Overview

This document outlines the scope and requirements for safely and systematically removing all outdated membership, subscription, payment, and checkout-related logic, components, routes, and pages from the application. The goal is to streamline the codebase by eliminating redundant features that are no longer part of the simplified user flow.

The new, simplified user flow for managing subscriptions is centered around the `/manage-plan` route, specifically using `components/manage-plan/_page-containers/manage-plan-landing-page.tsx`. This page fetches and displays user membership data synced with Paddle.js, providing buttons to redirect to the Paddle customer portal for managing existing subscriptions (upgrade/downgrade/cancel) and using the Paddle overlay checkout for new subscriptions. The core challenge for this PRD is to ensure that the backend and frontend UI correctly sync with Paddle after users complete actions via overlays or portals, and all legacy code supporting the previous flow is removed.

## 2. Goals

*   Completely remove all components, pages, routes, and associated business logic related to the legacy membership, subscription, payment, and checkout flows.
*   Ensure the existing, simplified user flow (`/manage-plan` and its dependencies) remains fully functional and unaffected by the removals.
*   Achieve a clean and successful `pnpm build` with no linting errors after the cleanup.
*   Ensure all existing tests pass after the cleanup, and add new tests as necessary to validate the removal of legacy code and the continued functionality of the current flow.

## 3. User Stories

*   As a developer, I want all unused membership and payment-related code to be removed so that the codebase is cleaner and easier to maintain.
*   As a user, I want my subscription management experience on the `/manage-plan` page to remain seamless and fully functional after the cleanup.

## 4. Functional Requirements

### 4.1. Removals

The following components, pages, and API routes have been identified as potentially redundant and should be removed if they are not part of the current `/manage-plan` flow:

*   **Pages/Routes:**
    *   `/app/(protected)/payments/page.tsx`
    *   `/app/(protected)/payments/[subscriptionId]/page.tsx`
    *   `/app/(protected)/checkout/[priceId]/page.tsx` (This route contains a `Link` to it from `components/manage-plan/_components/pricing-plans.tsx`, but the new flow uses Paddle overlay checkout directly.)
    *   `/app/(protected)/checkout/success/page.tsx` (This page is likely tied to the old checkout flow).
*   **Components:**
    *   Any components exclusively used by the above-mentioned pages, such as `components/manage-plan/_page-containers/checkout-pages.tsx`
    *   Any other components or UI elements that are part of the old payment/subscription flow and are not directly used by the `/manage-plan` page or its children.
*   **API Routes (Backend Logic):**
    *   `/app/api/account/subscription/upgrade/route.ts` (The new flow uses Paddle customer portal, which handles upgrades directly).
    *   `/app/api/account/subscription/downgrade/route.ts` (Similar to upgrade, should be handled by Paddle customer portal).
    *   `/app/api/account/subscription/cancel/route.ts` (Similar to upgrade/downgrade, should be handled by Paddle customer portal).
    *   `/app/api/account/subscription/billing-history/route.ts` (If billing history is managed solely through Paddle's portal now).
    *   `app/(protected)/manage-membership/webhooks/paddle.ts` (Needs careful review: if this webhook specifically handles *legacy* Paddle events or data that is no longer relevant, it should be removed or refactored to only handle necessary sync operations for the *current* flow).
*   **Prisma Schema (Database):**
    *   Review `prisma/schema.prisma` for any fields or models (`Subscription` model or any related fields) that are *exclusively* used by the legacy payment flow and are no longer required for the simplified Paddle integration. **Exercise extreme caution here to avoid data loss.** Only remove if 100% certain it's unused.

### 4.2. Preservation

The following should be preserved and remain fully functional:

*   `app/(protected)/manage-membership/page.tsx`
*   `components/manage-plan/_page-containers/manage-plan-landing-page.tsx`
*   `components/manage-plan/_components/subscriptions/subscriptions.tsx`
*   `components/manage-plan/_components/subscriptions/views/subscription-view.tsx`
*   `components/manage-plan/_components/pricing-plans.tsx`
*   `lib/stores/subscription-store-paddlejs.ts`
*   `config/paddle-config.ts`
*   `app/api/account/subscription/route.ts` (GET endpoint to fetch current subscription status for UI)
*   `app/api/account/subscription/portal/route.ts` (POST endpoint to generate Paddle customer portal URL)
*   Any other components, hooks, or utilities directly supporting the `manage-plan-landing-page.tsx` and its described current flow.

## 5. Non-Goals (Out of Scope)

*   Refactoring or re-implementing any new payment or subscription features beyond the stated simplified flow.
*   Changes to the core Paddle integration logic (e.g., how Paddle.js is initialized or how the checkout overlay is opened) beyond removing references to deprecated flows.
*   Modification of any non-payment related features or components.
*   Removal of `Subscription` table or `PaddleSubscription` model from `prisma/schema.prisma` or `lib/stores/subscription-store-paddlejs.ts` unless it is absolutely clear they are no longer needed *at all* for the current Paddle integration (e.g., if we move to a completely different data storage mechanism for subscription data).

## 6. Design Considerations

*   No UI changes are expected as part of this cleanup, other than removing the legacy pages/components. The `/manage-plan` page should continue to look and function as it does currently.

## 7. Technical Considerations

*   Careful dependency analysis will be required to ensure that removing legacy files does not break existing, required functionality.
*   All imports and references to removed files must be cleaned up.
*   The `SubscriptionTestControls` component may need to be reviewed to ensure it only interacts with the current Paddle integration, and any legacy test controls are removed.

## 8. Success Metrics

*   A clean `pnpm build` output with no errors.
*   No linting errors reported after the cleanup.
*   All existing `vitest` tests pass successfully.
*   The `/manage-plan` route and its associated functionality (displaying subscription status, opening Paddle portal for management, opening Paddle checkout for new subscriptions) remain fully functional.
*   Manual verification that removed pages/routes are no longer accessible or rendered.

## 9. Open Questions

*   Is `app/api/account/subscription/billing-history/route.ts` definitively no longer needed, assuming billing history is handled within the Paddle customer portal?
*   Are there any other hidden dependencies or integrations with the legacy payment system that might not be immediately obvious from file paths?
