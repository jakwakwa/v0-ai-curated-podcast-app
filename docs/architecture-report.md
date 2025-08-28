# PodSlice Codebase – Strategic Architecture Report

*(Prepared by: Senior Software Architect AI)*  

---

## 1. Executive Summary  
PodSlice is a full-stack, AI-powered podcast-curation platform. It ingests public podcast / YouTube content, generates short “AI-hosted” audio episodes, and delivers them to users through personalised bundles and weekly recommendations.

Revenue is subscription-based (Paddle). Authentication/authorisation is delegated to Clerk; content processing is delegated to Inngest workflows that use Google Gemini (text + TTS) and Google Cloud Storage; data persistence is handled by a Postgres DB accessed through Prisma.

The architecture embraces the Next.js 13/14 App Router with Server Components, favouring thin pages, server-side data fetching, and client components only where interactivity is needed. This yields excellent scalability, clear separation of concerns, and predictable rendering behaviour.

---

## 2. Application Domain & Business Logic

### 2.1 Key Business Entities (from `schema.prisma`)
* **User** – Clerk identity, subscription status, notification prefs.
* **UserEpisode** – a user-requested AI episode generated from a single YouTube URL.
* **Podcast & Episode** – canonical catalogue tables for external shows and their episodes.
* **Bundle** – a static or user-owned collection of podcasts (e.g., “Tech News Weekly”).
* **UserCurationProfile** – a user’s active listening profile (may reference a Bundle).
* **Subscription** – Paddle subscription instance linked to a User.
* **Notification** – in-app + email notifications (episode ready, etc.).
* **EpisodeFeedback** – thumbs-up/down reactions.
* Gate-keeper enums: `PlanGate`, `UserEpisodeStatus`, `FeedbackRating`.

### 2.2 Representative User Journeys
1. **New user sign-up & sync**  
   1. Clerk authenticates user → `/app/api/sync-user/route.ts` ensures a matching `user` row, tolerating legacy email duplicates.  
   2. Front-end shows onboarding / bundle selection.

2. **User generates first AI podcast summary**  
   1. User picks videos → client calls `/app/api/user-episodes/create`.  
   2. Route fires Inngest event `podcast/generate-gemini-tts.requested`.  
   3. Workflow (`lib/inngest/gemini-tts.ts`):  
      • fetches transcripts with `lib/transcripts`,  
      • summarises with Gemini LLM,  
      • scripts and synthesises audio (Gemini TTS) → stores WAV in GCS,  
      • creates `episode` row linked to `user_curation_profile`,  
      • pushes notification + email via `lib/email-service.ts`.

3. **Admin curates bundle episode**  
   Similar to above but via `/app/api/admin/generate-bundle-episode` with admin guard (`lib/admin.ts`).  
   Generated episodes link to a `bundle_id`, then notifications are broadcast to every profile that selected the bundle.

4. **Payment lifecycle**  
   1. User clicks “Subscribe” – Paddle checkout collects payment.  
   2. Webhook `/app/api/paddle-webhook` verifies signature, passes event to `utils/paddle/process-webhook.ts` which updates `subscription` rows.  
   3. Users can trigger `/app/api/account/subscription/sync` to re-sync manual discrepancies.

---

## 3. Core Application Architecture

### 3.1 High-level Diagram (textual)
```text
[Browser] ─▶ Next.js /app
              ├─ Server Components (data fetching)
              │   ├─ Prisma ↔ Postgres
              │   └─ Clerk server helpers (auth)
              ├─ Client Components (UI, shadcn)
              └─ API Routes (/app/api/…)
                    ├─ Auth sync / User episode / Admin / Paddle
                    └─ Emits Inngest events ─▶ Inngest cloud
                                                     │
                                                     ▼
                      Inngest Function (Gemini workflow) ──▶ Google Gemini / YouTube
                                                     │
                                                     ▼
                           Synthesised audio file in Google Cloud Storage
                                                     │
                                                     ▼
                          Post-processing → Prisma episode rows + notifications
```

### 3.2 Architectural Rationale
* **Next.js App Router + Server Components** – SSR for SEO, streaming, built-in caching (`revalidate`), and reduced JS on client.
* **Inngest** – separates long-running AI workflows from request/response cycle; retry semantics and observability.
* **Google AI + GCS** – leverages state-of-the-art LLM + TTS with cheap object storage; lazy client initialisation avoids cold-start penalties.
* **Prisma** – type-safe ORM, auto-generated TS types enforcing schema consistency.
* **Paddle** – “merchant-of-record” SaaS billing; simplifies tax/vat compliance.
* **Clerk** – drop-in auth + user management; sync pattern keeps internal user table for business logic flexibility.

---

## 4. Key Systems and Logic Breakdown

### 4.1 User & Auth System
* **Integration**: `@clerk/nextjs` for both client hooks (`useAuth`, `useClerk`) and server helpers (`auth`, `currentUser`).
* **Session Enforcement**:  
  * Protected layouts under `app/(protected)/…` rely on Clerk middleware.  
  * Server actions & API routes guard with `auth()`.
* **Admin Pattern**: `lib/admin.ts` compares `userId` to `process.env.ADMIN_USER_ID`; reusable guards.
* **User Sync**: `/api/sync-user` called post-sign-in; upserts user row ensuring email uniqueness.

*Pros*: SaaS auth offloads complexity; internal users table allows future migration.  
*Cons*: Double-write risk (Clerk & internal); env var for admin is brittle for ≥2 admins.

### 4.2 Content Pipeline

| Stage | File(s) | Purpose | Notable Design Choices |
|-------|---------|---------|------------------------|
| Event Trigger | `app/api/user-episodes/create` & admin route | Accepts request, validates bundle/podcast membership | Thin route; emits Inngest event |
| Transcription | `lib/transcripts` | Retrieves/derives captions; supports paid transcripts | Abstracted behind orchestrated fn |
| Summarisation | `lib/inngest/gemini-tts.ts` step “summarize-content” | `@ai-sdk/google` + Gemini model | AI config pluggable |
| Script Gen | Same file: “generate-script” step | Re-prompts Gemini | Prompt engineering to remove role labels |
| Audio Synth | `generateAudioWithGeminiTTS` | Streams audio, converts to WAV, uploads to GCS | Simulate mode for tests |
| Persistence | Prisma `episode.create` | Links entities; stores Cloud URL | Transactional integrity |
| Notification | `email-service.ts` + Prisma | In-app + email notifications | Centralised templates |

*Trade-offs*: 100 % server-side generation avoids client compute; reliance on Gemini TTS beta – latency & cost volatility.

### 4.3 Billing & Subscription System
* **Pricing Definition**: `config/paddle-config.ts` enumerates tier metadata + `PlanGate` mapping.
* **Checkout**: Front-end uses Paddle price IDs; webhook verifies signature.
* **Processing**: `utils/paddle/process-webhook.ts` maps events to DB updates.
* **Manual Sync**: `/api/account/subscription/sync` endpoint assists support.

*Robustness*: Signature verification; idempotent writes.  
*Scalability*: Paddle offloads billing & tax.

---

## 5. Tech Stack & Dependency Roles

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Front-end | Next.js 13+, React 18, App Router, Tailwind CSS + shadcn | Modern SSR + islands; rapid UI dev |
| Auth | Clerk | Social logins, MFA, session tokens |
| Server | Node 18 (Vercel) | Edge/ISR ready |
| Job Orchestration | Inngest | Background workflows, retries |
| AI | Google Gemini, `ai-sdk`, `@google/genai` | Multimodal generation |
| Data | Prisma ORM → Postgres | Type safety, migrations |
| Storage | Google Cloud Storage | Cheap object storage |
| Billing | Paddle SDK | Merchant-of-record |
| Email | Custom `email-service.ts` | Transactional emails |
| Testing | Vitest, Supertest | Fast CI |
| Tooling | pnpm, Biome | Monorepo efficiency |

---

## 6. Insights & Strategic Recommendations

### 6.1 Technical Debt / Risks
1. **Admin env var** – move to role column in `user` table.
2. **Double user source** – rely solely on Clerk `id` to avoid race conditions.
3. **Large Gemini prompts** – cost spikes; implement length guards.
4. **GCS URL concatenation** – prefer signed URLs or helper.
5. **Webhook opacity** – ensure exhaustive event handling.
6. **Bundle integrity** – add service layer to manage membership consistency.

### 6.2 Performance & Scalability
* Batch transcript fetch with controlled concurrency.
* Audio caching via transcript hash.
* Serve audio through Cloud CDN.
* ISG for public bundle pages.

### 6.3 Feature Opportunities
* Social sharing & deep links.
* Collaborative bundles with multi-owner support.
* A/B testing of intro scripts.
* Community marketplace for bundles (metered billing add-on).

### 6.4 Security Enhancements
* Rotate Google credentials with Secret Manager.
* Enforce CSP headers via middleware.
* Rate-limit API routes.

---

## 7. Conclusion
PodSlice’s architecture is modern and cloud-native. Combining Next.js Server Components, SaaS primitives (Clerk, Paddle), and managed AI workflows (Inngest + Gemini) enables rapid product iteration with minimal DevOps overhead. Key next steps: formalise role/permission management, harden billing webhooks, and optimise AI generation costs. With these improvements, the platform is well-positioned to scale technically and commercially.