import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.id) {
      return new NextResponse("User Curation Profile ID is required", { status: 400 });
    }

    const userCurationProfile = await prisma.userCurationProfile.findUnique({
      where: { id: params.id, userId: userId },
      include: { sources: true, selectedBundle: true },
    });

    if (!userCurationProfile) {
      return new NextResponse("User Curation Profile not found", { status: 404 });
    }

    return NextResponse.json(userCurationProfile);
  } catch (error) {
    console.error("[USER_CURATION_PROFILE_GET_BY_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.id) {
      return new NextResponse("User Curation Profile ID is required", { status: 400 });
    }

    const body = await request.json();
    const { name, isBundleSelection, selectedBundleId, sourceUrls } = body;

    if (!name && !isBundleSelection && !selectedBundleId && !sourceUrls) {
      return new NextResponse("No update data provided", { status: 400 });
    }

    // Fetch the existing user curation profile to check ownership
    const existingUserCurationProfile = await prisma.userCurationProfile.findUnique({
      where: { id: params.id },
    });

    if (!existingUserCurationProfile || existingUserCurationProfile.userId !== userId) {
      return new NextResponse("User Curation Profile not found or unauthorized", { status: 404 });
    }

    let updatedUserCurationProfile;

    if (isBundleSelection !== undefined) {
      // If changing to bundle selection
      if (isBundleSelection && selectedBundleId) {
        updatedUserCurationProfile = await prisma.userCurationProfile.update({
          where: { id: params.id },
          data: {
            name: name || existingUserCurationProfile.name,
            isBundleSelection: true,
            selectedBundleId,
            sources: { deleteMany: {} }, // Clear existing sources
          },
        });
      } else if (!isBundleSelection) {
        // If changing to custom selection
        updatedUserCurationProfile = await prisma.userCurationProfile.update({
          where: { id: params.id },
          data: {
            name: name || existingUserCurationProfile.name,
            isBundleSelection: false,
            selectedBundleId: null,
          },
        });
      }
    } else if (sourceUrls) {
      // Update sources for a custom user curation profile
      // First, delete all existing sources for this user curation profile
      await prisma.source.deleteMany({
        where: { userCurationProfileId: params.id },
      });

      // Then, create new sources
      updatedUserCurationProfile = await prisma.userCurationProfile.update({
        where: { id: params.id },
        data: {
          name: name || existingUserCurationProfile.name,
          sources: {
            create: sourceUrls.map((url: { name: string; url: string; imageUrl?: string }) => ({
              name: url.name,
              url: url.url,
              imageUrl: url.imageUrl,
            })),
          },
        },
      });
    } else if (name) {
      updatedUserCurationProfile = await prisma.userCurationProfile.update({
        where: { id: params.id },
        data: { name: name },
      });
    }

    return NextResponse.json(updatedUserCurationProfile);
  } catch (error) {
    console.error("[USER_CURATION_PROFILE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.id) {
      return new NextResponse("User Curation Profile ID is required", { status: 400 });
    }

    // Deactivate the user curation profile instead of deleting it
    const deactivatedUserCurationProfile = await prisma.userCurationProfile.update({
      where: { id: params.id, userId: userId },
      data: { isActive: false },
    });

    if (!deactivatedUserCurationProfile) {
      return new NextResponse("User Curation Profile not found or unauthorized", { status: 404 });
    }

    return NextResponse.json({ message: "User Curation Profile deactivated successfully" });
  } catch (error) {
    console.error("[USER_CURATION_PROFILE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 