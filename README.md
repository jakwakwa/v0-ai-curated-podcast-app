# AI-Curated Podcast Application

This is a Next.js application designed to automate the generation of weekly podcasts. The system allows users to curate a collection of source podcasts (from Spotify), which are then used by an AI pipeline to generate a new, summarized audio episode.

## Core Features

- **User Authentication**: Secure sign-up and login functionality powered by NextAuth.js.
- **Direct Database Access**: Data management with Neon's serverless driver and a PostgreSQL database.
- **Curation Management**: Users can create "curations" by selecting up to 5 Spotify shows.
- **Dedicated Build Workflow**: A focused, single-page interface for building and saving new curations.
- **Podcast Dashboard**: A central hub to view saved curations and previously generated podcast episodes.
- **Protected Routes**: Middleware ensures that only authenticated users can access the application's core features.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Authentication**: [NextAuth.js (Auth.js)](https://next-auth.js.org/)
- **Database Driver**: [@neondatabase/serverless](https://github.com/neondatabase/serverless)
- **Database**: [PostgreSQL (via Neon)](https://neon.tech/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm
- A Neon PostgreSQL database. You can get one for free and connect it via the Vercel integration.

### Installation

1.  **Clone the repository and install dependencies:**
    \`\`\`bash
    git clone <your-repository-url>
    cd ai-curated-podcast-app
    npm install
    npm install next-auth@beta bcryptjs @neondatabase/serverless cuid uuid
    npm install -D @types/bcryptjs @types/uuid
    \`\`\`

2.  **Set up environment variables:**

    Create a file named `.env.local` in the root of your project. Add the `DATABASE_URL` from your Neon project and generate a secret for NextAuth.js.

    \`\`\`env
    # Environment variables from your Neon project
    DATABASE_URL="your-neon-database-url"

    # NextAuth.js secret
    # You can generate one with `openssl rand -base64 32`
    AUTH_SECRET="your-secret-here"
    AUTH_URL="http://localhost:3000"
    \`\`\`

3.  **Create and seed the database:**

    Run the seed script from your terminal. This will create the necessary tables and populate the database with a test user and sample data.

    \`\`\`bash
    node --env-file=.env.local scripts/seed.mjs
    \`\`\`

    After the script runs, you can log in with the test user:
    -   **Email**: `test.user@example.com`
    -   **Password**: `password123`

4.  **Run the development server:**
    \`\`\`bash
    npm run dev
    \`\`\`

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
