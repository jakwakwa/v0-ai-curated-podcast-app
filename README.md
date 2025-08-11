# PODSLICE.ai

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
- **Podcast Dashboard**: A central hub to view saved bundles or custom bundles and previously generated summary episodes.
- **Protected Routes**: Middleware ensures that only authenticated users can access the application's core features.

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
