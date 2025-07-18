import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { LinkService } from "@/lib/link-service";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { returnUrl } = await request.json(); // Expect a returnUrl from the client

    if (!returnUrl) {
      return new NextResponse("Return URL is required", { status: 400 });
    }

    const checkoutUrl = await LinkService.createCheckoutSession(userId, returnUrl);

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("[SUBSCRIPTION_UPGRADE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
