import type React from 'react'
import type { Metadata } from 'next'
import { Roboto_Serif, Poppins } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ClientProviders } from './client-providers'
import { Header } from '@/components/header'

const robottoSerif = Roboto_Serif({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
})
const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})
export const metadata: Metadata = {
  title: 'AI-Powered Podcast Generator',
  description: 'Automated weekly podcast generation using AI.',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${poppins.className} ${robottoSerif.className}`}>
        <ClerkProvider>
          <ClientProviders>
            <div className='min-h-screen bg-background font-sans antialiased'>
              <Header />
              {children}
            </div>
          </ClientProviders>
        </ClerkProvider>
      </body>
    </html>
  )
}
