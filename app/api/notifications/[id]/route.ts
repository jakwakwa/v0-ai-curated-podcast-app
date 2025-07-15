import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

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
      return new NextResponse("Notification ID is required", { status: 400 });
    }

    const deletedNotification = await prisma.notification.delete({
      where: { id: params.id, userId: userId },
    });

    if (!deletedNotification) {
      return new NextResponse("Notification not found or unauthorized", { status: 404 });
    }

    return NextResponse.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("[NOTIFICATION_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 