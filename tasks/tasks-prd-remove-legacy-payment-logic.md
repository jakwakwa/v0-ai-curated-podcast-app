## Relevant Files

- `app/(protected)/payments/page.tsx` - Legacy payments page to be removed.
- `app/(protected)/payments/[subscriptionId]/page.tsx` - Legacy specific subscription payment page to be removed.
- `app/(protected)/checkout/[priceId]/page.tsx` - Legacy checkout page to be removed.
- `app/(protected)/checkout/success/page.tsx` - Legacy checkout success page to be removed.
- `components/manage-plan/_page-containers/checkout-pages.tsx` - Contains old checkout page containers.
- `app/api/account/subscription/upgrade/route.ts` - Legacy API route for subscription upgrade.
- `app/api/account/subscription/downgrade/route.ts` - Legacy API route for subscription downgrade.
- `app/api/account/subscription/cancel/route.ts` - Legacy API route for subscription cancellation.
- `app/api/account/subscription/billing-history/route.ts` - Legacy API route for billing history.
- `app/(protected)/manage-membership/webhooks/paddle.ts` - Webhook handler, needs review for legacy event handling.
- `prisma/schema.prisma` - Database schema, needs review for legacy payment-related fields/models.
- `components/manage-plan/_components/pricing-plans.tsx` - Needs modification to remove the Link to `/checkout/[priceId]`.
- `components/user-account/subscription-test-controls.tsx` - Needs review to ensure it only interacts with current Paddle integration.
- `tests/` - Existing test files will need to be updated or new ones added.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx vitest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Vitest configuration.

## Tasks

- [ ] 1.0 Remove Legacy Frontend Pages and Components
  - [ ] 1.1 Delete all specified legacy frontend pages (`/app/(protected)/payments/page.tsx`, `/app/(protected)/payments/[subscriptionId]/page.tsx`, `/app/(protected)/checkout/[priceId]/page.tsx`, `/app/(protected)/checkout/success/page.tsx`) and the `components/manage-plan/_page-containers/checkout-pages.tsx` component, along with any other components exclusively used by these deleted pages.
  - [ ] 1.7 Remove all imports and references to the deleted frontend files.
- [ ] 2.0 Remove Legacy Backend API Routes
  - [ ] 2.1 Delete `/app/api/account/subscription/upgrade/route.ts`
  - [ ] 2.2 Delete `/app/api/account/subscription/downgrade/route.ts`
  - [ ] 2.3 Delete `/app/api/account/subscription/cancel/route.ts`
  - [ ] 2.4 Delete `/app/api/account/subscription/billing-history/route.ts`
  - [ ] 2.5 Carefully review `app/(protected)/manage-membership/webhooks/paddle.ts` to identify and remove any legacy event handling logic. If the entire file is dedicated to legacy events, delete it. Otherwise, refactor to only handle necessary sync operations for the *current* flow.
  - [ ] 2.6 Remove all imports and references to the deleted backend API routes.
- [ ] 3.0 Review and Clean Up Database Schema
  - [ ] 3.1 Carefully review `prisma/schema.prisma` for any fields or models that are *exclusively* used by the legacy payment flow and are no longer required for the simplified Paddle integration. Exercise extreme caution here to avoid data loss.
  - [ ] 3.2 Generate a new Prisma migration if any schema changes are made.
  - [ ] 3.3 Apply the Prisma migration to the development database.
- [ ] 4.0 Update Existing Components and Utilities
  - [ ] 4.1 Modify `components/manage-plan/_components/pricing-plans.tsx` to remove the `<Link>` component that navigates to `/checkout/[priceId]`. Ensure Paddle overlay checkout is used directly.
  - [ ] 4.2 Review `components/user-account/subscription-test-controls.tsx` to ensure it only interacts with the current Paddle integration and remove any legacy test controls.
  - [ ] 4.3 Review `lib/stores/subscription-store-paddlejs.ts` to remove any `TODO` comments related to unimplemented Paddle API calls (cancel, resume, updatePaymentMethod, updateSubscription) if these are now handled via the Paddle customer portal or overlay.
- [ ] 5.0 Validate Cleanup and Ensure System Stability
  - [ ] 5.1 Run `pnpm install` to ensure all dependencies are correct after deletions.
  - [ ] 5.2 Run `pnpm build` and resolve any build errors.
  - [ ] 5.3 Run `pnpm lint` and resolve any linting errors.
  - [ ] 5.4 Run all `vitest` tests (`npx vitest`) and ensure they pass. Update existing tests or add new ones as necessary to cover the changes.
  - [ ] 5.5 Manually verify that the `/manage-plan` route and its associated functionality (displaying subscription status, opening Paddle portal for management, opening Paddle checkout for new subscriptions) remain fully functional.
  - [ ] 5.6 Manually verify that the removed pages/routes are no longer accessible or rendered by attempting to navigate to them directly.
  - [ ] 5.7 Address the open questions from the PRD:
    - [ ] 5.7.1 Confirm if `app/api/account/subscription/billing-history/route.ts` is definitively no longer needed.
    - [ ] 5.7.2 Investigate any other hidden dependencies or integrations with the legacy payment system.
