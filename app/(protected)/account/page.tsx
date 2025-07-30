"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useSubscriptionStore } from "@/lib/stores/subscription-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, User, Bell, Shield, Settings } from "lucide-react"
import { SubscriptionManagement } from "@/components/subscription-management"
import { ProfileManagement } from "@/components/profile-management"
import { NotificationPreferences } from "@/components/notification-preferences"
import { SecuritySettings } from "@/components/security-settings"
import { SubscriptionTestControls } from "@/components/subscription-test-controls"
import styles from "./page.module.css"

export default function AccountSettingsPage() {
	const { user, isLoaded } = useUser()
	const { subscription, tiers, loadSubscription } = useSubscriptionStore()
	const [activeTab, setActiveTab] = useState("subscription")

	// Load subscription data on mount
	useEffect(() => {
		if (isLoaded && user) {
			loadSubscription()
		}
	}, [isLoaded, user, loadSubscription])

	// Get current plan information
	const getCurrentPlanName = () => {
		if (!subscription) return "FreeSlice"
		const currentPlan = tiers.find(tier => tier.paystackPlanCode === subscription.paystackPlanCode)
		return currentPlan?.name || "FreeSlice"
	}

	const currentPlan = getCurrentPlanName()

	if (!isLoaded) {
		return (
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				<div className="flex items-center justify-center py-8">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
				</div>
			</div>
		)
	}

	if (!user) {
		return (
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				<Card>
					<CardContent className="flex items-center justify-center py-8">
						<p className="text-muted-foreground">Please sign in to access account settings.</p>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<>
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
					<p className="text-muted-foreground">
						Manage your subscription, profile, and account preferences.
					</p>
				</div>

				{/* Tabs */}
				<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="subscription" className="flex items-center gap-2">
							<CreditCard className="h-4 w-4" />
							Subscription
						</TabsTrigger>
						<TabsTrigger value="profile" className="flex items-center gap-2">
							<User className="h-4 w-4" />
							Profile
						</TabsTrigger>
						<TabsTrigger value="notifications" className="flex items-center gap-2">
							<Bell className="h-4 w-4" />
							Notifications
						</TabsTrigger>
						<TabsTrigger value="security" className="flex items-center gap-2">
							<Shield className="h-4 w-4" />
							Security
						</TabsTrigger>
					</TabsList>

					{/* Subscription Tab */}
					<TabsContent value="subscription" className="space-y-6">
						<SubscriptionManagement />
					</TabsContent>

					{/* Profile Tab */}
					<TabsContent value="profile" className="space-y-6">
						<ProfileManagement />
					</TabsContent>

					{/* Notifications Tab */}
					<TabsContent value="notifications" className="space-y-6">
						<NotificationPreferences />
					</TabsContent>

					{/* Security Tab */}
					<TabsContent value="security" className="space-y-6">
						<SecuritySettings />
					</TabsContent>
				</Tabs>
			</div>

			{/* Test Controls - Only show in development */}
			{process.env.NODE_ENV === "development" && <SubscriptionTestControls />}
		</>
	)
}
