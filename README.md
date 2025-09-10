# PODSLICE.ai

# Podslice: Executive Summary

PODSLICE is a sophisticated AI-powered content curation platform built on a modern, server-first architecture. It addresses the pervasive challenge of information overload by transforming long-form audio and video content (specifically from YouTube) into concise, personalized, and AI-generated podcast summaries. 
The application's core value proposition, "Cut the Chatter, Keep the Insight," is supported by a multi-tier SaaS subscription model (Free Slice, Casual Listener, Curate Control) that grants hierarchical feature access. 
The system is strategically architected with a Next.js App Router frontend, Inngest for robust background job orchestration, Prisma with PostgreSQL for data management, Google Cloud Storage (GCS) for audio asset hosting, and Clerk for secure and scalable authentication

## **II. Application Domain & Business Logic**
### **Core Business Entities & Strategic Roles**
The platform orchestrates a seamless user experience around a set of interconnected core business entities. Understanding their roles is critical for strategic planning.
1. **User Journey Architecture**: The platform is designed to support three distinct but interconnected user experiences:
*   **New User Onboarding**: A streamlined process that includes sign-up via Clerk, user data synchronisation, and initial profile creation where a user selects a pre-curated podcast bundle or begins to assemble a custom feed.
*   **Daily Usage**: The core user experience, focused on the consumption of AI-generated episodes, managing their personalized feed, and discovering new content.
*   **Admin Tools**: An internal interface for content management, user administration, and system monitoring to ensure content quality and a smooth user experience.
2. **Personalized Feeds**: This is the heart of the application's value proposition. Users create a user\_curation\_profile which is the central configuration for their personalized content. This profile can be configured in two ways: by selecting a static curated bundle or by assembling a custom list of podcasts (profile\_podcast). Access to certain bundles is a key monetization lever and is controlled by a PlanGate that is dynamically derived from the user's active Paddle subscription.
3. **Episodes**: The platform handles two types of episodes, each with its own data model and lifecycle:
*   **Curated/Profile-Linked Episodes**: These are the primary content pieces stored in a unified episode table. They are automatically generated based on the user's selected bundles or profile settings.
*   **User-Generated Episodes**: These are ad-hoc episodes created by power users from arbitrary YouTube transcripts. They are stored in a separate user\_episode table with a lifecycle status that tracks their progress from PENDING to PROCESSING and finally to COMPLETED or FAILED. This distinction is crucial for managing the cost and complexity of on-demand AI tasks.
4. **AI Pipeline**: The platform's intelligence is powered by a series of long-running, asynchronous tasks orchestrated by Inngest. This workflow is a core competency of the application. The primary steps are:
*   **Content Ingestion**: The initial step of gathering content, currently focused on extracting YouTube transcripts.
*   **Summarization & Script Generation**: This is where **Gemini** performs the key task of condensing long-form content into a coherent summary and then generating a polished script for the synthetic voice.
*   **TTS Synthesis**: The generated script is passed to a **Gemini TTS** service to create high-quality, natural-sounding audio.
*   **Storage & Delivery**: The final audio file is uploaded to **Google Cloud Storage (GCS)**, and a database entry is created to track the episode.
*   **Notifications**: The user is notified via an in-app message or an optional email when their episode is ready.
### **Purpose & Real-World Problem**
The fundamental purpose of Podslice is to solve the problem of information overload. In an age of content abundance, the platform provides AI-generated condensations that allow users to keep up with knowledge and trends without dedicating hours to consuming full episodes. The codebase's design, emphasizing scalability and maintainability, positions the platform for rapid feature development and sustainable growth. This focus on an agile and extensible architecture is a key strategic advantage.
## **III. Core Application Structure & Technical Details**
### **Codebase Architecture**
The application is structured as a **Next.js App Router** project, which enables a modern, hybrid approach to rendering (Server Components for data, Client Components for interactivity) and a clear separation of concerns.
*   **app/**: This directory contains all pages and **API route handlers**. The app/(protected) route group is a notable architectural pattern, ensuring that authenticated pages share a consistent layout, sidebar, and header.
*   **lib/**: A critical server-side layer for all domain logic. It encapsulates the Prisma client, Inngest client and functions, transcript orchestrators, and GCS helpers. Centralizing this logic ensures consistency and maintainability.
*   **hooks/**: Houses reusable client-side logic, such as useEpisodeProgressPolling, which handles the real-time status updates of user-generated episodes.
*   **prisma/**: Defines the entire database schema, including models, relations, and enums, serving as the single source of truth for the application's data.
*   **config/ & utils/**: These directories manage application-wide configurations (e.g., AI model toggles, Paddle pricing tiers) and general-purpose helper functions.
*   **components.json**: The central configuration file for shadcn/ui, managing component-specific path aliases and themes.
### **Key Architectural Patterns**
*   **Next.js App Router with Route Groups**: This pattern is used to wrap authenticated pages, providing a unified and secure user experience.
*   **Server/Client Component Separation**: The architecture follows the best practice of delegating data fetching to **Server Components** and handling user interactivity with **Client Components**. This minimizes the JavaScript bundle size and improves performance.
*   **Background Processing**: The use of **Inngest 3** is a foundational pattern for handling long-running, asynchronous tasks like AI model calls and audio processing. This prevents the API from timing out and makes the system resilient to failures with built-in retry mechanisms.
*   **State Management**: **Zustand** stores are used for client-side state, providing a simple yet powerful way to manage UI-specific data without the overhead of more complex state libraries.
*   **Config-Driven Flags**: This pattern is implemented in config/ai.ts and other files, allowing developers to easily toggle features, test different AI models, or enable/disable simulations without code changes.
### **Tech Stack Analysis**
The codebase is built on a robust and modern tech stack, selected for its scalability, performance, and developer experience.
*   **Core**: Next.js 15.2, React 19
*   **Auth**: Clerk (@clerk/nextjs)
*   **Styling/UI**: Tailwind CSS 4, Radix UI, shadcn components
*   **Database**: Prisma 6.14 with Prisma Accelerate for connection pooling; PostgreSQL
*   **Background jobs**: Inngest 3.40
*   **AI**: @ai-sdk/google & @google/genai
*   **Media**: @distube/ytdl-core, fluent-ffmpeg
*   **Storage**: @google-cloud/storage
*   **Payments**: Paddle JS/Node SDK
*   **Email**: Resend client
## **IV. Conclusion & Strategic Outlook**

The Podslice codebase demonstrates a high level of maturity and strategic foresight. It combines enterprise-grade practices with startup-level agility, making it a highly extensible and maintainable platform. Its strong foundations—including a modern tech stack, a clear separation of concerns, and robust AI pipeline orchestration—directly support the business model's reliance on content personalization and subscription-based revenue.
While the existing architecture is strong, future strategic enhancements will focus on improving observability to better monitor AI pipeline performance, diversifying AI vendors to mitigate single-point-of-failure risks, and continuing to iterate on the user experience. The strategic architecture directly supports the business model through robust plan-based access control and content personalization, positioning Podslice for sustainable growth in the competitive content curation market.

## AI Powered Automated Podcast Summary Application

Our advanced AI identifies and extracts the most valuable insights from hours of podcast content, eliminating the noise and focusing on what matters.
Experience remarkably natural AI voices that deliver insights with the clarity and nuance of human speech, making complex ideas easy to understand.
Get immediate access to key takeaways without hunting through rambling conversations. Transform 3-hour podcasts into 5-minute insights.

Be among the first to experience the future of podcast summaries

## Core Features

- **User Authentication**: Secure sign-up and login functionality powered by NextAuth.js.
- **Type-Safe Database Access**: Data management with Prisma ORM and a PostgreSQL database.
- **Curation Management**: Users can create "summaries" by selecting Podcast shows (Youtube show urls).
- **Dedicated Build Workflow**: A focused, single-page interface for building and saving new podcast summaries.
- **Podcasts Dashboard**: A central hub to view saved bundles or custom bundles and previously generated summary episodes.
- **Protected Routes**: Middleware ensures that only authenticated users can access the application's core features

## Tech Stack

- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg" width="20" height="20" alt="Next.js" /> **Framework**: [Next.js](https://nextjs.org/) (App Router)
- <img src="https://raw.githubusercontent.com/onemarc/tech-icons/main/icons/typescript.svg" width="20" height="20" alt="TypeScript" /> **Language**: [TypeScript](https://www.typescriptlang.org/)
- <img src="https://11labs-nonprd-15f22c1d.s3.eu-west-3.amazonaws.com/a2ea339b-8b5e-41bb-b706-24eda8a4c9e3/elevenlabs-symbol.svg" width="20" height="20" alt="ElevenLabs" /> **Text-to-Speech**: [ElevenLabs](https://elevenlabs.io/)
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vercel/vercel-original.svg" width="20" height="20" alt="Vercel AI SDK" /> **AI SDK**: [Vercel AI SDK](https://v5.ai-sdk.dev/)
- **Authentication**: [Clerk](https://clerk.com/)
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/prisma/prisma-original.svg" width="20" height="20" alt="Prisma" /> **ORM**: [Prisma](https://www.prisma.io/)
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" width="20" height="20" alt="PostgreSQL" /> **Database**: [PostgreSQL](https://www.postgresql.org/)
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" width="20" height="20" alt="CSS3" /> <img src="https://raw.githubusercontent.com/onemarc/tech-icons/main/icons/shadcnui.svg" width="20" height="20" alt="shadcn/ui" /> <img src="https://raw.githubusercontent.com/onemarc/tech-icons/main/icons/radixui-dark.svg" width="20" height="20" alt="Radix UI" /> **Styling**: CSS Modules & [shadcn/ui](https://ui.shadcn.com/) with [radix ui](https://www.radix-ui.com/) UI primitives
- **Agentic Workflow Server**: [Inngest](https://www.inngest.com/)
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vercel/vercel-original.svg" width="20" height="20" alt="Vercel" /> **Deployment**: [Vercel](https://vercel.com/)

### Languages and Tools

<p align="left">
  <img src="https://raw.githubusercontent.com/onemarc/tech-icons/main/icons/typescript.svg" alt="TypeScript" width="40" height="40"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg" alt="Next.js" width="40" height="40"/>
  <img src="https://11labs-nonprd-15f22c1d.s3.eu-west-3.amazonaws.com/a2ea339b-8b5e-41bb-b706-24eda8a4c9e3/elevenlabs-symbol.svg" alt="ElevenLabs" width="40" height="40"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vercel/vercel-original.svg" alt="Vercel" width="40" height="40"/>
  <img src="public/clerk-logo.svg" alt="Clerk" width="40" height="40"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/prisma/prisma-original.svg" alt="Prisma" width="40" height="40"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" width="40" height="40"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" alt="CSS3" width="40" height="40"/>
  <img src="https://raw.githubusercontent.com/onemarc/tech-icons/main/icons/shadcnui.svg" alt="shadcn/ui" width="40" height="40"/>
  <img src="https://raw.githubusercontent.com/onemarc/tech-icons/main/icons/radixui-dark.svg" alt="Radix UI" width="40" height="40"/>
</p>

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or later)
- A PostgreSQL database and connection string key
- Clerk Account and api keys
- Inngest Account and api keys
- Eleven Labs account and api keys

### Installation

1. Clone the repository and install dependencies:

```bash
   git clone <your-repository-url>
   cd ai-curated-podcast-app
   npm install
   npm install prisma --save-dev
  ```

2. Set up environment variables:

   Create a file named `.env.local` in the root of your project.
   - Get your PostgreSQL database **Connection String**.
   - For the `DATABASE_URL`, ensure you are using a pooler-ready string (e.g., port 6543 for Supabase).
   - For the `DIRECT_URL`, use the direct connection string (e.g., port 5432 for Supabase). [^2]
   - Generate a secret for NextAuth.js using `openssl rand -base64 32`

```env
   # Your PostgreSQL connection strings
   DATABASE_URL="postgres://..."
   XAI_API_KEY: string
   ELEVEN_LABS_PROD: string
   ELEVEN_LABS_DEV: string
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string
   CLERK_SECRET_KEY: string
   NEXT_GOOGLE_GENERATIVE_AI_API_KEY: string
   GOOGLE_GENERATIVE_AI_API_KEY: string
   GOOGLE_CLOUD_PROJECT_ID: string
   GOOGLE_CLOUD_STORAGE_BUCKET_NAME: string
   WF__INNGEST_EVENT_KEY: string
   WF__INNGEST_SIGNING_KEY: string
   GCS_UPLOADER_KEY_PATH: Blob
   GCS_READER_KEY_PATH: Blob
 ```

3. Push the database schema:

 This command will read your `prisma/schema.prisma` file and create the corresponding tables in your database.

 `pnpm prisma:push`

4. Run the development server:
   `pnpm dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ⚠️ Important Notes

### YouTube API Usage Risk

This application uses YouTube's undocumented internal API (`youtubei/v1/player`) for transcript extraction and audio streaming. This API may break without notice since it's not officially supported. For detailed information about the risks and potential alternatives, see [docs/YOUTUBE_API_RISKS.md](./docs/YOUTUBE_API_RISKS.md).

**Environment Variables for YouTube API:**
- `ENABLE_YOUTUBE_INNERTUBE=false` - Set to disable undocumented API usage  
- `YOUTUBE_API_ERROR_WEBHOOK` - Optional webhook URL for API error monitoring
