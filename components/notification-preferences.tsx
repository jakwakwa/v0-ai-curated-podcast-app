"use client"

import { Bell, Check, Loader2, Mail, Smartphone, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useNotificationStore } from "@/lib/stores/notification-store"

export function NotificationPreferences() {
	const { preferences, isLoading, loadPreferences, updatePreferences, toggleEmailNotifications, toggleInAppNotifications } = useNotificationStore()
	const [isUpdating, setIsUpdating] = useState(false)

	useEffect(() => {
		loadPreferences()
	}, [loadPreferences])

	const handleEmailToggle = async () => {
		setIsUpdating(true)
		try {
			const result = await toggleEmailNotifications()
			if ("error" in result) {
				toast.error(result.error)
			} else {
				toast.success("Email notifications updated")
			}
		} catch {
			toast.error("Failed to update email notifications")
		} finally {
			setIsUpdating(false)
		}
	}

	const handleInAppToggle = async () => {
		setIsUpdating(true)
		try {
			const result = await toggleInAppNotifications()
			if ("error" in result) {
				toast.error(result.error)
			} else {
				toast.success("In-app notifications updated")
			}
		} catch {
			toast.error("Failed to update in-app notifications")
		} finally {
			setIsUpdating(false)
		}
	}

	const handleSaveAll = async () => {
		if (!preferences) return

		setIsUpdating(true)
		try {
			const result = await updatePreferences({
				emailNotifications: preferences.emailNotifications,
				inAppNotifications: preferences.inAppNotifications,
			})
			if ("error" in result) {
				toast.error(result.error)
			} else {
				toast.success("Notification preferences saved")
			}
		} catch {
			toast.error("Failed to save preferences")
		} finally {
			setIsUpdating(false)
		}
	}

	if (isLoading) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center py-8">
					<div className="flex items-center gap-2">
						<Loader2 className="h-4 w-4 animate-spin" />
						<span>Loading notification preferences...</span>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Bell className="h-5 w-5" />
						Notification Preferences
					</CardTitle>
					<CardDescription>Manage how you receive notifications about new episodes and updates.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Email Notifications */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<Mail className="h-4 w-4" />
									<h3 className="font-medium">Email Notifications</h3>
								</div>
								<p className="text-sm text-muted-foreground">Receive email notifications when new episodes are ready.</p>
							</div>
							<div className="flex items-center gap-2">
								<Switch checked={preferences?.emailNotifications ?? false} onCheckedChange={handleEmailToggle} disabled={isUpdating} />
								{isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
							</div>
						</div>
					</div>

					<Separator />

					{/* In-App Notifications */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<Smartphone className="h-4 w-4" />
									<h3 className="font-medium">In-App Notifications</h3>
								</div>
								<p className="text-sm text-muted-foreground">Show notifications within the app when new episodes are ready.</p>
							</div>
							<div className="flex items-center gap-2">
								<Switch checked={preferences?.inAppNotifications ?? false} onCheckedChange={handleInAppToggle} disabled={isUpdating} />
								{isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
							</div>
						</div>
					</div>

					{/* Save Button */}
					<div className="flex justify-end">
						<Button onClick={handleSaveAll} disabled={isUpdating} className="flex items-center gap-2">
							{isUpdating ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									Saving...
								</>
							) : (
								<>
									<Check className="h-4 w-4" />
									Save Preferences
								</>
							)}
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Notification Status */}
			{preferences && (
				<Card>
					<CardHeader>
						<CardTitle className="text-sm">Current Settings</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2 text-sm">
							<div className="flex items-center justify-between">
								<span>Email Notifications:</span>
								<span className={`flex items-center gap-1 ${preferences.emailNotifications ? "text-green-600" : "text-red-600"}`}>
									{preferences.emailNotifications ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
									{preferences.emailNotifications ? "Enabled" : "Disabled"}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span>In-App Notifications:</span>
								<span className={`flex items-center gap-1 ${preferences.inAppNotifications ? "text-green-600" : "text-red-600"}`}>
									{preferences.inAppNotifications ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
									{preferences.inAppNotifications ? "Enabled" : "Disabled"}
								</span>
							</div>
							<div className="text-xs text-muted-foreground mt-2">Last updated: {preferences.updatedAt.toLocaleDateString()}</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
}
