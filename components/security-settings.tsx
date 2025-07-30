"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Shield, Lock, Smartphone, Trash2, AlertTriangle, Check, X, Loader2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useSecurityStore } from "@/lib/stores/security-store"

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
		if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
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

		const result = securityInfo.twoFactorEnabled
			? await disableTwoFactor()
			: await enableTwoFactor()

		if ("success" in result) {
			toast.success(
				securityInfo.twoFactorEnabled
					? "Two-factor authentication disabled"
					: "Two-factor authentication enabled"
			)
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
						<Shield className="h-5 w-5" />
						Security Settings
					</CardTitle>
					<CardDescription>
						Manage your account security and privacy settings.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Account Security */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Account Security</h3>

						{/* Password Change */}
						<div className="flex items-center justify-between p-4 border rounded-lg">
							<div className="flex items-center gap-3">
								<Lock className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="font-medium">Change Password</p>
									<p className="text-sm text-muted-foreground">
										Last changed: {securityInfo?.lastPasswordChange
											? new Date(securityInfo.lastPasswordChange).toLocaleDateString()
											: "Unknown"}
									</p>
								</div>
							</div>
							<Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
								<DialogTrigger asChild>
									<Button variant="outline" size="sm">
										Change
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-md">
									<DialogHeader>
										<DialogTitle>Change Password</DialogTitle>
										<DialogDescription>
											Enter your current password and choose a new one.
										</DialogDescription>
									</DialogHeader>
									<div className="space-y-4">
										<div className="space-y-2">
											<Label htmlFor="current-password">Current Password</Label>
											<div className="relative">
												<Input
													id="current-password"
													type={showPasswords.current ? "text" : "password"}
													value={passwordForm.currentPassword}
													onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
													placeholder="Enter current password"
												/>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
													onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
												>
													{showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
												</Button>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="new-password">New Password</Label>
											<div className="relative">
												<Input
													id="new-password"
													type={showPasswords.new ? "text" : "password"}
													value={passwordForm.newPassword}
													onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
													placeholder="Enter new password"
												/>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
													onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
												>
													{showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
												</Button>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="confirm-password">Confirm New Password</Label>
											<div className="relative">
												<Input
													id="confirm-password"
													type={showPasswords.confirm ? "text" : "password"}
													value={passwordForm.confirmPassword}
													onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
													placeholder="Confirm new password"
												/>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
													onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
												>
													{showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
												</Button>
											</div>
										</div>
									</div>
									<DialogFooter>
										<Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
											Cancel
										</Button>
										<Button onClick={handlePasswordUpdate}>
											Update Password
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>

						{/* Two-Factor Authentication */}
						<div className="flex items-center justify-between p-4 border rounded-lg">
							<div className="flex items-center gap-3">
								<Smartphone className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="font-medium">Two-Factor Authentication</p>
									<p className="text-sm text-muted-foreground">
										Add an extra layer of security to your account
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={handleTwoFactorToggle}
									disabled={isLoading}
								>
									{securityInfo?.twoFactorEnabled ? "Disable" : "Enable"}
								</Button>
								{securityInfo?.twoFactorEnabled ? (
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

						{/* Session Management */}
						<div className="flex items-center justify-between p-4 border rounded-lg">
							<div className="flex items-center gap-3">
								<Shield className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="font-medium">Active Sessions</p>
									<p className="text-sm text-muted-foreground">
										{securityInfo?.activeSessions || 0} active session(s)
									</p>
								</div>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={handleRevokeSessions}
								disabled={isLoading || (securityInfo?.activeSessions || 0) <= 1}
							>
								Revoke All
							</Button>
						</div>
					</div>

					<Separator />

					{/* Account Status */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Account Status</h3>
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<p className="text-sm font-medium">Email Verification</p>
								<p className="text-sm text-muted-foreground">
									{securityInfo?.emailVerified ? (
										<span className="flex items-center gap-1 text-green-600">
											<Check className="h-3 w-3" />
											Verified
										</span>
									) : (
										<span className="flex items-center gap-1 text-red-600">
											<X className="h-3 w-3" />
											Not Verified
										</span>
									)}
								</p>
							</div>
							<div className="space-y-2">
								<p className="text-sm font-medium">Account Created</p>
								<p className="text-sm text-muted-foreground">
									{securityInfo?.createdAt
										? new Date(securityInfo.createdAt).toLocaleDateString()
										: "Unknown"}
								</p>
							</div>
						</div>
					</div>

					<Separator />

					{/* Danger Zone */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Danger Zone</h3>
						<div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium text-destructive">Delete Account</p>
									<p className="text-sm text-muted-foreground">
										Permanently delete your account and all data. This action cannot be undone.
									</p>
								</div>
								<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
									<DialogTrigger asChild>
										<Button variant="destructive" size="sm">
											<Trash2 className="h-4 w-4 mr-1" />
											Delete Account
										</Button>
									</DialogTrigger>
									<DialogContent className="sm:max-w-md">
										<DialogHeader>
											<DialogTitle className="flex items-center gap-2">
												<AlertTriangle className="h-5 w-5 text-destructive" />
												Delete Account
											</DialogTitle>
											<DialogDescription>
												This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
											</DialogDescription>
										</DialogHeader>
										<div className="space-y-4">
											<div className="space-y-2">
												<Label htmlFor="delete-reason">Reason for deletion (optional)</Label>
												<Input
													id="delete-reason"
													value={deleteReason}
													onChange={(e) => setDeleteReason(e.target.value)}
													placeholder="Tell us why you're leaving..."
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="delete-confirmation">
													Type <code className="bg-muted px-1 rounded">DELETE_MY_ACCOUNT</code> to confirm
												</Label>
												<Input
													id="delete-confirmation"
													value={deleteConfirmation}
													onChange={(e) => setDeleteConfirmation(e.target.value)}
													placeholder="DELETE_MY_ACCOUNT"
													className="font-mono"
												/>
											</div>
										</div>
										<DialogFooter>
											<Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
												Cancel
											</Button>
											<Button
												variant="destructive"
												onClick={handleDeleteAccount}
											>
												<Trash2 className="h-4 w-4 mr-1" />
												Delete Account
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
