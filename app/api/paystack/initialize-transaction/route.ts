import https from "node:https"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
	const { userId } = await auth()

	if (!userId) {
		return new NextResponse("Unauthorized", { status: 401 })
	}

	const { planCode } = await req.json()

	if (!planCode) {
		return new NextResponse("Missing required field: planCode", { status: 400 })
	}

	const user = await prisma.user.findUnique({
		where: {
			user_id: userId,
		},
	})

	if (!(user && user.email !== undefined)) {
		return new NextResponse("User not found or missing email", { status: 404 })
	}

	const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
	if (!PAYSTACK_SECRET_KEY) {
		console.error("Paystack secret key is not set in environment variables.")
		return new NextResponse("Internal Server Error: Paystack secret key not configured", { status: 500 })
	}

	const params = JSON.stringify({
		email: user.email,
		plan: planCode,
	})

	const options = {
		hostname: "api.paystack.co",
		port: 443,
		path: "/transaction/initialize",
		method: "POST",
		headers: {
			Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
			"Content-Type": "application/json",
		},
	}

	try {
		const paystackRes = await new Promise((resolve, reject) => {
			const request = https.request(options, apiRes => {
				let data = ""
				apiRes.on("data", chunk => {
					data += chunk
				})
				apiRes.on("end", () => {
					try {
						resolve(JSON.parse(data))
					} catch {
						reject(new Error(`Failed to parse Paystack response: ${data}`))
					}
				})
				apiRes.on("error", error => reject(error))
			})
			request.write(params)
			request.end()
		})

		// @ts-ignore
		if (paystackRes.status) {
			// @ts-ignore
			return NextResponse.json({ authorization_url: paystackRes.data.authorization_url })
		} else {
			// @ts-ignore
			console.error("Paystack Initialisation Error:", paystackRes.message)
			// @ts-ignore
			return new NextResponse(paystackRes.message || "Failed to initialise transaction", { status: 400 })
		}
	} catch (error) {
		console.error("Error initialising Paystack transaction:", error)
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
		return new NextResponse(`Internal Server Error: ${errorMessage}`, { status: 500 })
	}
}
