import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { requireOrgAdmin } from "@/lib/organization-roles"

export async function GET() {
	try {
		// Require admin access
		await requireOrgAdmin()

		// Check environment variables
		const hasHost = !!process.env.EMAIL_HOST
		const hasFrom = !!process.env.EMAIL_FROM
		const hasUser = !!process.env.EMAIL_USER
		const hasPass = !!process.env.EMAIL_PASS
		const hasAppUrl = !!process.env.NEXT_PUBLIC_APP_URL

		console.log("Email config verification: checking configuration status")

		// Check if all required variables are present
		if (!(hasHost && hasFrom && hasUser && hasPass)) {
			return NextResponse.json({
				success: false,
				error: "Missing required environment variables",
				details: "Configuration incomplete"
			})
		}

		// Try to create and verify transporter
		try {
			const transporter = nodemailer.createTransport({
				host: process.env.EMAIL_HOST,
				port: parseInt(process.env.EMAIL_PORT || "587"),
				secure: process.env.EMAIL_SECURE === "true",
				auth: {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASS,
				},
			})

			// Test the connection
			await new Promise((resolve, reject) => {
				transporter.verify((error, success) => {
					if (error) {
						console.error("SMTP verification failed:", error)
						reject(error)
					} else {
						console.log("SMTP verification successful:", success)
						resolve(success)
					}
				})
			})

			return NextResponse.json({
				success: true,
				message: "Email configuration is valid and SMTP connection successful",
				config,
			})
		} catch (smtpError) {
			console.error("SMTP connection error:", smtpError)
			return NextResponse.json({
				success: false,
				error: "SMTP connection failed",
				details: smtpError instanceof Error ? smtpError.message : String(smtpError),
				config,
			})
		}
	} catch (error) {
		console.error("Email config verification error:", error)

		if (error instanceof Error && error.message.includes("Admin access required")) {
			return NextResponse.json({ error: "Admin access required" }, { status: 403 })
		}

		return NextResponse.json({
			success: false,
			error: "Failed to verify email configuration",
			details: error instanceof Error ? error.message : String(error),
		})
	}
}
