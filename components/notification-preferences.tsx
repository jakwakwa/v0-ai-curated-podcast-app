"use client"

import { Bell, Check as CheckIcon, Loader2, Mail, Smartphone, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ComponentSpinner from "@/components/ui/component-spinner"
import DateIndicator from "@/components/ui/date-indicator"
import { Separator } from "@/components/ui/separator"
import { SubmitBtn } from "@/components/ui/submit-btn"
import { useNotificationStore } from "@/lib/stores/notification-store"

type NotificationSettingsProps = {
	emailNotifications: boolean
	inAppNotifications: boolean
	updatedAt: Date
}

export function NotificationPreferences() {
	const { preferences, isLoading, loadPreferences, updatePreferences, toggleInAppNotifications, toggleEmailNotifications } = useNotificationStore()
	const [isUpdating, setIsUpdating] = useState(false)

	const toggleNotifications = async (settingType: "emailNotifications" | "inAppNotifications") => {
		if (settingType === "emailNotifications") {
			return await toggleEmailNotifications()
		}
		return await toggleInAppNotifications()
	}

	const handleNotificationToggle = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const settingType = event.currentTarget.value as "emailNotifications" | "inAppNotifications"
		setIsUpdating(true)
		try {
			const result = await toggleNotifications(settingType)
			if ("error" in result) {
				toast.error(result.error)
			} else {
				toast.success(`${settingType} notifications updated`)
			}
		} catch {
			toast.error(`Failed to update ${settingType} notifications`)
		} finally {
			setIsUpdating(false)
		}
	}

	const handleSaveAll: React.MouseEventHandler<HTMLButtonElement> = async () => {
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

	useEffect(() => {
		loadPreferences()
	}, [loadPreferences])

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<ComponentSpinner label="notification preferences" />
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Bell className="w-4 h-4" />
						Notification Preferences
					</CardTitle>
					<CardDescription>Manage how you receive notifications about new episodes and updates.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Email Notifications */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Mail className="w-4 h-4" />
								<h3 className="font-medium">Email Notifications</h3>
							</div>
							<p className="text-sm text-muted-foreground">Receive email notifications when new episodes are ready.</p>
						</div>
						<div className="flex items-center gap-2">
							{preferences && <SettingsToggle preferences={preferences} label="Email" toggleHandler={handleNotificationToggle} settingType="emailNotifications" isUpdating={isUpdating} />}
						</div>
					</div>

					<Separator />

					{/* In-App Notifications */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Smartphone className="w-4 h-4" />
								<h3 className="font-medium">In-App Notifications</h3>
							</div>
							<p className="text-sm text-muted-foreground">Show notifications within the app when new episodes are ready.</p>
						</div>
						<div className="flex items-center gap-2">
							{preferences && <SettingsToggle preferences={preferences} label="In-App" toggleHandler={handleNotificationToggle} settingType="inAppNotifications" isUpdating={isUpdating} />}
						</div>
					</div>

					{/* Save Button */}
					<SubmitBtn isUpdating={isUpdating} handleSaveAll={handleSaveAll} />
				</CardContent>
			</Card>

			{/* Notification Status */}
			{preferences && (
				<Card>
					<CardHeader>
						<CardTitle>Current Settings</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-2 text-sm">
							<SettingsToggle preferences={preferences} label="Email" settingType="emailNotifications" toggleHandler={handleNotificationToggle} />
							<SettingsToggle preferences={preferences} label="In-App" settingType="inAppNotifications" toggleHandler={handleNotificationToggle} />
							<DateIndicator size="sm" indicator={preferences.updatedAt} label="Last updated" />
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
}

function SettingsToggle({
	preferences,
	label,
	toggleHandler,
	settingType,
	isUpdating = false,
}: {
	preferences: NotificationSettingsProps
	label: string
	toggleHandler?: React.MouseEventHandler<HTMLButtonElement>
	settingType: "emailNotifications" | "inAppNotifications"
	isUpdating?: boolean
}): React.ReactElement {
	return (
		<div className="flex items-center justify-between">
			<span>{label} Notifications</span>
			<div className="flex items-center gap-1">
				{preferences[settingType] ? <CheckIcon className="w-3 h-3 text-green-600" /> : <X className="w-3 h-3 text-red-600" />}
				{toggleHandler && (
					<Button variant="default" size="sm" onClick={toggleHandler} disabled={isUpdating} value={settingType}>
						{isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : "Toggle"}
					</Button>
				)}
			</div>
		</div>
	)
}

export { SettingsToggle }
