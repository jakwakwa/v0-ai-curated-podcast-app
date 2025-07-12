import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { ClientProviders } from "./client-providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI-Powered Podcast Generator",
  description: "Automated weekly podcast generation using AI.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClerkProvider>
          <ClientProviders>
            <div className="min-h-screen bg-background font-sans antialiased">{children}</div>
          </ClientProviders>
        </ClerkProvider>
      </body>
    </html>
  )
}
