import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

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
      return new NextResponse("Notification ID is required", { status: 400 });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: params.id, userId: userId },
      data: { isRead: true },
    });

    if (!updatedNotification) {
      return new NextResponse("Notification not found or unauthorized", { status: 404 });
    }

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error("[NOTIFICATION_MARK_READ]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 