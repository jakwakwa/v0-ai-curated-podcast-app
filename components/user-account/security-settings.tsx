"use client"

import { AlertTriangle, Check, Eye, EyeOff, Loader2, Lock, Shield, Smartphone, Trash2, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useSecurityStore } from "@/lib/stores/security-store"
import styles from "./security-settings.module.css"

interface SecuritySettingsProps {
	className?: string
}

export function SecuritySettings({ className }: SecuritySettingsProps) {
	const { securityInfo, isLoading, loadSecurityInfo, updatePassword, enableTwoFactor, disableTwoFactor, revokeAllSessions, deleteAccount } = useSecurityStore()
	const [showPasswordDialog, setShowPasswordDialog] = useState(false)
	const [showDeleteDialog, setShowDeleteDialog] = useState(false)
	const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
	const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false })
	const [deleteConfirmation, setDeleteConfirmation] = useState("")
	const [deleteReason, setDeleteReason] = useState("")

	// Load security info on mount
	useEffect(() => {
		loadSecurityInfo()
	}, [loadSecurityInfo])

	// Handle password form changes
	const handlePasswordChange = (field: keyof typeof passwordForm, value: string) => {
		setPasswordForm(prev => ({ ...prev, [field]: value }))
	}

	// Handle password update
	const handlePasswordUpdate = async () => {
		if (!(passwordForm.currentPassword && passwordForm.newPassword && passwordForm.confirmPassword)) {
			toast.error("All password fields are required")
			return
		}

		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			toast.error("New passwords do not match")
			return
		}

		if (passwordForm.newPassword.length < 8) {
			toast.error("New password must be at least 8 characters long")
			return
		}

		const result = await updatePassword(passwordForm.currentPassword, passwordForm.newPassword)

		if ("success" in result) {
			toast.success("Password updated successfully")
			setShowPasswordDialog(false)
			setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
		} else {
			toast.error(`Failed to update password: ${result.error}`)
		}
	}

	// Handle 2FA toggle
	const handleTwoFactorToggle = async () => {
		if (!securityInfo) return

		const result = securityInfo.twoFactorEnabled ? await disableTwoFactor() : await enableTwoFactor()

		if ("success" in result) {
			toast.success(securityInfo.twoFactorEnabled ? "Two-factor authentication disabled" : "Two-factor authentication enabled")
		} else {
			toast.error(`Failed to update two-factor authentication: ${result.error}`)
		}
	}

	// Handle session revocation
	const handleRevokeSessions = async () => {
		const result = await revokeAllSessions()

		if ("success" in result) {
			toast.success("All sessions revoked successfully")
		} else {
			toast.error(`Failed to revoke sessions: ${result.error}`)
		}
	}

	// Handle account deletion
	const handleDeleteAccount = async () => {
		if (deleteConfirmation !== "DELETE_MY_ACCOUNT") {
			toast.error("Please type the confirmation text exactly")
			return
		}

		const result = await deleteAccount(deleteConfirmation, deleteReason)

		if ("success" in result) {
			toast.success("Account deleted successfully")
			setShowDeleteDialog(false)
			setDeleteConfirmation("")
			setDeleteReason("")
			// In a real app, you would redirect to logout or home page
		} else {
			toast.error(`Failed to delete account: ${result.error}`)
		}
	}

	if (isLoading && !securityInfo) {
		return (
			<Card className={className}>
				<CardContent className={styles.loadingContent}>
					<Loader2 className={styles.iconMuted} />
				</CardContent>
			</Card>
		)
	}

	return (
		<div className={className}>
			<Card>
				<CardHeader>
					<CardTitle className={styles.cardTitle}>
						<Shield className={styles.iconMuted} />
						Security Settings
					</CardTitle>
					<CardDescription>Manage your account security and privacy settings.</CardDescription>
				</CardHeader>
				<CardContent className={styles.cardContentSpaceY6}>
					{/* Account Security */}
					<div className={styles.sectionSpaceY4}>
						<h3 className={styles.textLgSemibold}>Account Security</h3>

						{/* Password Change */}
						<div className={`${styles.flexBetween} ${styles.planBox}`}>
							<div className={styles.flexRow}>
								<Lock className={styles.iconMuted} />
								<div>
									<p className={styles.fontMedium}>Change Password</p>
									<p className={styles.textSmMuted}>Last changed: {securityInfo?.lastPasswordChange ? new Date(securityInfo.lastPasswordChange).toLocaleDateString() : "Unknown"}</p>
								</div>
							</div>
							<Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
								<DialogTrigger asChild>
									<Button variant="outline" size="sm">
										Change
									</Button>
								</DialogTrigger>
								<DialogContent className={styles.maxWmd}>
									<DialogHeader>
										<DialogTitle>Change Password</DialogTitle>
										<DialogDescription>Enter your current password and choose a new one.</DialogDescription>
									</DialogHeader>
									<div className={styles.sectionSpaceY4}>
										<div className={styles.sectionSpaceY2}>
											<Label htmlFor="current-password">Current Password</Label>
											<div className="relative">
												<Input
													id="current-password"
													type={showPasswords.current ? "text" : "password"}
													value={passwordForm.currentPassword}
													onChange={e => handlePasswordChange("currentPassword", e.target.value)}
													placeholder="Enter current password"
												/>
												<Button type="button" variant="ghost" size="sm" className={styles.absoluteBtn} onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}>
													{showPasswords.current ? <EyeOff className={styles.iconSmall} /> : <Eye className={styles.iconSmall} />}
												</Button>
											</div>
										</div>

										<div className={styles.sectionSpaceY2}>
											<Label htmlFor="new-password">New Password</Label>
											<div className="relative">
												<Input
													id="new-password"
													type={showPasswords.new ? "text" : "password"}
													value={passwordForm.newPassword}
													onChange={e => handlePasswordChange("newPassword", e.target.value)}
													placeholder="Enter new password"
												/>
												<Button type="button" variant="ghost" size="sm" className={styles.absoluteBtn} onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}>
													{showPasswords.new ? <EyeOff className={styles.iconSmall} /> : <Eye className={styles.iconSmall} />}
												</Button>
											</div>
										</div>

										<div className={styles.sectionSpaceY2}>
											<Label htmlFor="confirm-password">Confirm New Password</Label>
											<div className="relative">
												<Input
													id="confirm-password"
													type={showPasswords.confirm ? "text" : "password"}
													value={passwordForm.confirmPassword}
													onChange={e => handlePasswordChange("confirmPassword", e.target.value)}
													placeholder="Confirm new password"
												/>
												<Button type="button" variant="ghost" size="sm" className={styles.absoluteBtn} onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}>
													{showPasswords.confirm ? <EyeOff className={styles.iconSmall} /> : <Eye className={styles.iconSmall} />}
												</Button>
											</div>
										</div>
									</div>
									<DialogFooter>
										<Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
											Cancel
										</Button>
										<Button onClick={handlePasswordUpdate}>Update Password</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>

						{/* Two-Factor Authentication */}
						<div className={`${styles.flexBetween} ${styles.planBox}`}>
							<div className={styles.flexRow}>
								<Smartphone className={styles.iconMuted} />
								<div>
									<p className={styles.fontMedium}>Two-Factor Authentication</p>
									<p className={styles.textSmMuted}>Add an extra layer of security to your account</p>
								</div>
							</div>
							<div className={styles.flexRow}>
								<Button variant="outline" size="sm" onClick={handleTwoFactorToggle} disabled={isLoading}>
									{securityInfo?.twoFactorEnabled ? "Disable" : "Enable"}
								</Button>
								{securityInfo?.twoFactorEnabled ? (
									<Badge variant="default" className={styles.badgeGreen}>
										<Check className={`${styles.iconSmall} ${styles.mr1}`} />
										Enabled
									</Badge>
								) : (
									<Badge variant="secondary">
										<X className={`${styles.iconSmall} ${styles.mr1}`} />
										Disabled
									</Badge>
								)}
							</div>
						</div>

						{/* Session Management */}
						<div className={`${styles.flexBetween} ${styles.planBox}`}>
							<div className={styles.flexRow}>
								<Shield className={styles.iconMuted} />
								<div>
									<p className={styles.fontMedium}>Active Sessions</p>
									<p className={styles.textSmMuted}>{securityInfo?.activeSessions || 0} active session(s)</p>
								</div>
							</div>
							<Button variant="outline" size="sm" onClick={handleRevokeSessions} disabled={isLoading || (securityInfo?.activeSessions || 0) <= 1}>
								Revoke All
							</Button>
						</div>
					</div>

					<Separator />

					{/* Account Status */}
					<div className={styles.sectionSpaceY4}>
						<h3 className={styles.textLgSemibold}>Account Status</h3>
						<div className={styles.grid2}>
							<div className={styles.sectionSpaceY2}>
								<p className={styles.textSmMediumMuted}>Email Verification</p>
								<p className={styles.textSmMuted}>
									{securityInfo?.emailVerified ? (
										<span className={styles.flexGap1Green}>
											<Check className={styles.iconSmall} />
											Verified
										</span>
									) : (
										<span className={styles.flexGap1Red}>
											<X className={styles.iconSmall} />
											Not Verified
										</span>
									)}
								</p>
							</div>
							<div className={styles.sectionSpaceY2}>
								<p className={styles.textSmMediumMuted}>Account Created</p>
								<p className={styles.textSmMuted}>{securityInfo?.createdAt ? new Date(securityInfo.createdAt).toLocaleDateString() : "Unknown"}</p>
							</div>
						</div>
					</div>

					<Separator />

					{/* Danger Zone */}
					<div className={styles.dangerZone}>
						<div className={styles.flexBetween}>
							<div>
								<p className={`${styles.fontMedium} ${styles.textDestructive}`}>Delete Account</p>
								<p className={styles.textSmMuted}>Permanently delete your account and all data. This action cannot be undone.</p>
							</div>
							<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
								<DialogTrigger asChild>
									<Button variant="destructive" size="sm">
										<Trash2 className={`${styles.iconSmall} ${styles.mr1}`} />
										Delete Account
									</Button>
								</DialogTrigger>
								<DialogContent className={styles.maxWmd}>
									<DialogHeader>
										<DialogTitle className={styles.cardTitle}>
											<AlertTriangle className={`${styles.iconMuted} ${styles.textDestructive}`} />
											Delete Account
										</DialogTitle>
										<DialogDescription>This action cannot be undone. This will permanently delete your account and remove all your data from our servers.</DialogDescription>
									</DialogHeader>
									<div className={styles.sectionSpaceY4}>
										<div className={styles.sectionSpaceY2}>
											<Label htmlFor="delete-reason">Reason for deletion (optional)</Label>
											<Input id="delete-reason" value={deleteReason} onChange={e => setDeleteReason(e.target.value)} placeholder="Tell us why you're leaving..." />
										</div>
										<div className={styles.sectionSpaceY2}>
											<Label htmlFor="delete-confirmation">
												Type <code className={styles.fontMono}>DELETE_MY_ACCOUNT</code> to confirm
											</Label>
											<Input id="delete-confirmation" value={deleteConfirmation} onChange={e => setDeleteConfirmation(e.target.value)} placeholder="DELETE_MY_ACCOUNT" className={styles.fontMono} />
										</div>
									</div>
									<DialogFooter>
										<Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
											Cancel
										</Button>
										<Button variant="destructive" onClick={handleDeleteAccount}>
											<Trash2 className={`${styles.iconSmall} ${styles.mr1}`} />
											Delete Account
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
