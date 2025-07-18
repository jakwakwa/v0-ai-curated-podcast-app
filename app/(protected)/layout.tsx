"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar-ui"
import { DummyDataTogglePanel } from "@/components/dummy-data-toggle-panel"
import type React from 'react'
import styles from './layout.module.css'
import { StoreInitializer } from "../store-initializer"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log(`[ProtectedLayout] Auth state - isLoaded: ${isLoaded}, isSignedIn: ${isSignedIn}`)

    if (isLoaded && !isSignedIn) {
      console.log(`[ProtectedLayout] Redirecting to sign-in`)
      router.push('/sign-in')
    }
  }, [isSignedIn, isLoaded, router])

  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
          <p>Loading authentication...</p>
        </div>
      </div>
    )
  }

  // Redirect if not signed in
  if (!isSignedIn) {
    console.log(`[ProtectedLayout] User not signed in, showing loading...`)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
          <p>Redirecting to sign-in...</p>
        </div>
      </div>
    )
  }

  console.log(`[ProtectedLayout] User authenticated, rendering protected content`)

  // No auth check needed here - middleware handles all protection
  	return (
		<SidebarProvider>
			<StoreInitializer />
			<AppSidebar />
			<div className={styles.container}>
				<SiteHeader />
				<div className={styles.content}>
					{children}
				</div>
			</div>
			<DummyDataTogglePanel />
		</SidebarProvider>
	)
}
