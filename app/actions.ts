"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { auth, signOut as authSignOut } from "@/auth"
import { sql } from "@/lib/db"

export async function addPodcastSource(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Not authenticated." }
  }

  const url = formData.get("url") as string
  if (!url || !url.includes("spotify.com/show/")) {
    return { success: false, message: "Please enter a valid Spotify show URL." }
  }

  try {
    const oEmbedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`
    const response = await fetch(oEmbedUrl)

    if (!response.ok) {
      return { success: false, message: "Could not find Spotify show. Please check the URL." }
    }

    const showData = await response.json()
    const { title, thumbnail_url } = showData

    if (!title || !thumbnail_url) {
      return { success: false, message: "Could not retrieve show details from Spotify." }
    }

    const draftCollections = await sql`
      SELECT id FROM collections WHERE user_id = ${session.user.id} AND status = 'Draft' LIMIT 1
    `
    const draftCollection = draftCollections[0]

    if (!draftCollection) {
      return { success: false, message: "Could not find a draft collection." }
    }

    await sql`
      INSERT INTO sources (id, collection_id, name, url, image_url)
      VALUES (${uuidv4()}, ${draftCollection.id}, ${title}, ${url}, ${thumbnail_url})
    `

    revalidatePath("/build")
    return { success: true, message: `Added "${title}" to your draft.` }
  } catch (error) {
    console.error("Error adding source:", error)
    return { success: false, message: "An unexpected error occurred. Failed to add source." }
  }
}

export async function removePodcastSource(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return

  const id = formData.get("id") as string
  try {
    const results = await sql`
      SELECT c.user_id FROM sources s
      JOIN collections c ON s.collection_id = c.id
      WHERE s.id = ${id}
    `
    const sourceOwner = results[0]

    if (sourceOwner?.user_id === session.user.id) {
      await sql`DELETE FROM sources WHERE id = ${id}`
    }
  } catch (error) {
    console.error("Error removing source:", error)
  }

  revalidatePath("/build")
}

export async function saveCuration(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return

  const collectionId = formData.get("collectionId") as string

  try {
    await sql`
      UPDATE collections
      SET status = 'Saved', name = ${`Week of ${new Date().toLocaleDateString()}`}
      WHERE id = ${collectionId} AND user_id = ${session.user.id}
    `
    await sql`
      INSERT INTO collections (id, user_id, name, status)
      VALUES (${uuidv4()}, ${session.user.id}, 'New Weekly Curation', 'Draft')
    `
  } catch (error) {
    console.error("Error saving curation:", error)
    return
  }

  redirect("/")
}

export async function logout() {
  await authSignOut({ redirectTo: "/login" })
}
