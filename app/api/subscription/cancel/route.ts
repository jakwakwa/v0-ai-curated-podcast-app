import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { LinkService } from "@/lib/link-service";

export async function POST(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await LinkService.cancelSubscription(userId);

    return NextResponse.json({ message: "Subscription canceled successfully" });
  } catch (error) {
    console.error("[SUBSCRIPTION_CANCEL_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 