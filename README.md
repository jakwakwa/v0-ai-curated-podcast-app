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

- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg" width="20" height="20" alt="Next.js" /> **Framework**: [Next.js](https://nextjs.org/) (App Router)
- <img src="https://raw.githubusercontent.com/onemarc/tech-icons/main/icons/typescript.svg" width="20" height="20" alt="TypeScript" /> **Language**: [TypeScript](https://www.typescriptlang.org/)
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vercel/vercel-original.svg" width="20" height="20" alt="Vercel AI SDK" /> **AI SDK**: [Vercel AI SDK](https://v5.ai-sdk.dev/)
- <img src="data:image/svg+xml,%3csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' fill='currentColor'%3e%3cellipse cx='12' cy='12' rx='3.74998' ry='3.75'%3e%3c/ellipse%3e%3cpath d='M18.7566 20.8788C19.0756 21.1978 19.0436 21.7261 18.6687 21.9772C16.7613 23.2548 14.4672 23.9999 11.9991 23.9999C9.5309 23.9999 7.23678 23.2548 5.32939 21.9772C4.95452 21.7261 4.92248 21.1978 5.24153 20.8788L7.98198 18.1383C8.22966 17.8906 8.6139 17.8515 8.92565 18.0112C9.84746 18.4835 10.8921 18.7499 11.9991 18.7499C13.106 18.7499 14.1507 18.4835 15.0725 18.0112C15.3842 17.8515 15.7685 17.8906 16.0161 18.1383L18.7566 20.8788Z'%3e%3c/path%3e%3cpath fill-opacity='0.5' d='M18.6696 2.02275C19.0445 2.27385 19.0765 2.80207 18.7575 3.12111L16.017 5.86158C15.7693 6.10927 15.3851 6.14839 15.0733 5.98868C14.1515 5.51644 13.1068 5.25 11.9999 5.25C8.27204 5.25 5.24997 8.27208 5.24997 12C5.24997 13.1069 5.51641 14.1516 5.98866 15.0734C6.14836 15.3852 6.10924 15.7694 5.86156 16.0171L3.1211 18.7575C2.80206 19.0766 2.27384 19.0446 2.02274 18.6697C0.745142 16.7623 0 14.4682 0 12C0 5.37258 5.37256 0 11.9999 0C14.4681 0 16.7622 0.745147 18.6696 2.02275Z'%3e%3c/path%3e%3c/svg%3e" width="20" height="20" alt="Clerk" /> **Authentication**: [Clerk](https://clerk.com/)
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/prisma/prisma-original.svg" width="20" height="20" alt="Prisma" /> **ORM**: [Prisma](https://www.prisma.io/)
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" width="20" height="20" alt="PostgreSQL" /> **Database**: [PostgreSQL](https://www.postgresql.org/)
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" width="20" height="20" alt="CSS3" /> <img src="https://raw.githubusercontent.com/onemarc/tech-icons/main/icons/shadcnui.svg" width="20" height="20" alt="shadcn/ui" /> <img src="https://raw.githubusercontent.com/onemarc/tech-icons/main/icons/radixui-dark.svg" width="20" height="20" alt="Radix UI" /> **Styling**: CSS Modules & [shadcn/ui](https://ui.shadcn.com/) with [radix ui](https://www.radix-ui.com/) UI primitives
- **Agentic Workflow Server**: [Inngest](https://www.inngest.com/)
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vercel/vercel-original.svg" width="20" height="20" alt="Vercel" /> **Deployment**: [Vercel](https://vercel.com/)

### Languages and Tools

<p align="left">
  <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/onemarc/tech-icons/main/icons/typescript.svg" alt="TypeScript" width="40" height="40"/> </a>
  <a href="https://nextjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg" alt="Next.js" width="40" height="40"/> </a>
  <a href="https://vercel.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vercel/vercel-original.svg" alt="Vercel" width="40" height="40"/> </a>
  <a href="https://clerk.com/" target="_blank" rel="noreferrer"> <img src="data:image/svg+xml,%3csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' fill='currentColor'%3e%3cellipse cx='12' cy='12' rx='3.74998' ry='3.75'%3e%3c/ellipse%3e%3cpath d='M18.7566 20.8788C19.0756 21.1978 19.0436 21.7261 18.6687 21.9772C16.7613 23.2548 14.4672 23.9999 11.9991 23.9999C9.5309 23.9999 7.23678 23.2548 5.32939 21.9772C4.95452 21.7261 4.92248 21.1978 5.24153 20.8788L7.98198 18.1383C8.22966 17.8906 8.6139 17.8515 8.92565 18.0112C9.84746 18.4835 10.8921 18.7499 11.9991 18.7499C13.106 18.7499 14.1507 18.4835 15.0725 18.0112C15.3842 17.8515 15.7685 17.8906 16.0161 18.1383L18.7566 20.8788Z'%3e%3c/path%3e%3cpath fill-opacity='0.5' d='M18.6696 2.02275C19.0445 2.27385 19.0765 2.80207 18.7575 3.12111L16.017 5.86158C15.7693 6.10927 15.3851 6.14839 15.0733 5.98868C14.1515 5.51644 13.1068 5.25 11.9999 5.25C8.27204 5.25 5.24997 8.27208 5.24997 12C5.24997 13.1069 5.51641 14.1516 5.98866 15.0734C6.14836 15.3852 6.10924 15.7694 5.86156 16.0171L3.1211 18.7575C2.80206 19.0766 2.27384 19.0446 2.02274 18.6697C0.745142 16.7623 0 14.4682 0 12C0 5.37258 5.37256 0 11.9999 0C14.4681 0 16.7622 0.745147 18.6696 2.02275Z'%3e%3c/path%3e%3c/svg%3e" alt="Clerk" width="40" height="40"/> </a>
  <a href="https://www.prisma.io/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/prisma/prisma-original.svg" alt="Prisma" width="40" height="40"/> </a>
  <a href="https://www.postgresql.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" width="40" height="40"/> </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/CSS" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" alt="CSS3" width="40" height="40"/> </a>
  <a href="https://ui.shadcn.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/onemarc/tech-icons/main/icons/shadcnui.svg" alt="shadcn/ui" width="40" height="40"/> </a>
  <a href="https://www.radix-ui.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/onemarc/tech-icons/main/icons/radixui-dark.svg" alt="Radix UI" width="40" height="40"/> </a>
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
