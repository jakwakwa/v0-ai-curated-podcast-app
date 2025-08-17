# Cache Quick Reference Guide

## Cache Durations at a Glance

| Data Type | Client Cache | Server Cache | Rationale |
|-----------|--------------|--------------|-----------|
| **Episodes** | 7 days | 7 days | Weekly releases |
| **User Profiles** | 24 hours | 24 hours | Infrequent changes |
| **Notifications** | 15 minutes | 15 minutes | Timely delivery |
| **Preferences** | 1 hour | 1 hour | Rare updates |

## Quick Commands

### Episode Caching
```typescript
// Get episodes (uses cache automatically)
const { episodes, isFromCache } = useEpisodesStore()

// Force refresh episodes
await refreshData()

// Invalidate profile cache after changes
invalidateProfileCache()
```

### Notification Caching
```typescript
// Get notifications (uses cache automatically)  
const { notifications, isFromCache } = useNotificationStore()

// Force refresh notifications
await refreshNotifications()

// Mark as read (optimistic update)
await markAsRead(notificationId)
```

## Cache Keys Reference

```typescript
// Episode system
"episodes_cache"     // All episodes data
"profile_cache"      // User curation profile

// Notification system  
"notifications_cache"  // Notifications array
"preferences_cache"    // Notification preferences
```

## API Cache Headers

```typescript
// Episodes API
headers: { "Cache-Control": "max-age=604800" } // 7 days

// Profiles API  
headers: { "Cache-Control": "max-age=86400" }  // 24 hours

// Notifications API
headers: { "Cache-Control": "max-age=900" }    // 15 minutes

// Preferences API
headers: { "Cache-Control": "max-age=3600" }   // 1 hour
```

## Debugging Cache Issues

```bash
# Check localStorage in browser console
localStorage.getItem("episodes_cache")
localStorage.getItem("notifications_cache")

# Clear all caches
Object.keys(localStorage).forEach(k => k.includes('cache') && localStorage.removeItem(k))

# Monitor cache hit rates in console
# Look for "Cache hit: YES/NO" messages in development
```

## Common Patterns

### Adding Cache to New Data

```typescript
// 1. Define cache duration
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

// 2. Check cache first
const cached = getCachedData("my_cache_key", CACHE_DURATION)
if (cached) return cached

// 3. Fetch and cache
const fresh = await fetchFromAPI()
setCachedData("my_cache_key", fresh)
return fresh
```

### Invalidating Cache on Updates

```typescript
// After any mutation
const updateData = async () => {
  await callAPI()
  localStorage.removeItem("relevant_cache_key")
  await refetchData()
}
```

### Cache-aware Components

```typescript
function MyComponent() {
  const { data, isFromCache, refresh } = useMyStore()
  
  return (
    <div>
      {isFromCache && <Badge>Cached</Badge>}
      <RefreshButton onClick={refresh} />
      <DataDisplay data={data} />
    </div>
  )
}
```

## Performance Tips

1. **Always check cache first** before API calls
2. **Use optimistic updates** for better UX
3. **Provide manual refresh** for user control
4. **Show cache indicators** in development
5. **Monitor cache hit rates** for optimization

## Emergency Cache Clear

```javascript
// In browser console - clears all app caches
Object.keys(localStorage).forEach(key => {
  if (key.includes('cache') || key.includes('store')) {
    localStorage.removeItem(key)
  }
})
location.reload()
```