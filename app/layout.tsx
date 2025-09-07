import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next"
import { Work_Sans } from "next/font/google"
import type React from "react"
import { Toaster } from "sonner"
import { GlobalProgressBar } from "@/components/ui/global-progress-bar"
import { ClientProviders } from "./client-providers"

import "./globals.css"

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
				<link rel="icon" href="/icon?<generated>" type="image/png" sizes="32x32" />
			</head>
			<body className={`${workSans.className}`}>
				<GlobalProgressBar />

				<ClerkProvider
					publishableKey={clerkPublishableKey || ""}
					appearance={{
						baseTheme: dark, // <-- Move baseTheme here
						elements: {
							rootBox: {
								width: "90vw",
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								maxWidth: "500px",
								minWidth: "700px",
							},
							variables: {
								fontWeight: {
									normal: 200,
									medium: 300,
									semibold: 600,
									bold: 700,
								},
							},
							socialButtons: {
								display: "flex",
								justifyContent: "center",
								gap: "0.5rem",
							},
							button: {
								display: "flex",
								alignSelf: "center",
								justifyContent: "center",
							},
							form: {
								display: "flex",
								justifyContent: "center",
							},
							cardBox: {
								background: "#121928 !important",
								width: "90vw",
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								margin: "0 auto",
								maxWidth: "500px",
								minWidth: "300px",
							},
							card: {
								background: "#1B1822",
							},
							footer: {
								background: "#354F4C28",

								p: {
									color: "#37A1A3 !important",
								},
							},
							footerAction: {
								color: "#121928 !important",
								p: {
									color: "#121928 !important",
								},
							},
						},
					}}>
					<ClientProviders>

						{children}
						<Toaster />


					</ClientProviders>
				</ClerkProvider>
				<Analytics />
			</body>
		</html>
	)
}
