# Codebase Analysis Report: AI Podcast Curator

## Overview

**PODSLICE** is a sophisticated AI-powered podcast curation platform built with Next.js 15 and TypeScript. The application generates personalized AI podcast summaries with realistic voices, allowing users to consume podcast content efficiently through curated bundles and custom feeds.

---

## 1. Core Application Structure

### Architecture Overview
The application follows a **Next.js App Router** architecture with clear separation of concerns:

- **`app/`**: Next.js App Router structure with protected and public routes
- **`lib/`**: Business logic, utilities, and shared services
- **`components/`**: Reusable UI components organized by feature
- **`hooks/`**: Custom React hooks for state management and data fetching
- **`prisma/`**: Database schema and models
- **`config/`**: Application configuration files

### Key Architectural Patterns

#### 1. **Protected Route Pattern**
```
app/
├── (protected)/          # Authenticated routes with shared layout
│   ├── layout.tsx       # Sidebar, header, auth checks
│   ├── dashboard/
│   ├── episodes/
│   └── admin/
├── login/               # Public authentication routes
└── api/                 # API routes
```

#### 2. **Server-First Architecture**
- Server Components by default for data fetching
- Client Components only for interactivity (marked with `"use client"`)
- ISR (Incremental Static Regeneration) preferred with `revalidate` settings

#### 3. **Database-First Design**
- Prisma as ORM with PostgreSQL
- Snake_case fields mapped from schema
- Explicit TypeScript types generated from Prisma models

---

## 2. Key Architectural Patterns

### Component Architecture
- **Thin Pages**: Minimal `page.tsx` files that delegate to Server Components
- **Co-location**: `loading.tsx`, `error.tsx` alongside page components
- **Composition**: UI components built with shadcn/ui and Radix primitives

### Data Flow Pattern
```typescript
// Server Component (data fetching)
async function fetchData(): Promise<Episode[]> {
  const res = await fetch("/api/episodes", { next: { revalidate: 3600 } });
  return z.array(EpisodeSchema).parse(await res.json());
}

// Client Component (interactivity)
"use client";
export function InteractiveComponent({ data }: { data: Episode[] }) {
  // Handle user interactions
}
```

### API Route Convention
- RESTful patterns in `app/api/*/route.ts`
- Explicit timeout management with `maxDuration`
- Clerk authentication integration
- Prisma for database operations

---

## 3. Tech Stack Analysis

### Core Framework & Runtime
- **Next.js 15.2.4** - App Router with React Server Components
- **React 19.1.1** - Latest React with concurrent features
- **TypeScript 5.8.2** - Strict typing throughout
- **Node.js 22** - Latest LTS runtime

### Database & ORM
- **PostgreSQL** - Primary database
- **Prisma 6.14.0** - Type-safe ORM with client generation
- **@prisma/extension-accelerate** - Query acceleration

### Authentication & Authorization
- **Clerk** (`@clerk/nextjs 6.31.4`) - Complete auth solution
- Middleware-based route protection
- User sync to local database pattern

### UI & Styling
- **Tailwind CSS 4.1.12** - Utility-first styling
- **Shadcn/UI** - Component system built on Radix UI
- **Radix UI** - Accessible primitive components
- **Framer Motion 12.23.12** - Animations
- **Lucide React** - Icon library

### AI & Media Processing
- **Google AI SDK** (`@ai-sdk/google`) - Gemini integration
- **OpenAI 5.15.0** - Alternative AI provider
- **FFmpeg** - Audio processing
- **@distube/ytdl-core** - YouTube content extraction

### Payment & Subscriptions
- **Paddle** - Payment processing
- Plan-based access control with `PlanGate` enum

### Development & Build Tools
- **Biome 2.1.2** - Linting and formatting
- **Vitest** - Testing framework
- **PNPM** - Package manager

---

## 4. Key Files and Components

### Database Schema (`prisma/schema.prisma`)
**Critical Models:**
- **User** - User accounts with subscription data
- **Episode** - Unified episode table for all content
- **Podcast** - Podcast catalog
- **Bundle** - Curated podcast collections
- **UserCurationProfile** - Personalized user feeds
- **Subscription** - Payment and plan management

**Key Relationships:**
```prisma
User -> UserCurationProfile (1:1)
User -> Subscription[] (1:many)
Bundle -> Episode[] (1:many)
Podcast -> Episode[] (1:many)
```

### Type System (`lib/types.ts`)
**Type Safety Strategy:**
- Prisma-generated base types: `Prisma.$UserPayload["scalars"]`
- Custom composed types for relations
- Branded types for plan validation
- Runtime validation with Zod schemas

### Core Utilities (`lib/utils.ts`)
**Timeout Management:**
```typescript
withTimeout() - General 280s timeout for Vercel functions
withDatabaseTimeout() - 30s timeout for DB operations  
withUploadTimeout() - 120s timeout for file uploads
```

### Authentication Flow
**Structure:**
```
app/login/[[...rest]]/page.tsx -> Clerk SignIn component
app/(protected)/layout.tsx -> Auth checks + user sync
middleware.ts -> Route protection (in .cursorignore)
```

**User Sync Pattern:**
1. Clerk handles authentication
2. `app/api/sync-user/route.ts` syncs to local database
3. Protected layout ensures user is synced before rendering

### API Patterns (`app/api/`)
**Key Endpoints:**
- `sync-user/` - User synchronization
- `episodes/` - Episode management
- `user-episodes/` - User-generated content
- `curated-bundles/` - Bundle management
- `paddle-webhook/` - Payment webhooks

**Common Pattern:**
```typescript
export const maxDuration = 60; // Vercel timeout setting
export async function POST() {
  const { userId } = await auth(); // Clerk auth
  // Prisma database operations
  return NextResponse.json(data);
}
```

### Custom Hooks (`hooks/`)
**Key Hooks:**
- `use-breadcrumbs.ts` - Dynamic navigation breadcrumbs
- `use-mobile.ts` - Responsive design utilities
- `useEpisodeProgress.ts` - Audio playback state
- `use-paddle-Prices.ts` - Payment integration

### Component Organization (`components/`)
**Structure:**
```
components/
├── ui/                 # Base shadcn/ui components
├── features/           # Feature-specific components  
├── data-components/    # Data-fetching components
├── episodes/           # Episode-related components
└── app-sidebar.tsx     # Main navigation
```

### Configuration (`config/`)
- **`ai.ts`** - AI model settings, voice synthesis configuration
- **`paddle-config.ts`** - Payment plan definitions and pricing

---

## 5. Development Guidelines for Junior Developers

### Adding New Features

#### 1. **Create Protected Pages**
```typescript
// app/(protected)/new-feature/page.tsx
export const revalidate = 3600;

async function fetchData(): Promise<YourData[]> {
  // Server-side data fetching
}

export default async function NewFeaturePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <YourClientComponent data={await fetchData()} />
    </Suspense>
  );
}
```

#### 2. **API Route Creation**
```typescript
// app/api/your-endpoint/route.ts
export const maxDuration = 60;

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  // Your logic here
  return NextResponse.json({ success: true });
}
```

#### 3. **Database Operations**
- Always use exact field names from `prisma/schema.prisma`
- Import types from `@/lib/types` 
- Use snake_case for fields, camelCase for relations

#### 4. **Component Guidelines**
- Server Components for data fetching
- Client Components only when needed (`"use client"`)
- Use existing shadcn/ui components
- Import types with `import type`

### Code Quality Standards
- **Linting**: `pnpm lint` (Biome)
- **Type Safety**: Explicit return types required
- **Error Handling**: Runtime validation with Zod
- **Performance**: ISR preferred over dynamic rendering

### Common Patterns to Follow
- Thin pages with Server Component data fetching
- Client Components for interactivity only
- Co-located `loading.tsx` and `error.tsx`
- Timeout wrappers for long-running operations
- Prisma field names exactly as defined in schema

---

## Conclusion

This codebase represents a modern, production-ready Next.js application with sophisticated AI integration, robust authentication, and scalable architecture. The clear separation of concerns, type safety, and established patterns make it well-suited for collaborative development. Junior developers should focus on following the established patterns for protected routes, API development, and component composition while leveraging the extensive type system and utility functions already in place.