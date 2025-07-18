import type { Metadata } from "next"
// import { Poppins } from "next/font/google"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"
// import { redirect } from "next/navigation";

// import { AppSidebar } from "@/components/app-sidebar"
// import { SiteHeader } from "@/components/site-header"
// import { PodcastList } from "@/components/podcast-list"
// import { SidebarProvider } from "@/components/ui/sidebar-ui"
import { Toaster } from "@/components/ui/sonner"
import { ClerkProvider } from "@clerk/nextjs"
// import { auth } from "@clerk/nextjs/server"
import { ClientProviders } from "./client-providers"
import { StoreInitializer } from "./store-initializer"
// import { Dashboard } from "@elevenlabs/elevenlabs-js/api/resources/conversationalAi/resources/dashboard/client/Client"
// import DashboardPage from "./page"
const inter = Inter({ subsets: ["latin"] })
export const metadata: Metadata = {
	description: "Automated AI-Generated Weekly Podcast Application",
	openGraph: {
		title: "Humanly Curated AI Podcast Application",
		description: "Automated AI-Generated Weekly Podcast Application",
	},
	twitter: {
		card: "summary_large_image",
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ClerkProvider
					publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
					appearance={{
						baseTheme: undefined,
					}}
				>
					<ClientProviders>
						<StoreInitializer />
						<Toaster />
						{children}
					</ClientProviders>
				</ClerkProvider>
			</body>
		</html>
	)
}
