import type { Metadata } from "next"
import { GlobalProgressBar } from "@/components/ui/global-progress-bar"
import AdminTabs from "./_components/admin-tabs.client"

export const metadata: Metadata = {
	title: "Admin Portal",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			{/* Thin top progress bar */}
			<GlobalProgressBar />
			{/* Tabs */}
			<AdminTabs />
			<div className="max-w-6xl mx-auto">{children}</div>
		</div>
	)
}
