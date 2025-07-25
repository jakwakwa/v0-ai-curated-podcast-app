# Vercel Build Fixes Documentation

## Overview

This document details all the fixes applied to resolve Vercel deployment build errors that were preventing successful deployment. The main issues were related to Next.js client/server component boundaries, TypeScript compilation errors, and dynamic vs static generation conflicts.

## Primary Error

**Error**: `Cannot find module 'next/dist/client/components/client-reference-manifest.json'`

This error indicates a mismatch between client and server components in Next.js, specifically when server components try to use client-only features or when the static generation process encounters dynamic functions.

## Root Causes & Solutions

### 1. Client/Server Component Boundary Issues

#### Problem

Pages using Clerk's `auth()` function were being statically generated during build time, but `auth()` requires request-time execution (dynamic rendering).

#### Files Fixed

- `app/page.tsx` (Landing page)
- `app/build/page.tsx` (Build page)
- `app/(protected)/page.tsx` (Main protected page)

#### Solution

Added `export const dynamic = 'force-dynamic'` to force dynamic rendering:

```typescript
// Force this page to be dynamic since it uses auth()
export const dynamic = 'force-dynamic'

export default async function PageName() {
  const { userId } = await auth() // Now works correctly
  // ... rest of component
}
```

### 2. Protected Layout Client Component Conversion

#### Problem

The protected layout (`app/(protected)/layout.tsx`) was a server component but used `SidebarProvider` which is a client component, creating a boundary conflict.

#### Solution

Converted the layout to a client component and added CSS modules:

```typescript
"use client"

import { SidebarProvider } from "@/components/ui/sidebar-ui"
import styles from './layout.module.css'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className=".container" >
        {/* ... layout content */}
      </div>
    </SidebarProvider>
  )
}
```

### 3. Main Protected Page Client Component Conversion

#### Problem

The main protected page was a server component calling `getUserCurationProfile()` (which uses `auth()`) while the layout was a client component.

#### Solution

Converted to client component with proper data fetching pattern:

```typescript
"use client"

import { useState, useEffect } from "react"
import type { Episode, UserCurationProfileWithRelations } from "@/lib/types"

export default function DashboardPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [savedCollections, setSavedCollections] = useState<UserCurationProfileWithRelations[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [episodesData, collectionsData] = await Promise.all([
          getEpisodes(),
          getUserCurationProfile()
        ])
        setEpisodes(episodesData)
        setSavedCollections(collectionsData.filter(c => c.status === "Saved"))
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ... rest of component
}
```

### 4. Prisma Type Generation Issues

#### Problem

TypeScript compilation failed with `Module '@prisma/client' has no exported member 'UserCurationProfile'` and similar errors.

#### Solution

Regenerated Prisma client to sync with current schema:

```bash
npx prisma generate
```

This resolved all Prisma type import issues in `lib/types.ts`.

### 5. TypeScript Type Annotation Issues

#### Problem

`useState` hooks initialized with empty arrays were inferred as `never[]` instead of proper types:

```typescript
// ❌ Problematic - inferred as never[]
const [episodes, setEpisodes] = useState([])

// Error: Argument of type 'Episode[]' is not assignable to parameter of type 'SetStateAction<never[]>'
```

#### Solution

Added explicit type annotations:

```typescript
// ✅ Fixed with proper typing
const [episodes, setEpisodes] = useState<Episode[]>([])
const [savedCollections, setSavedCollections] = useState<UserCurationProfileWithRelations[]>([])
```

### 6. Component Prop Interface Mismatches

#### Problem

The `DataTable` component expected `userCurationProfiles` prop but was receiving `savedCollections`.

#### Solution

Fixed prop name to match component interface:

```typescript
// ❌ Before
<DataTable episodes={episodes} savedCollections={savedCollections} />

// ✅ After
<DataTable episodes={episodes} userCurationProfiles={savedCollections} />
```

### 7. Complex Type Definitions

#### Problem

The `Episode` type needed to match the exact structure expected by the `DataTable` component's zod schema.

#### Solution

Updated the `Episode` type in `lib/types.ts` to include the nested `userCurationProfile` structure:

```typescript
export type Episode = {
  id: string
  title: string
  description: string | null
  audioUrl: string
  imageUrl: string | null
  publishedAt: Date | null
  weekNr: Date
  createdAt: Date
  sourceId: string
  userCurationProfileId: string
  userCurationProfile?: {
    id: string
    audioUrl: string | null
    imageUrl: string | null
    createdAt: Date
    name: string
    userId: string
    status: string
    updatedAt: Date
    generatedAt: Date | null
    lastGenerationDate: Date | null
    nextGenerationDate: Date | null
    isActive: boolean
    isBundleSelection: boolean
    selectedBundleId: string | null
    sources: any[]
    episodes: any[]
  } | null
  source?: Source | null
}
```

## CSS Modules Conversion

As part of the fixes, we converted Tailwind CSS classes to CSS modules following the project's coding standards:

### Protected Layout CSS Module

Created `app/(protected)/layout.module.css`:

```css
.container {
  display: flex;
  height: 100vh;
  width: 100%;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content {
  flex: 1;
  overflow: auto;
}
```

## Build Process Verification

After all fixes, the build process successfully completed:

1. ✅ Dependencies installed
2. ✅ Prisma client generated
3. ✅ TypeScript compilation passed
4. ✅ Next.js build completed
5. ✅ All pages properly generated (static/dynamic as appropriate)

## Key Takeaways

1. **Always mark pages using `auth()` as dynamic**: Add `export const dynamic = 'force-dynamic'`
2. **Maintain consistent client/server boundaries**: If a layout is client, child pages should generally be client too
3. **Regenerate Prisma client after schema changes**: Run `npx prisma generate` when types are missing
4. **Use explicit TypeScript annotations**: Don't rely on inference for complex state types
5. **Verify component prop interfaces**: Ensure prop names match exactly what components expect
6. **Follow project conventions**: Use CSS modules instead of Tailwind classes

## Files Modified

### Pages

- `app/page.tsx` - Added dynamic export
- `app/build/page.tsx` - Added dynamic export + CSS modules
- `app/(protected)/layout.tsx` - Converted to client component + CSS modules
- `app/(protected)/page.tsx` - Converted to client component + proper typing

### Types

- `lib/types.ts` - Fixed Episode type structure

### Stylesheets

- `app/(protected)/layout.module.css` - New CSS module
- `app/build/page.module.css` - New CSS module

## Future Prevention

To prevent similar issues:

1. Always test builds locally before deploying
2. Use TypeScript strict mode to catch type issues early
3. Follow the project's client/server component guidelines
4. Regenerate Prisma client after any schema changes
5. Use proper TypeScript annotations for all state management

---

*Last updated: [Current Date]*
*Build successful on: Vercel*
