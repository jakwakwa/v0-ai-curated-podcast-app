"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useSubscriptionStore } from "@/lib/stores/subscription-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CreditCard, User, Bell, Shield, Settings } from "lucide-react"
import { SubscriptionManagement } from "@/components/subscription-management"
import { ProfileManagement } from "@/components/profile-management"
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
			<div className="container mx-auto px-4 py-8">
				<div className="animate-pulse space-y-4">
					<div className="h-8 bg-muted rounded w-1/3"></div>
					<div className="h-32 bg-muted rounded"></div>
				</div>
			</div>
		)
	}

	if (!user) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Access Denied</h1>
					<p className="text-muted-foreground mb-6">Please sign in to view your account settings.</p>
				</div>
			</div>
		)
	}

	return (
		<>
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
					<p className="text-muted-foreground">Manage your subscription, profile, and preferences.</p>
				</div>

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

					{/* Subscription Management Tab */}
					<TabsContent value="subscription" className="space-y-6">
						<SubscriptionManagement />
					</TabsContent>

					{/* Profile Settings Tab */}
					<TabsContent value="profile" className="space-y-6">
						<ProfileManagement />
					</TabsContent>

					{/* Notification Preferences Tab */}
					<TabsContent value="notifications" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Bell className="h-5 w-5" />
									Notification Preferences
								</CardTitle>
								<CardDescription>
									Manage your notification settings and preferences.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="space-y-4">
									<h3 className="text-lg font-semibold">Email Notifications</h3>
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<div>
												<p className="font-medium">Email Notifications</p>
												<p className="text-sm text-muted-foreground">
													Receive notifications via email
												</p>
											</div>
											<Button variant="outline" size="sm">
												Configure
											</Button>
										</div>
										<div className="flex items-center justify-between">
											<div>
												<p className="font-medium">In-App Notifications</p>
												<p className="text-sm text-muted-foreground">
													Receive notifications in the app
												</p>
											</div>
											<Button variant="outline" size="sm">
												Configure
											</Button>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Security Settings Tab */}
					<TabsContent value="security" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Shield className="h-5 w-5" />
									Security Settings
								</CardTitle>
								<CardDescription>
									Manage your account security and privacy settings.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="space-y-4">
									<h3 className="text-lg font-semibold">Account Security</h3>
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<div>
												<p className="font-medium">Change Password</p>
												<p className="text-sm text-muted-foreground">
													Update your account password
												</p>
											</div>
											<Button variant="outline" size="sm">
												Change
											</Button>
										</div>
										<div className="flex items-center justify-between">
											<div>
												<p className="font-medium">Two-Factor Authentication</p>
												<p className="text-sm text-muted-foreground">
													Add an extra layer of security
												</p>
											</div>
											<Button variant="outline" size="sm">
												Enable
											</Button>
										</div>
									</div>
								</div>

								<Separator />

								<div className="space-y-4">
									<h3 className="text-lg font-semibold">Danger Zone</h3>
									<div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
										<div className="flex items-center justify-between">
											<div>
												<p className="font-medium text-destructive">Delete Account</p>
												<p className="text-sm text-muted-foreground">
													Permanently delete your account and all data
												</p>
											</div>
											<Button variant="destructive" size="sm">
												Delete Account
											</Button>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>

			{/* Test Controls - Only show in development */}
			{process.env.NODE_ENV === "development" && <SubscriptionTestControls />}
		</>
	)
}
