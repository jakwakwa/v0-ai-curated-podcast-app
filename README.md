# PODSLICE.ai

## AI Powered Automated Podcast Summary Application

Our advanced AI identifies and extracts the most valuable insights from hours of podcast content, eliminating the noise and focusing on what matters.
Experience remarkably natural AI voices that deliver insights with the clarity and nuance of human speech, making complex ideas easy to understand.
Get immediate access to key takeaways without hunting through rambling conversations. Transform 3-hour podcasts into 5-minute insights.

Be among the first to experience the future of podcast consumption.

## Core Features

- **User Authentication**: Secure sign-up and login functionality powered by NextAuth.js.
- **Type-Safe Database Access**: Data management with Prisma ORM and a PostgreSQL database.
- **Curation Management**: Users can create "summaries" by selecting Podcast shows (Youtube show urls).
- **Dedicated Build Workflow**: A focused, single-page interface for building and saving new podcast summaries.
- **Podcast Dashboard**: A central hub to view saved bundles or custom bundles and previously generated summary episodes.
- **Protected Routes**: Middleware ensures that only authenticated users can access the application's core features.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Authentication**: [Clerk](https://clerk.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [Prisma PostgreSQL](https://www.postgresql.org/](https://www.prisma.io/))
- **Styling**: CSS Modules & [shadcn/ui](https://ui.shadcn.com/) with [radix ui](https://www.radix-ui.com/) UI primitives
- **Agentic Workflow Server**: [Inngest](https://www.inngest.com/)
- **Deployment**: [Vercel](https://vercel.com/)

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
   DATABASE_URL: string
  GCS_UPLOADER_KEY_PATH: Blob
  GCS_READER_KEY_PATH: Blob
 ```

3. Push the database schema:

 This command will read your `prisma/schema.prisma` file and create the corresponding tables in your database.

 `pnpm prisma:push`

4. Run the development server:
   `pnpm dev`

 Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
