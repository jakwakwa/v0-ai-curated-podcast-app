import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
	const PAYSTACK_WEBHOOK_SECRET = process.env.PAYSTACK_WEBHOOK_SECRET;

	if (!PAYSTACK_WEBHOOK_SECRET) {
		console.error("Paystack webhook secret is not set.");
		return new NextResponse("Internal Server Error: Webhook secret not configured", { status: 500 });
	}

	const rawBody = await req.text();
	const hash = crypto.createHmac("sha512", PAYSTACK_WEBHOOK_SECRET).update(rawBody).digest("hex");

	if (hash !== req.headers.get("x-paystack-signature")) {
		return new NextResponse("Invalid signature", { status: 400 });
	}

	const { event, data } = JSON.parse(rawBody);

	try {
		switch (event) {
			case "charge.success": {
				if (data.plan?.plan_code) {
					const user = await prisma.user.findUnique({ where: { email: data.customer.email } });
					if (user) {
						await prisma.user.update({
							where: { email: data.customer.email },
							data: { paystackCustomerId: data.customer.customer_code },
						});
					}
				}
				break;
			}
			case "subscription.create": {
				const userToUpdate = await prisma.user.findUnique({ where: { email: data.customer.email } });
				if (userToUpdate) {
					await prisma.subscription.create({
						data: {
							userId: userToUpdate.id,
							status: 'active',
							paystackSubscriptionCode: data.subscription_code,
							paystackPlanCode: data.plan.plan_code,
							currentPeriodEnd: data.next_payment_date ? new Date(data.next_payment_date) : null,
						}
					})
				}
				break;
			}
			case "subscription.disable": {
				await prisma.subscription.update({
					where: { paystackSubscriptionCode: data.subscription_code },
					data: {
						status: data.status, // 'cancelled' or 'complete'
						canceledAt: new Date(),
					}
				})
				break;
			}
			case 'subscription.not_renew': {
				await prisma.subscription.update({
					where: { paystackSubscriptionCode: data.subscription_code },
					data: {
						status: 'non-renewing',
					}
				})
				break;
			}
			case 'invoice.payment_failed': {
				if (data.subscription?.subscription_code) {
					await prisma.subscription.update({
						where: { paystackSubscriptionCode: data.subscription.subscription_code },
						data: {
							status: 'attention',
						}
					})
				}
				break;
			}
			default:
				console.log(`Unhandled Paystack event: ${event}`);
		}

		return new NextResponse(null, { status: 200 });
	} catch (error) {
		console.error("Error processing Paystack webhook:", error);
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
		return new NextResponse(`Internal Server Error: ${errorMessage}`, { status: 500 });
	}
}

