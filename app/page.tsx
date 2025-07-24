import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import LandingPageContent from "@/components/landing-page-content"

// Remove force-dynamic - not recommended by Vercel
// export const dynamic = "force-dynamic"

export default async function LandingPage() {
	const { userId } = await auth()

	// If user is authenticated, redirect to dashboard
	if (userId) {
		redirect("/dashboard")
	}

	return <LandingPageContent />
}
