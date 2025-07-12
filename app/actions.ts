"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export async function addPodcastSource(prevState: any, formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, message: "Not authenticated" }

  const url = formData.get("url") as string
  if (!url || !url.includes("spotify.com/show")) {
    return { success: false, message: "Please enter a valid Spotify show URL." }
  }

  // Find the user's draft collection
  const { data: draftCollection, error: draftError } = await supabase
    .from("collections")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "Draft")
    .single()

  if (draftError || !draftCollection) {
    return { success: false, message: "Could not find a draft collection." }
  }

  // In a real app, you'd fetch the show details from Spotify API here
  const newSource = {
    collection_id: draftCollection.id,
    name: "Fetched Show Name", // Placeholder
    url: url,
    image_url: "/placeholder.svg?width=40&height=40", // Placeholder
  }

  const { error } = await supabase.from("sources").insert(newSource)

  if (error) {
    console.error("Error adding source:", error)
    return { success: false, message: "Failed to add source to database." }
  }

  revalidatePath("/build")
  return { success: true, message: "Source added to your draft." }
}

export async function removePodcastSource(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const id = formData.get("id") as string
  const { error } = await supabase.from("sources").delete().eq("id", id)

  if (error) {
    console.error("Error removing source:", error)
  }

  revalidatePath("/build")
}

export async function saveCuration(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const collectionId = formData.get("collectionId") as string

  // 1. Update the current draft collection to 'Saved'
  const { error: updateError } = await supabase
    .from("collections")
    .update({ status: "Saved", name: `Week of ${new Date().toLocaleDateString()}` }) // Placeholder name
    .eq("id", collectionId)

  if (updateError) {
    console.error("Error saving curation:", updateError)
    return
  }

  // 2. Create a new empty 'Draft' collection for the user
  const { error: createError } = await supabase
    .from("collections")
    .insert({ user_id: user.id, name: "New Weekly Curation", status: "Draft" })

  if (createError) {
    console.error("Error creating new draft:", createError)
  }

  redirect("/")
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
