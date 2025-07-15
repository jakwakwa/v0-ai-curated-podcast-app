import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar-ui"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // No auth check needed here - middleware handles all protection
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-screen flex-col">
        <SiteHeader />
        <div className="p-12 flex gap-8">
          {children}
        </div>
      </div>
    </SidebarProvider>
  )
} 