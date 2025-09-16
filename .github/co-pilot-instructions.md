# Copilot Instructions for AI-Curated Podcast App

You are working on a Next.js App Router application for AI-curated podcasts. Follow these architectural principles and coding patterns at all times.

## Critical Architectural Rule: Source URL Processing

**NEVER download full audio/video files as preliminary steps.** The `srcUrl` is the single source of truth and must be processed directly:

- **Forbidden**: The deprecated `"download-and-store-audio"` pattern that causes timeouts
- **Required**: Direct API processing with Gemini or on-demand stream chunking with ffmpeg
- **Mantra**: "Process the stream, not the file. The URL is the source, not a download link."

Valid workflows only:
1. **Direct API**: Pass `srcUrl` directly to Gemini for video understanding
2. **Stream Chunking**: Use ffmpeg to process segments directly from `srcUrl` stream for long videos

## Next.js App Router Patterns

### Page Structure
- Place authenticated pages under `app/(protected)/...` to inherit global layout
- Keep `page.tsx` thin - data fetching in Server Components, interactivity in Client Components
- Co-locate `loading.tsx`, `error.tsx`, `route.ts` with `page.tsx`

### TypeScript Best Practices
- All functions must have explicit return types
- Use Zod for runtime validation of API responses
- Prisma schema is source of truth - use exact field names (snake_case for fields, camelCase for relations)
- Import types with `import type` from `@/lib/types.ts`
- Never create custom interfaces in page files

### Data Fetching
- Prefer ISR with `fetch(url, { next: { revalidate: seconds } })`
- Use `Promise.all` for parallel fetching
- Server Components first, pass data to Client Components via props
- Generate SEO metadata with `generateMetadata`

### Server Component Template
```typescript
import type { Metadata } from "next";
import { Suspense } from "react";
import { z } from "zod";
import type { MyData } from "@/lib/types";

export const revalidate = 3600;

const MyDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

async function fetchData(): Promise<MyData[]> {
  const res = await fetch("/api/example", { next: { revalidate } });
  if (!res.ok) throw new Error("Failed to load");
  const data = await res.json();
  return z.array(MyDataSchema).parse(data) as MyData[];
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Example", description: "Example page" };
}

export default async function Page() {
  const dataPromise = fetchData();
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <pre>{JSON.stringify(await dataPromise, null, 2)}</pre>
    </Suspense>
  );
}
```

### Client Component Template
```typescript
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { MyData } from "@/lib/types";

type ClientProps = {
  data: MyData[];
  label: string;
};

export function ClientComponent({ data, label }: ClientProps) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>{label}: {count}</p>
      <Button onClick={() => setCount((n) => n + 1)}>Increment</Button>
    </div>
  );
}
```

## Google Cloud Storage (Upload Routes)
- Use lazy initialization for upload routes
- Support JSON or path credentials: `GCS_UPLOADER_KEY_JSON` | `GCS_UPLOADER_KEY` | `GCS_UPLOADER_KEY_PATH`
- Never log credentials or absolute paths

## UI Guidelines
- Use existing shadcn/ui components (Button, Input, etc.)
- Prefer CSS Modules over Tailwind for new styles
- Always use Next.js `<Image />` component, never `<img>`
- Ensure accessibility with alt text, labels, focus states

## API Routes & Server Actions
- Place route handlers in `app/api/.../route.ts`
- Prefer Server Actions with `"use server"` directive for mutations
- Use `useFormStatus`, `useFormState`, `useOptimistic` in Client Components

## Middleware Protection
The middleware file exists and is protected in `.cursorignore`. Do not modify or question its existence.

## Development Checklist
- [ ] Pages under `app/(protected)/...` for authenticated layouts
- [ ] Server Components for data, Client Components for interactivity only
- [ ] Types imported from `@/lib/types.ts`, no hardcoded interfaces
- [ ] Uses `<Image />` and shadcn/ui components
- [ ] Parallel data fetching with `Promise.all`
- [ ] `pnpm build` and `pnpm lint` pass before commit
