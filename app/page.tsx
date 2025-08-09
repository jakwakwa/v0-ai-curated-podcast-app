import LandingPageContent from "@/components/containers/landing-page-content"

// import NewLandingPage from "@/components/new/new-landing-page"

// Remove force-dynamic - not recommended by Vercel
// // export const dynamic = "force-dynamic"

export default async function LandingPage() {
	// Public landing page - no auth checking needed
	// Users can navigate to login/signup from here
	return <LandingPageContent />
	// return <NewLandingPage />
}
