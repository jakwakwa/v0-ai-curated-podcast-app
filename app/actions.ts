"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import prisma from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function addPodcastSource(prevState: any, formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { success: false, message: "Not authenticated" }

  const url = formData.get("url") as string
  if (!url || !url.includes("spotify.com/show")) {
    return { success: false, message: "Please enter a valid Spotify show URL." }
  }

  try {
    const draftCollection = await prisma.collection.findFirst({
      where: { userId: userId, status: "Draft" },
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
  const { userId } = await auth();
  if (!userId) return

  const id = formData.get("id") as string
  try {
    const source = await prisma.source.findUnique({
      where: { id },
      include: { collection: true },
    })
    if (source?.collection.userId === userId) {
      await prisma.source.delete({ where: { id } })
    }
  } catch (error) {
    console.error("Error removing source:", error)
  }

  revalidatePath("/build")
}

export async function saveCuration(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return

  const collectionId = formData.get("collectionId") as string

  try {
    await prisma.$transaction([
      prisma.collection.update({
        where: { id: collectionId, userId: userId },
        data: {
          status: "Saved",
          name: `Week of ${new Date().toLocaleDateString()}`,
        },
      }),
      prisma.collection.create({
        data: {
          userId: userId,
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

export async function createDraftCollection() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    console.error("User not authenticated.");
    return;
  }
  console.log("Attempting to create collection for userId:", userId);

  try {
    // Ensure the user exists in our database
    let dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!dbUser) {
      // If user doesn't exist in our DB, create them
      dbUser = await prisma.user.create({
        data: {
          id: userId,
          email: user?.emailAddresses?.[0]?.emailAddress || "", // Use primary email from Clerk
          name: user?.firstName || user?.username || "", // Use first name or username
          password: "", // Password is not stored for Clerk users
          // Add other fields if necessary from Clerk's user object
        },
      });
      console.log("Created new user record in DB for userId:", userId);
    }

    await prisma.collection.create({
      data: {
        userId: dbUser.id,
        name: "New Weekly Curation",
        status: "Draft",
      },
    })

    revalidatePath("/build")

  } catch (error) {
    console.error("Error creating new draft collection or user:", error)
    return
  }

  redirect("/build")
}
