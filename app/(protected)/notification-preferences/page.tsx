import type { Metadata } from "next"
import { NotificationPreferences } from "@/components/user-account/notification-preferences"

export const revalidate = 0

export const metadata: Metadata = {
	title: "Notification Preferences",
	description: "Manage your notification settings",
}

export default function Page() {
	return (
		<div className="container mx-auto py-8 px-2 md:px-4 mt-4 max-w-3xl">
			<div className="mb-6">
				<h1 className="text-2xl font-semibold">Notification Preferences</h1>
				<p className="text-muted-foreground mt-1">Choose how you want to be notified.</p>
			</div>
			<NotificationPreferences />
		</div>
	)
}
