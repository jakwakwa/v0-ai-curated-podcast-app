import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";

import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import type React from "react";
import { Toaster } from "sonner";
import { GlobalAudioPlayerSheet } from "@/components/ui/global-audio-player-sheet";
import { GlobalProgressBar } from "@/components/ui/global-progress-bar";
import { ClientProviders } from "./client-providers";

import "./globals.css";

const workSans = Inter({ subsets: ["latin"] });

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!clerkPublishableKey) {
	throw new Error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set");
}

export const metadata: Metadata = {
	title: "PODSLICE | AI Podcast Summaries | Cut the Chatter, Keep the Insight.",
	description: "Experience the future  of listening. PODSLICE crafts weekly AI summaries of top podcasts with a stunningly realistic voice. Get your intelligence briefing in minutes",
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
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Vend+Sans:wght@500&display=swap" rel="stylesheet" />
				<link rel="icon" href="/icon?<generated>" type="image/png" sizes="32x32" />
			</head>
			<body className={`${workSans.className}`}>
				<GlobalProgressBar />
				<ClerkProvider
					publishableKey={clerkPublishableKey || ""}
					appearance={{
						baseTheme: [shadcn],
						variables: { colorPrimary: "#0AB38E", colorPrimaryForeground: "#000", colorForeground: "#fff", colorInputForeground: "#000000" },
						signIn: { variables: { colorPrimaryForeground: "#000", colorForeground: "#fff", colorInputForeground: "#000000" } },
					}}>
					<ClientProviders>
						{children}
						<Toaster closeButton richColors />
						<GlobalAudioPlayerSheet />
					</ClientProviders>
				</ClerkProvider>
				<Analytics />
			</body>
		</html>
	);
}
