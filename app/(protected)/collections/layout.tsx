import { ClientProviders } from "@/app/client-providers"
import { ClerkProvider } from "@clerk/nextjs"
import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
	title: "AI-Powered Podcast Generator",
	description: "Automated weekly podcast generation using AI.",
	generator: "v0.dev",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<>
			<ClerkProvider>
				<ClientProviders>{children}</ClientProviders>
			</ClerkProvider>
		</>
	)
}
