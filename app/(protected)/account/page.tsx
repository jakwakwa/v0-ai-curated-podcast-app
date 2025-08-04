"use client"

import { useUser } from "@clerk/nextjs"
import { ProfileManagement } from "@/components/features/profile-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NotificationPreferences } from "@/components/user-account/notification-preferences"
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
		<div className="container mx-auto py-8 px-4 mt-12">
			<div className="max-w-4xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold">Account Settings</h1>
					<p className="text-muted-foreground mt-2">Manage your account preferences and settings</p>
				</div>

				<Tabs defaultValue="profile" className="space-y-6">
					<TabsList className="grid w-full grid-cols-4 bg-card border border-[var(--color-border)] h-14">
						<TabsTrigger
							value="profile"
							className="data-[state=active]:bg-[#000]/50 data-[state=active]:text-[var(--color-button-secondary-foreground)] text-foreground hover:bg-secondary hover:text-foreground h-12"
						>
							Profile
						</TabsTrigger>
						<TabsTrigger
							value="notifications"
							className="data-[state=active]:bg-[#000]/50 data-[state=active]:text-[var(--color-button-secondary-foreground)] text-foreground hover:bg-secondary hover:text-foreground h-12"
						>
							Notifications
						</TabsTrigger>
						<TabsTrigger
							value="security"
							className="data-[state=active]:bg-[#000]/50 data-[state=active]:text-[var(--color-button-secondary-foreground)] text-foreground hover:bg-secondary hover:text-foreground h-12"
						>
							Security
						</TabsTrigger>
						<TabsTrigger
							value="subscription"
							className="data-[state=active]:bg-[#000000]/50 data-[state=active]:text-[var(--color-button-secondary-foreground)] text-foreground hover:bg-secondary hover:text-foreground h-12"
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
							<div className="bg-card p-4 rounded-lg">
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
