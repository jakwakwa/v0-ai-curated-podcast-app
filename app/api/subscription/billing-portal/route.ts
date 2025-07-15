import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { LinkService } from "@/lib/link-service";

export async function POST(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subscription = await LinkService.getUserSubscription(userId);

    // As PayMongo does not expose a direct "billing portal" URL for customers,
    // this endpoint will return the current subscription status.
    // Future enhancements might involve building a custom billing management UI
    // within the app using more detailed PayMongo APIs if available.
    return NextResponse.json({
      message: "PayMongo does not provide a direct customer billing portal URL.",
      subscriptionStatus: subscription ? subscription.status : "no_subscription",
      // You might add more subscription details here if needed for an in-app portal
    });
  } catch (error) {
    console.error("[SUBSCRIPTION_BILLING_PORTAL_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 