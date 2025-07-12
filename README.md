# AI-Curated Podcast Application

This is a Next.js application designed to automate the generation of weekly podcasts. The system allows users to curate a collection of source podcasts (from Spotify), which are then used by an AI pipeline to generate a new, summarized audio episode.

## Core Features

- **User Authentication**: Secure sign-up and login functionality powered by Supabase Auth.
- **Curation Management**: Users can create "curations" by selecting up to 5 Spotify shows.
- **Dedicated Build Workflow**: A focused, single-page interface for building and saving new curations.
- **Podcast Dashboard**: A central hub to view saved curations and previously generated podcast episodes.
- **AI Pipeline Integration**: A backend designed to trigger and manage external AI workflows for content summarization and audio synthesis.
- **Protected Routes**: Middleware ensures that only authenticated users can access the application's core features.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [Supabase (PostgreSQL)](https://supabase.com/database)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm
- A Supabase account and project.

### Installation

1.  **Clone the repository:**
    \`\`\`bash
    git clone <your-repository-url>
    cd ai-curated-podcast-app
    \`\`\`

2.  **Install dependencies:**
    \`\`\`bash
    npm install
    \`\`\`

3.  **Set up environment variables:**

    Create a file named \`.env.local\` in the root of your project. Add your Supabase project credentials from your project's API settings. You will also need to generate a **Service Role Key** from your Supabase project's API settings for the seed script.

    **Warning**: The service role key has admin privileges and should be kept secret. Do not expose it on the client side.

    \`\`\`env
    # Found in your Supabase project's API settings
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

    # Generated in your Supabase project's API settings (for seeding only)
    SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
    \`\`\`

4.  **Set up the database schema:**

    -   Go to your Supabase project's SQL Editor.
    -   Copy the entire content of \`scripts/schema.sql\` and run it. This will create the necessary tables and row-level security policies.

5.  **Seed the database (optional but recommended):**

    Run the seed script from your terminal to populate the database with a test user and sample data.

    \`\`\`bash
    node scripts/seed.mjs
    \`\`\`

    After the script runs, you can log in with the test user:
    -   **Email**: \`test.user@example.com\`
    -   **Password**: \`password123\`

6.  **Run the development server:**
    \`\`\`bash
    npm run dev
    \`\`\`

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
