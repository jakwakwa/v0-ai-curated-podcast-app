"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Bell, Mail, Smartphone, Settings, Loader2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useNotificationStore } from "@/lib/stores/notification-store"

interface NotificationPreferencesProps {
	className?: string
}

export function NotificationPreferences({ className }: NotificationPreferencesProps) {
	const { preferences, isLoading, loadPreferences, updatePreferences, toggleEmailNotifications, toggleInAppNotifications } = useNotificationStore()
	const [isUpdating, setIsUpdating] = useState(false)

	// Load preferences on mount
	useEffect(() => {
		loadPreferences()
	}, [loadPreferences])

	// Handle email notifications toggle
	const handleEmailToggle = async () => {
		setIsUpdating(true)
		const result = await toggleEmailNotifications()
		setIsUpdating(false)

		if ("success" in result) {
			toast.success(
				preferences?.emailNotifications
					? "Email notifications disabled"
					: "Email notifications enabled"
			)
		} else {
			toast.error(`Failed to update email notifications: ${result.error}`)
		}
	}

	// Handle in-app notifications toggle
	const handleInAppToggle = async () => {
		setIsUpdating(true)
		const result = await toggleInAppNotifications()
		setIsUpdating(false)

		if ("success" in result) {
			toast.success(
				preferences?.inAppNotifications
					? "In-app notifications disabled"
					: "In-app notifications enabled"
			)
		} else {
			toast.error(`Failed to update in-app notifications: ${result.error}`)
		}
	}

	// Handle bulk update
	const handleBulkUpdate = async (emailEnabled: boolean, inAppEnabled: boolean) => {
		setIsUpdating(true)
		const result = await updatePreferences({
			emailNotifications: emailEnabled,
			inAppNotifications: inAppEnabled,
		})
		setIsUpdating(false)

		if ("success" in result) {
			toast.success("Notification preferences updated successfully")
		} else {
			toast.error(`Failed to update preferences: ${result.error}`)
		}
	}

	if (isLoading && !preferences) {
		return (
			<Card className={className}>
				<CardContent className="flex items-center justify-center py-8">
					<Loader2 className="h-6 w-6 animate-spin" />
				</CardContent>
			</Card>
		)
	}

	return (
		<div className={className}>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Bell className="h-5 w-5" />
						Notification Preferences
					</CardTitle>
					<CardDescription>
						Manage how you receive notifications and updates.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Email Notifications */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Mail className="h-5 w-5 text-muted-foreground" />
								<div>
									<h3 className="font-medium">Email Notifications</h3>
									<p className="text-sm text-muted-foreground">
										Receive important updates and notifications via email
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Switch
									checked={preferences?.emailNotifications || false}
									onCheckedChange={handleEmailToggle}
									disabled={isUpdating}
								/>
								{preferences?.emailNotifications ? (
									<Badge variant="default" className="bg-green-100 text-green-800">
										<Check className="h-3 w-3 mr-1" />
										Enabled
									</Badge>
								) : (
									<Badge variant="secondary">
										<X className="h-3 w-3 mr-1" />
										Disabled
									</Badge>
								)}
							</div>
						</div>
					</div>

					<Separator />

					{/* In-App Notifications */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Smartphone className="h-5 w-5 text-muted-foreground" />
								<div>
									<h3 className="font-medium">In-App Notifications</h3>
									<p className="text-sm text-muted-foreground">
										Receive notifications within the application
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Switch
									checked={preferences?.inAppNotifications || false}
									onCheckedChange={handleInAppToggle}
									disabled={isUpdating}
								/>
								{preferences?.inAppNotifications ? (
									<Badge variant="default" className="bg-green-100 text-green-800">
										<Check className="h-3 w-3 mr-1" />
										Enabled
									</Badge>
								) : (
									<Badge variant="secondary">
										<X className="h-3 w-3 mr-1" />
										Disabled
									</Badge>
								)}
							</div>
						</div>
					</div>

					<Separator />

					{/* Quick Actions */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Quick Actions</h3>
						<div className="grid gap-3 md:grid-cols-2">
							<Button
								variant="outline"
								onClick={() => handleBulkUpdate(true, true)}
								disabled={isUpdating}
								className="flex items-center gap-2"
							>
								<Check className="h-4 w-4" />
								Enable All
							</Button>
							<Button
								variant="outline"
								onClick={() => handleBulkUpdate(false, false)}
								disabled={isUpdating}
								className="flex items-center gap-2"
							>
								<X className="h-4 w-4" />
								Disable All
							</Button>
						</div>
					</div>

					<Separator />

					{/* Notification Types */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Notification Types</h3>
						<div className="space-y-4">
							<div className="flex items-center justify-between p-3 border rounded-lg">
								<div>
									<p className="font-medium">Subscription Updates</p>
									<p className="text-sm text-muted-foreground">
										Billing, plan changes, and payment confirmations
									</p>
								</div>
								<Badge variant="outline">Always On</Badge>
							</div>
							<div className="flex items-center justify-between p-3 border rounded-lg">
								<div>
									<p className="font-medium">New Episodes</p>
									<p className="text-sm text-muted-foreground">
										When new episodes are added to your curated bundles
									</p>
								</div>
								<Badge variant="outline">Always On</Badge>
							</div>
							<div className="flex items-center justify-between p-3 border rounded-lg">
								<div>
									<p className="font-medium">System Updates</p>
									<p className="text-sm text-muted-foreground">
										Important system announcements and maintenance
									</p>
								</div>
								<Badge variant="outline">Always On</Badge>
							</div>
						</div>
					</div>

					<Separator />

					{/* Last Updated */}
					{preferences?.updatedAt && (
						<div className="text-sm text-muted-foreground">
							Last updated: {new Date(preferences.updatedAt).toLocaleDateString()} at{" "}
							{new Date(preferences.updatedAt).toLocaleTimeString()}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
