import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"

import { Analytics } from "@vercel/analytics/react"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "sonner"

import { ClientProviders } from "./client-providers"
import "./globals.css"
import { StoreInitializer } from "./store-initializer"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
if (!clerkPublishableKey) {
	throw new Error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set")
}

export const metadata: Metadata = {
	title: "PODSLICE | AI Podcast Summaries | Cut the Chatter, Keep the Insight.",
	description:
		"Experience the future of listening. PODSLICE crafts weekly AI summaries of top podcasts with a stunningly realistic voice. Get your intelligence briefing in minutes",
	openGraph: {
		title: "PODSLICE: Cut the Chatter, Keep the Insight.",
		description:
			"Experience the future of listening. PODSLICE crafts weekly AI summaries of top podcasts with a stunningly realistic voice. Get your intelligence briefing in minutes",
	},
	twitter: {
		card: "summary_large_image",
	},
	icons: [{ rel: "icon", url: "/favicon.svg" }],
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
					publishableKey={clerkPublishableKey || ""}
					appearance={{
						baseTheme: dark,
					}}
				>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<ClientProviders>
							<StoreInitializer />
							<div className="relative flex min-h-screen flex-col">
								<SiteHeader />
								<div className="flex-1">{children}</div>
							</div>
							<Toaster />
							<Analytics />
							<SpeedInsights />
						</ClientProviders>
					</ThemeProvider>
				</ClerkProvider>
			</body>
		</html>
	)
}
