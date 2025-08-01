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
import styles from "./notification-preferences.module.css"

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
			<div className={styles.loadingContent}>
				<ComponentSpinner label="notification preferences" isLabel />
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<Card>
				<CardHeader>
					<CardTitle className={styles.cardTitle}>
						<Bell className={styles.cardTitleIcon} />
						Notification Preferences
					</CardTitle>
					<CardDescription>Manage how you receive notifications about new episodes and updates.</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Email Notifications */}
					<div className={styles.notificationContainer}>
						<div className={styles.flexRow}>
							<div className={styles.title}>
								<Mail className={styles.titleIcon} />
								<h3 className="font-medium">Email Notifications</h3>
							</div>
							<p className={styles.description}>Receive email notifications when new episodes are ready.</p>
						</div>
						<div className={styles.actions}>
							{preferences && <SettingsToggle preferences={preferences} label="Email" toggleHandler={handleNotificationToggle} settingType="emailNotifications" isUpdating={isUpdating} />}
						</div>
					</div>

					<Separator />

					{/* In-App Notifications */}
					{preferences && <SettingsToggle preferences={preferences} label="In-App" toggleHandler={handleNotificationToggle} settingType="inAppNotifications" isUpdating={isUpdating} />}

					<div className={styles.emailNotificationsContainer}>
						<div className={styles.notificationRow}>
							<div className={styles.notificationDetails}>
								<div className={styles.notificationTitle}>
									<Smartphone className={styles.notificationTitleIcon} />
									<h3 className="font-medium">In-App Notifications</h3>
								</div>
								<p className={styles.notificationDescription}>Show notifications within the app when new episodes are ready.</p>
							</div>
							<div className={styles.notificationActions}>
								{preferences && <SettingsToggle preferences={preferences} label="In-App" toggleHandler={handleNotificationToggle} settingType="inAppNotifications" isUpdating={isUpdating} />}
							</div>
						</div>
					</div>

					{/* Save Button */}
					{<SubmitBtn isUpdating={isUpdating} handleSaveAll={handleSaveAll} />}
				</CardContent>
			</Card>

			{/* Notification Status */}
			{preferences && (
				<Card>
					<CardHeader>
						<CardTitle className="cardTitle">Current Settings</CardTitle>
					</CardHeader>
					<CardContent>
						<div className={styles.currentSettingsContent}>
							<SettingsToggle preferences={preferences} label="Email" settingType="emailNotifications" toggleHandler={handleNotificationToggle} />
							<SettingsToggle preferences={preferences} label="In-App" settingType="inAppNotifications" toggleHandler={handleNotificationToggle} />
							{<DateIndicator indicator={preferences.updatedAt} label="Last updated" />}
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
		<div className={styles.currentFlexRow}>
			<span>{label} Notifications</span>
			<span className={styles.currentSettingStatus}>{preferences[settingType] ? <CheckIcon className={styles.currentSettingStatusIcon} /> : <X className={styles.currentSettingStatusIcon} />}</span>
			{toggleHandler && (
				<Button onClick={toggleHandler} disabled={isUpdating} className={styles.currentSettingButton}>
					{isUpdating ? <Loader2 className={styles.currentSettingButtonIcon} /> : null}
				</Button>
			)}
		</div>
	)
}

export { SettingsToggle }
