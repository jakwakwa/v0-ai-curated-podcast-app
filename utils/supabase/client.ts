import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

// Declare a variable to hold the client-side Supabase instance.
let client: SupabaseClient | undefined

export function createClient() {
  // If the client instance doesn't exist, create it.
  // This ensures that we only have one instance of the client in the browser context.
  if (client === undefined) {
    client = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  }

  // Return the single, memoized instance.
  return client
}
