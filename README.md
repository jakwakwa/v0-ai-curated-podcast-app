# AI-Curated Podcast Application

This is a Next.js application designed to automate the generation of weekly podcasts. The system allows users to curate a collection of source podcasts (from Spotify), which are then used by an AI pipeline to generate a new, summarized audio episode.

## Core Features

- **User Authentication**: Secure sign-up and login functionality powered by NextAuth.js.
- **Type-Safe Database Access**: Data management with Prisma ORM and a PostgreSQL database.
- **Curation Management**: Users can create "curations" by selecting up to 5 Spotify shows.
- **Dedicated Build Workflow**: A focused, single-page interface for building and saving new curations.
- **Podcast Dashboard**: A central hub to view saved curations and previously generated podcast episodes.
- **Protected Routes**: Middleware ensures that only authenticated users can access the application's core features.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Authentication**: [NextAuth.js (Auth.js)](https://next-auth.js.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm
- A PostgreSQL database. You can get one for free from providers like Supabase or Neon.

### Installation

1.  **Clone the repository and install dependencies:**
    \`\`\`bash
    git clone <your-repository-url>
    cd ai-curated-podcast-app
    npm install
    npm install next-auth@beta bcryptjs
    npm install -D @types/bcryptjs
    npm install prisma --save-dev
    \`\`\`

2.  **Set up environment variables:**

    Create a file named `.env.local` in the root of your project.
    -   Get your PostgreSQL database **Connection String**.
    -   For the `DATABASE_URL`, ensure you are using a pooler-ready string (e.g., port 6543 for Supabase).
    -   For the `DIRECT_URL`, use the direct connection string (e.g., port 5432 for Supabase). [^2]
    -   Generate a secret for NextAuth.js using `openssl rand -base64 32`.

    \`\`\`env
    # Your PostgreSQL connection strings
    DATABASE_URL="postgres://..."
    DIRECT_URL="postgres://..."

    # NextAuth.js secret
    # You can generate one with `openssl rand -base64 32`
    AUTH_SECRET="your-secret-here"
    AUTH_URL="http://localhost:3000"
    \`\`\`

3.  **Push the database schema:**

    This command will read your `prisma/schema.prisma` file and create the corresponding tables in your database.

    \`\`\`bash
    npx prisma db push
    \`\`\`

4.  **Seed the database (optional but recommended):**

    Run the seed script from your terminal to populate the database with a test user and sample data.

    \`\`\`bash
    node --env-file=.env.local scripts/seed.mjs
    \`\`\`

    After the script runs, you can log in with the test user:
    -   **Email**: `test.user@example.com`
    -   **Password**: `password123`

5.  **Run the development server:**
    \`\`\`bash
    npm run dev
    \`\`\`

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
