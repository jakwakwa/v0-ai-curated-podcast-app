"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar-ui"
import type React from 'react'
import styles from './layout.module.css'
import { StoreInitializer } from "../store-initializer"


export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
    </SidebarProvider>
  )
}
