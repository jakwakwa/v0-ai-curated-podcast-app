import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { Toaster } from "sonner"
import { ClientProviders } from "./client-providers"
import { StoreInitializer } from "./store-initializer"

const inter = Inter({ subsets: ["latin"] })
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
if (!clerkPublishableKey) {
	throw new Error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set")
}

export const metadata: Metadata = {
	title: "PodSlice | AI Podcast Summaries | Cut the Chatter, Keep the Insight.",
	description: "Experience the future of listening. PodSlice crafts weekly AI summaries of top podcasts with a stunningly realistic voice. Get your intelligence briefing in minutes",
	openGraph: {
		title: "PodSlice: Cut the Chatter, Keep the Insight.",
		description: "Experience the future of listening. PodSlice crafts weekly AI summaries of top podcasts with a stunningly realistic voice. Get your intelligence briefing in minutes",
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
