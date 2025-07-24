import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import emailService from "@/lib/email-service"
import { requireOrgAdmin } from "@/lib/organization-roles"

// Force this API route to be dynamic since it uses requireOrgAdmin() which calls auth()
export const dynamic = 'force-dynamic'

export async function POST() {
	try {
		// Require admin access for testing
		await requireOrgAdmin()

		// Get current user's email
		const user = await currentUser()
		if (!user?.emailAddresses?.[0]?.emailAddress) {
			return NextResponse.json({ error: "User email not found" }, { status: 400 })
		}

		const userEmail = user.emailAddresses[0].emailAddress

		// Log configuration (without sensitive data)
		console.log("Email config check:", {
			hasHost: !!process.env.EMAIL_HOST,
			hasFrom: !!process.env.EMAIL_FROM,
			hasUser: !!process.env.EMAIL_USER,
			hasPass: !!process.env.EMAIL_PASS,
			host: process.env.EMAIL_HOST,
			from: process.env.EMAIL_FROM,
			user: process.env.EMAIL_USER,
			targetEmail: userEmail,
		})

		// Send test email
		const success = await emailService.sendTestEmail(userEmail)

		if (success) {
			return NextResponse.json({
				success: true,
				message: "Test email sent successfully!",
				email: userEmail,
			})
		} else {
			console.error("Email service returned false for test email")
			return NextResponse.json(
				{
					error: "Failed to send test email. Check server logs and email configuration.",
				},
				{ status: 500 }
			)
		}
	} catch (error) {
		console.error("[NOTIFICATIONS_TEST_EMAIL_POST]", error)

		if (error instanceof Error && (error.message.includes("Organization role required") || error.message === "Admin access required")) {
			return NextResponse.json({ error: "Admin access required" }, { status: 403 })
		}

		return NextResponse.json({ error: "Failed to send test email" }, { status: 500 })
	}
}
