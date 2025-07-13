import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
// import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { ClientProviders } from "@/app/client-providers"
import { Header } from "@/components/header"

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
    <> 
        <ClerkProvider>
            <ClientProviders>
             <div className="mt-4 w-screen flex flex-col md:flex-row gap-4">            
                {children}
              </div>
            </ClientProviders>
          {/* </ClientProviders> */}
        </ClerkProvider>
        </>
  )
}
