"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth, signOut as authSignOut } from "@/auth"
import prisma from "@/lib/prisma"

export async function addPodcastSource(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, message: "Not authenticated" }

  const url = formData.get("url") as string
  if (!url || !url.includes("spotify.com/show")) {
    return { success: false, message: "Please enter a valid Spotify show URL." }
  }

  try {
    const draftCollection = await prisma.collection.findFirst({
      where: { userId: session.user.id, status: "Draft" },
    })

    if (!draftCollection) {
      return { success: false, message: "Could not find a draft collection." }
    }

    await prisma.source.create({
      data: {
        collectionId: draftCollection.id,
        name: "Fetched Show Name", // Placeholder
        url: url,
        imageUrl: "/placeholder.svg?width=40&height=40", // Placeholder
      },
    })

    revalidatePath("/build")
    return { success: true, message: "Source added to your draft." }
  } catch (error) {
    console.error("Error adding source:", error)
    return { success: false, message: "Failed to add source to database." }
  }
}

export async function removePodcastSource(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return

  const id = formData.get("id") as string
  try {
    const source = await prisma.source.findUnique({
      where: { id },
      include: { collection: true },
    })
    if (source?.collection.userId === session.user.id) {
      await prisma.source.delete({ where: { id } })
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
    await prisma.$transaction([
      prisma.collection.update({
        where: { id: collectionId, userId: session.user.id },
        data: {
          status: "Saved",
          name: `Week of ${new Date().toLocaleDateString()}`,
        },
      }),
      prisma.collection.create({
        data: {
          userId: session.user.id,
          name: "New Weekly Curation",
          status: "Draft",
        },
      }),
    ])
  } catch (error) {
    console.error("Error saving curation:", error)
    return
  }

  redirect("/")
}

export async function logout() {
  await authSignOut({ redirectTo: "/login" })
}
