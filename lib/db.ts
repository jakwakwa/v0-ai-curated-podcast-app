import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

// The DATABASE_URL is provided by the Vercel Neon integration.
// It's a pooled connection string that works with the serverless driver.
export const sql = neon(process.env.DATABASE_URL)
