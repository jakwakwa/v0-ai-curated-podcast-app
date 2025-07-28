import { NextResponse } from "next/server";
import https from "https";

interface PaystackPlan {
	name: string;
	interval: string;
	amount: number;
}

interface PaystackResponse {
	status: boolean;
	message: string;
	data?: {
		name: string;
		interval: string;
		amount: number;
		plan_code: string;
		// other fields that might be in the response
	};
}


export async function POST(req: Request) {
	if (req.headers.get("x-admin-token") !== process.env.ADMIN_SECRET) {
		return new NextResponse("Forbidden", { status: 403 });
	}

	const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

	if (!PAYSTACK_SECRET_KEY) {
		console.error("Paystack secret key is not set in environment variables.");
		return new NextResponse("Internal Server Error: Paystack secret key not configured", { status: 500 });
	}

	const plansToCreate: PaystackPlan[] = [
		{ name: "Casual Listener Monthly", interval: "monthly", amount: 500 }, // 500 kobo = 5 NGN, for $5 this should be 500 cents
		{ name: "Curate & Control Monthly", interval: "monthly", amount: 1000 }, // 1000 kobo = 10 NGN, for $10 this should be 1000 cents
	];

	try {
		const results = [];
		for (const plan of plansToCreate) {
			const params = JSON.stringify(plan);

			const options = {
				hostname: "api.paystack.co",
				port: 443,
				path: "/plan",
				method: "POST",
				headers: {
					Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
					"Content-Type": "application/json",
					"Content-Length": params.length,
				},
			};

			const paystackRes: PaystackResponse = await new Promise((resolve, reject) => {
				const request = https.request(options, (apiRes) => {
					let data = "";
					apiRes.on("data", (chunk) => {
						data += chunk;
					});
					apiRes.on("end", () => {
						try {
							resolve(JSON.parse(data));
						} catch {
							reject(new Error(`Failed to parse Paystack response: ${data}`));
						}
					});
					apiRes.on("error", (error) => reject(error));
				});
				request.write(params);
				request.end();
			});

			if (paystackRes.status) {
				results.push({ plan: plan.name, status: "success", data: paystackRes.data });
			} else {
				results.push({ plan: plan.name, status: "failed", message: paystackRes.message });
			}
		}
		return NextResponse.json({ message: "Plan creation results", results });
	} catch (error) {
		console.error("Error creating Paystack plans:", error);
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
		return new NextResponse(`Internal Server Error: ${errorMessage}`, { status: 500 });
	}
}
