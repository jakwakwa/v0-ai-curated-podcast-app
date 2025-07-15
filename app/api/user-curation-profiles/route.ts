import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, isBundleSelection, selectedBundleId, sourceUrls } = body;

    if (!name) {
      return new NextResponse("User Curation Profile name is required", { status: 400 });
    }

    // Check if user already has an active user curation profile
    const existingUserCurationProfile = await prisma.userCurationProfile.findFirst({
      where: { userId, isActive: true },
    });

    if (existingUserCurationProfile) {
      return new NextResponse("User can only have one active user curation profile", { status: 400 });
    }

    let newUserCurationProfile;

    if (isBundleSelection && selectedBundleId) {
      // Create a bundle-based user curation profile
      newUserCurationProfile = await prisma.userCurationProfile.create({
        data: {
          userId,
          name,
          isBundleSelection: true,
          selectedBundleId,
        },
      });
    } else if (!isBundleSelection && sourceUrls) {
      // Create a custom user curation profile with sources
      newUserCurationProfile = await prisma.userCurationProfile.create({
        data: {
          userId,
          name,
          isBundleSelection: false,
          sources: {
            create: sourceUrls.map((url: { name: string; url: string; imageUrl?: string }) => ({
              name: url.name,
              url: url.url,
              imageUrl: url.imageUrl,
            })),
          },
        },
      });
    } else {
      return new NextResponse("Invalid user curation profile data provided", { status: 400 });
    }

    return NextResponse.json(newUserCurationProfile, { status: 201 });
  } catch (error) {
    console.error("[USER_CURATION_PROFILE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 