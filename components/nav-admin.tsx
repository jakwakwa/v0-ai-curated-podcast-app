"use client"

import { useEffect, useState } from "react"
import { Settings, Shield } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar-ui"

export function NavAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch("/api/admin/check")
        const data = await response.json()
        setIsAdmin(data.isAdmin)
      } catch (error) {
        console.error("Error checking admin status:", error)
        setIsAdmin(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminStatus()
  }, [])

  // Don't render anything if not admin or still loading
  if (isLoading || !isAdmin) {
    return null
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <Shield className="h-4 w-4 mr-1" />
        Admin
      </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <a href="/admin">
              <Settings className="h-4 w-4" />
              <span>Generate Episodes</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
