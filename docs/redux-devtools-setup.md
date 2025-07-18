# Redux DevTools Setup for Zustand Stores

This document explains how Redux DevTools is configured in this Next.js 15 application with Zustand stores.

## Browser Extension Installation

1. Install the Redux DevTools Extension for your browser:
   - [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)
   - [Edge](https://microsoftedge.microsoft.com/addons/detail/redux-devtools/nnkgneoiohoecpdiaponcejilbhhikei)

## Current Setup

All Zustand stores in this application are configured with Redux DevTools support:

### Configured Stores

1. **Notification Store** (`notification-store`)
   - Manages notifications and unread counts
   - Actions: `loadNotifications`, `markAsRead`, `addNotification`, etc.

2. **Subscription Store** (`subscription-store`)
   - Manages user subscriptions and billing
   - Actions: `loadSubscription`, `upgradeTopremium`, `cancelSubscription`, etc.

3. **User Curation Profile Store** (`user-curation-profile-store`)
   - Manages user curation profiles with persistence
   - Actions: `createUserCurationProfile`, `updateUserCurationProfile`, etc.

### Development Only

DevTools are **only enabled in development mode** for better production performance:

```typescript
{
  name: 'store-name',
  enabled: process.env.NODE_ENV === 'development'
}
```

## Using Redux DevTools

### Opening DevTools

1. Start your development server: `npm run dev`
2. Open your browser's Developer Tools (F12)
3. Look for the "Redux" tab in the developer tools panel
4. If you don't see it, make sure the Redux DevTools extension is installed and enabled

### Features Available

- **Action History**: See all dispatched actions with timestamps
- **State Inspector**: View current state of each store
- **Time Travel**: Jump to any previous state
- **Action Replay**: Replay actions to see state changes
- **State Diffing**: See what changed between actions

### Action Naming Convention

Actions are named descriptively to make debugging easier:

```typescript
// Examples from the stores
'loadNotifications:start'
'loadNotifications:success'
'loadNotifications:error'
'createUserCurationProfile:start'
'updateUserCurationProfile:success'
```

## Adding DevTools to New Stores

When creating new Zustand stores, use the helper configuration:

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createDevtoolsConfig } from '@/lib/stores'

interface MyStore {
  // your store interface
}

export const useMyStore = create<MyStore>()(
  devtools(
    (set, get) => ({
      // your store implementation
    }),
    createDevtoolsConfig('my-store-name')
  )
)
```

## Troubleshooting

### DevTools Not Showing

This is the most common issue. Follow these steps in order:

1. **Verify Extension Installation**
   - Install [Redux DevTools Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
   - Check that the extension is enabled in your browser
   - Look for the Redux DevTools icon in your browser toolbar

2. **Check Development Mode**

   ```bash
   # Make sure you're running in development
   npm run dev
   # or
   pnpm dev
   ```

   - Open browser console and verify: `console.log(process.env.NODE_ENV)` shows `"development"`

3. **Force Store Initialization**
   - Navigate to any protected route (e.g., `/dashboard`)
   - Check for the green "DevTools Test" indicator in the top-right corner
   - Open browser console and look for the store initialization logs

4. **Manual Debugging**

   ```javascript
   // In browser console, run this to test store connection:
   import { initializeStoresForDevTools } from '@/lib/stores'
   initializeStoresForDevTools()
   ```

5. **Browser Refresh Strategy**
   - Open Redux DevTools BEFORE loading the page
   - Refresh the page with DevTools already open
   - Sometimes the extension needs to be open before stores are created

6. **Extension Reset**
   - Disable and re-enable the Redux DevTools extension
   - Clear browser cache and reload
   - Try in an incognito window

### Common Fixes

**Issue**: Extension installed but stores don't appear
**Solution**: The stores are lazy-loaded. Visit a page that uses the stores (like `/dashboard`) to initialize them.

**Issue**: Stores disappear after page navigation
**Solution**: This is normal behavior. Stores are re-initialized on each page load in development.

**Issue**: Only some stores appear
**Solution**: Only stores that have been used (components mounted) will appear. Navigate to different pages to see all stores.

### Performance Issues

- DevTools are automatically disabled in production
- If you experience performance issues in development, you can temporarily disable devtools by setting `enabled: false`

### Multiple Store Instances

Each store appears as a separate instance in Redux DevTools with its own action history and state.

## Next.js 15 Compatibility

This setup is fully compatible with Next.js 15's:

- App Router
- Server Components (stores are client-side only)
- TypeScript strict mode
- Development/production environments

## Best Practices

1. **Descriptive Action Names**: Use clear, hierarchical action names (e.g., `loadData:start`, `loadData:success`)
2. **Development Only**: Keep devtools disabled in production
3. **State Structure**: Design your state to be easily inspectable in DevTools
4. **Action Granularity**: Balance between too many and too few actions for good debugging experience
