## Account Settings Refactor

- **Goal**: Remove custom profile/security, split notifications and subscription into separate routes, wire Clerk Account Portal, and wipe Paystack.

### TODO
- [x] Create progress doc and Cursor TODO list
- [x] Add `/notification-preferences` page rendering `NotificationPreferences`
- [x] Add `/user-subscription` page and move `subscription-management.disabled.tsx`
- [x] Update breadcrumbs for new routes
- [x] Update `components/nav-user.tsx` with links:
  - Notification Preferences → `/notification-preferences`
  - Subscription → `/user-subscription`
  - Account Portal (Clerk) → accounts.<domain>/account?redirect_url=<app>
- [x] Remove Paystack UI/APIs and references (keep Paddle):
  - Delete `app/api/paystack/**`
  - Delete `app/api/account/subscription/**` (Paystack-only)
  - Delete `components/access-control.paystack.disabled.tsx`
  - Delete Paystack test controls; keep Paddle test controls
  - Update `config/ai.ts` to remove Paystack config
  - Remove Paystack migration files
  - Update Prisma schema to remove Paystack fields (User, Subscription)
- [x] Remove custom Profile/Security features:
  - Delete `/account` page and subcomponents
  - Delete stores: `profile-store.ts`, `security-store.ts`
  - Delete related APIs: `/api/account/profile/**`, `/api/account/security/**`
  - Delete `components/features/profile-management.tsx`
- [ ] Verify build and lint pass; fix residual references
- [ ] Generate and apply Prisma migration for Paystack field removals

### Notes
- Notifications API and UI preserved: `/api/account/notifications`, `components/user-account/notification-preferences.tsx`.
- Paddle references preserved.

### Changelog
- Initial setup: created progress doc and plan.
- Added routes: `/notification-preferences` and `/user-subscription`.
- Moved subscription UI to `app/(protected)/user-subscription/components/subscription-management.disabled.tsx`.
- Updated nav with new links and Clerk Account Portal direct link per Clerk docs (`redirect_url`).
- Removed Paystack (APIs, components, migration, config entries) and set Paddle-only controls.
- Removed legacy `/account` and custom profile/security APIs and stores.


