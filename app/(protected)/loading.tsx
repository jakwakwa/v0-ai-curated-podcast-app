// import { SidebarProvider } from "@/components/ui/sidebar"
// import { SiteHeader } from "@/components/ui/site-header"
// CSS module migrated to Tailwind classes

export default function Loading() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="flex flex-col gap-3">
				<div className="text-xl leading-7 font-semibold tracking-tight text-muted-foreground">Loading...</div>
				<div className="w-8 h-px bg-primary rounded-full mx-auto animate-pulse"></div>
			</div>
		</div>
	)
}
