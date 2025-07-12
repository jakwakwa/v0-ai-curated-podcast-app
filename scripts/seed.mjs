import { createClient } from "@supabase/supabase-js"

// The environment variables are automatically loaded in this environment.
// We do not need to use the 'dotenv' package.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase URL or Service Role Key is missing from the environment variables.")
}

// Use the service role key for the admin client to bypass RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

const seedUser = {
  email: "test.user@example.com",
  password: "password123",
}

async function main() {
  console.log("Starting seed process...")

  // 1. Create a test user
  console.log("Creating test user...")
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email: seedUser.email,
    password: seedUser.password,
    email_confirm: true, // Auto-confirm user's email
  })

  if (userError && userError.message !== "Email address already registered by another user") {
    console.error("Error creating user:", userError.message)
    return
  }

  const {
    data: { users },
  } = await supabaseAdmin.auth.admin.listUsers()
  const user = users.find((u) => u.email === seedUser.email)

  if (!user) {
    console.error("Could not find or create test user.")
    return
  }

  console.log(`Test user created/found with ID: ${user.id}`)

  // 2. Create a "Saved" collection for the user
  console.log("Creating a 'Saved' collection...")
  const { data: savedCollection, error: savedError } = await supabaseAdmin
    .from("collections")
    .insert({
      user_id: user.id,
      name: "Week of July 5th, 2025",
      status: "Saved",
    })
    .select()
    .single()

  if (savedError) {
    console.error("Error creating saved collection:", savedError.message)
    return
  }
  console.log(`'Saved' collection created with ID: ${savedCollection.id}`)

  // 3. Add sources to the "Saved" collection
  console.log("Adding sources to 'Saved' collection...")
  const savedSources = [
    { name: "Acquired", url: "https://open.spotify.com/show/1TzB4nK8f4T3pUa6C3lT9t", image_url: "/placeholder.svg?width=40&height=40" },
    { name: "All-In Podcast", url: "https://open.spotify.com/show/2I3r1wZnNKh6C44i3tE0D2", image_url: "/placeholder.svg?width=40&height=40" },
    { name: "Darknet Diaries", url: "https://open.spotify.com/show/4XPl3uEEL9hvqMkoZrzbx5", image_url: "/placeholder.svg?width=40&height=40" },
  ]

  const savedSourcesData = savedSources.map((s) => ({ ...s, collection_id: savedCollection.id }))
  const { error: savedSourcesError } = await supabaseAdmin.from("sources").insert(savedSourcesData)
  if (savedSourcesError) console.error("Error adding sources to saved collection:", savedSourcesError.message)

  // 4. Create a "Draft" collection for the user
  console.log("Creating a 'Draft' collection...")
  const { data: draftCollection, error: draftError } = await supabaseAdmin
    .from("collections")
    .insert({
      user_id: user.id,
      name: "New Weekly Curation",
      status: "Draft",
    })
    .select()
    .single()

  if (draftError) {
    console.error("Error creating draft collection:", draftError.message)
    return
  }
  console.log(`'Draft' collection created with ID: ${draftCollection.id}`)

  // 5. Add sources to the "Draft" collection
  console.log("Adding sources to 'Draft' collection...")
  const draftSources = [
    { name: "The Daily", url: "https://open.spotify.com/show/3IM0lmZxpFAY72Q_...", image_url: "/placeholder.svg?width=40&height=40" },
    { name: "Lex Fridman Podcast", url: "https://open.spotify.com/show/2MAi0BvDc6GTFvKFPXnkCL", image_url: "/placeholder.svg?width=40&height=40" },
  ]
  const draftSourcesData = draftSources.map((s) => ({ ...s, collection_id: draftCollection.id }))
  const { error: draftSourcesError } = await supabaseAdmin.from("sources").insert(draftSourcesData)
  if (draftSourcesError) console.error("Error adding sources to draft collection:", draftSourcesError.message)

  console.log("\nSeed process completed successfully!")
  console.log(`\nYou can log in with the test user:`)
  console.log(`Email: ${seedUser.email}`)
  console.log(`Password: ${seedUser.password}`)
}

main().catch(console.error)
