import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { requireOrgAdmin } from "@/lib/organization-roles"

// Force this API route to be dynamic since it uses requireOrgAdmin() which calls auth()
export const dynamic = "force-dynamic"

export async function GET() {
	try {
		// Require admin access
		await requireOrgAdmin()

		// Check environment variables
		const config = {
			hasHost: !!process.env.EMAIL_HOST,
			hasFrom: !!process.env.EMAIL_FROM,
			hasUser: !!process.env.EMAIL_USER,
			hasPass: !!process.env.EMAIL_PASS,
			hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT || "587",
			secure: process.env.EMAIL_SECURE === "true",
			from: process.env.EMAIL_FROM,
			user: process.env.EMAIL_USER,
			// Don't expose password
		}

		console.log("Email config verification:", config)

		// Check if all required variables are present
		if (!(config.hasHost && config.hasFrom && config.hasUser && config.hasPass)) {
			return NextResponse.json({
				success: false,
				error: "Missing required environment variables",
				config,
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
