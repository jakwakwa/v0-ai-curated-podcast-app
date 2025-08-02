import type { Metadata } from "next"
import { Work_Sans } from "next/font/google"
import type React from "react"
import "./globals.css"

import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { Toaster } from "sonner"
import { ClientProviders } from "./client-providers"
import { StoreInitializer } from "./store-initializer"

const workSans = Work_Sans({ subsets: ["latin"] })

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
if (!clerkPublishableKey) {
	throw new Error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set")
}

export const metadata: Metadata = {
	title: "PODSLICE | AI Podcast Summaries | Cut the Chatter, Keep the Insight.",
	description: "Experience the future of listening. PODSLICE crafts weekly AI summaries of top podcasts with a stunningly realistic voice. Get your intelligence briefing in minutes",
	openGraph: {
		title: "Cut the Chatter, Keep the Insight.",
		description: "Experience the future of listening. PODSLICE crafts weekly AI summaries of top podcasts with a stunningly realistic voice. Get your intelligence briefing in minutes",
		url: "https://podslice.ai",
		siteName: "PODSLICE AI",
		images: [{ url: "/podslice-og.jpg" }],
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
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				<link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100..900;1,100..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
			</head>
			<body className={`${workSans.className}`}>
				<ClerkProvider
					publishableKey={clerkPublishableKey || ""}
					appearance={{
						baseTheme: dark,
					}}
				>
					<ClientProviders>
						<StoreInitializer />
						{children}
						<Toaster />
					</ClientProviders>
				</ClerkProvider>
			</body>
		</html>
	)
}
