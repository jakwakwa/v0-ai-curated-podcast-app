"use client"

import { useUser } from "@clerk/nextjs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NotificationPreferences } from "@/components/user-account/notification-preferences"
import { ProfileManagement } from "@/components/user-account/profile-management"
import { SecuritySettings } from "@/components/user-account/security-settings"
import { SubscriptionTestControls } from "@/components/user-account/subscription-test-controls"
import { useSubscriptionStore } from "@/lib/stores/subscription-store"

export default function AccountSettingsPage() {
	const { isLoaded } = useUser()
	const { subscription, isLoading: subscriptionLoading } = useSubscriptionStore()

	const getCurrentPlanName = () => {
		if (!subscription) return "No active plan"
		switch (subscription.status) {
			case "trialing":
				return "Trial"
			case "active":
				return "Pro"
			case "canceled":
				return "Canceled"
			default:
				return "Unknown"
		}
	}

	if (!isLoaded) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
			</div>
		)
	}

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="max-w-4xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold">Account Settings</h1>
					<p className="text-muted-foreground mt-2">Manage your account preferences and settings</p>
				</div>

				<Tabs defaultValue="profile" className="space-y-6">
					<TabsList className="grid w-full grid-cols-4 bg-[var(--color-card-neutral)] border border-[var(--color-border)] h-12">
						<TabsTrigger
							value="profile"
							className="data-[state=active]:bg-[var(--color-button-secondary-bg)] data-[state=active]:text-[var(--color-button-secondary-foreground)] text-muted-foreground hover:bg-[var(--color-accent)] hover:text-foreground"
						>
							Profile
						</TabsTrigger>
						<TabsTrigger
							value="notifications"
							className="data-[state=active]:bg-[var(--color-button-secondary-bg)] data-[state=active]:text-[var(--color-button-secondary-foreground)] text-muted-foreground hover:bg-[var(--color-accent)] hover:text-foreground"
						>
							Notifications
						</TabsTrigger>
						<TabsTrigger
							value="security"
							className="data-[state=active]:bg-[var(--color-button-secondary-bg)] data-[state=active]:text-[var(--color-button-secondary-foreground)] text-muted-foreground hover:bg-[var(--color-accent)] hover:text-foreground"
						>
							Security
						</TabsTrigger>
						<TabsTrigger
							value="subscription"
							className="data-[state=active]:bg-[var(--color-button-secondary-bg)] data-[state=active]:text-[var(--color-button-secondary-foreground)] text-muted-foreground hover:bg-[var(--color-accent)] hover:text-foreground"
						>
							Subscription
						</TabsTrigger>
					</TabsList>

					<TabsContent value="profile" className="space-y-6">
						<ProfileManagement />
					</TabsContent>

					<TabsContent value="notifications" className="space-y-6">
						<NotificationPreferences />
					</TabsContent>

					<TabsContent value="security" className="space-y-6">
						<SecuritySettings />
					</TabsContent>

					<TabsContent value="subscription" className="space-y-6">
						<div className="space-y-6">
							<div className="bg-muted p-4 rounded-lg">
								<h3 className="font-semibold mb-2">Current Plan</h3>
								<p className="text-sm text-muted-foreground">{subscriptionLoading ? "Loading..." : getCurrentPlanName()}</p>
							</div>
							<SubscriptionTestControls />
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}
