"use client"

import { AlertTriangle, Check, Eye, EyeOff, Loader2, Lock, Shield, Smartphone, Trash2 } from "lucide-react"
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
	const [isPasswordUpdating, setIsPasswordUpdating] = useState(false)
	const [is2FAToggling, setIs2FAToggling] = useState(false)
	const [isSessionRevoking, setIsSessionRevoking] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)

	useEffect(() => {
		loadSecurityInfo()
	}, [loadSecurityInfo])

	const handlePasswordUpdate = async () => {
		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			toast.error("New passwords don't match")
			return
		}

		if (passwordForm.newPassword.length < 8) {
			toast.error("Password must be at least 8 characters long")
			return
		}

		setIsPasswordUpdating(true)
		const result = await updatePassword(passwordForm.currentPassword, passwordForm.newPassword)
		setIsPasswordUpdating(false)

		if ("success" in result && result.success) {
			toast.success("Password updated successfully")
			setShowPasswordDialog(false)
			setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
			setShowPasswords({ current: false, new: false, confirm: false })
		} else {
			toast.error(`Failed to update password: ${"error" in result ? result.error : "Unknown error"}`)
		}
	}

	const handleToggle2FA = async () => {
		setIs2FAToggling(true)
		const result = securityInfo?.twoFactorEnabled ? await disableTwoFactor() : await enableTwoFactor()
		setIs2FAToggling(false)

		if ("success" in result && result.success) {
			toast.success(`Two-factor authentication ${securityInfo?.twoFactorEnabled ? "disabled" : "enabled"} successfully`)
		} else {
			toast.error(`Failed to ${securityInfo?.twoFactorEnabled ? "disable" : "enable"} two-factor authentication: ${"error" in result ? result.error : "Unknown error"}`)
		}
	}

	const handleRevokeAllSessions = async () => {
		setIsSessionRevoking(true)
		const result = await revokeAllSessions()
		setIsSessionRevoking(false)

		if ("success" in result && result.success) {
			toast.success("All sessions revoked successfully")
		} else {
			toast.error(`Failed to revoke sessions: ${"error" in result ? result.error : "Unknown error"}`)
		}
	}

	const handleDeleteAccount = async () => {
		if (deleteConfirmation !== "DELETE") {
			toast.error('Please type "DELETE" to confirm account deletion')
			return
		}

		if (!deleteReason.trim()) {
			toast.error("Please provide a reason for account deletion")
			return
		}

		setIsDeleting(true)
		const result = await deleteAccount(deleteConfirmation, deleteReason)
		setIsDeleting(false)

		if ("success" in result && result.success) {
			toast.success("Account deleted successfully")
			setShowDeleteDialog(false)
			setDeleteConfirmation("")
			setDeleteReason("")
			// In a real app, you would redirect to logout or home page
		} else {
			toast.error(`Failed to delete account: ${"error" in result ? result.error : "Unknown error"}`)
		}
	}

	if (isLoading && !securityInfo) {
		return (
			<Card className={className}>
				<CardContent className="flex items-center justify-center py-8">
					<Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Shield className="h-5 w-5 text-muted-foreground" />
					Security Settings
				</CardTitle>
				<CardDescription>Manage your account security and privacy settings.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Password Section */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold">Password</h3>
					<div className="flex items-center justify-between p-4 border border-muted-foreground/20 rounded-lg bg-card">
						<div className="flex items-center gap-3">
							<Lock className="h-5 w-5 text-muted-foreground" />
							<div>
								<p className="font-medium">Password</p>
								<p className="text-sm text-muted-foreground">Last updated {securityInfo?.lastPasswordChange ? new Date(securityInfo.lastPasswordChange).toLocaleDateString() : "Never"}</p>
							</div>
						</div>
						<Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
							<DialogTrigger asChild>
								<Button variant="outline" size="sm">
									Change Password
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-md">
								<DialogHeader>
									<DialogTitle className="flex items-center gap-2">
										<Lock className="h-5 w-5 text-destructive" />
										Change Password
									</DialogTitle>
									<DialogDescription>Enter your current password and choose a new one.</DialogDescription>
								</DialogHeader>
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="current-password">Current Password</Label>
										<div className="relative">
											<Input
												id="current-password"
												type={showPasswords.current ? "text" : "password"}
												value={passwordForm.currentPassword}
												onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
												className="pr-10"
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute right-0 top-0 h-full px-3 py-2"
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
												onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
												className="pr-10"
											/>
											<Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2" onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}>
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
												onChange={e => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
												className="pr-10"
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute right-0 top-0 h-full px-3 py-2"
												onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
											>
												{showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
											</Button>
										</div>
									</div>
								</div>
								<DialogFooter className="flex gap-2">
									<Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
										Cancel
									</Button>
									<Button variant="default" onClick={handlePasswordUpdate} disabled={isPasswordUpdating} className="bg-primary text-primary-foreground">
										{isPasswordUpdating && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
										Update Password
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</div>

				<Separator />

				{/* Two-Factor Authentication Section */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
					<div className="flex items-center justify-between p-4 border border-muted-foreground/20 rounded-lg bg-background">
						<div className="flex items-center gap-3">
							<Smartphone className="h-5 w-5 text-muted-foreground" />
							<div>
								<p className="font-medium">Authenticator App</p>
								<div className="flex items-center gap-2 mt-1">
									{securityInfo?.twoFactorEnabled ? (
										<>
											<Badge variant="default" size="sm" className="bg-green-100 text-green-700">
												<Check className="h-3 w-3 mr-1" />
												Enabled
											</Badge>
											<p className="text-sm text-muted-foreground">Your account is protected</p>
										</>
									) : (
										<>
											<Badge variant="outline" size="sm">
												Disabled
											</Badge>
											<p className="text-sm text-muted-foreground">Add an extra layer of security</p>
										</>
									)}
								</div>
							</div>
						</div>
						<Button variant={securityInfo?.twoFactorEnabled ? "destructive" : "default"} size="sm" onClick={handleToggle2FA} disabled={is2FAToggling}>
							{is2FAToggling && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
							{securityInfo?.twoFactorEnabled ? "Disable" : "Enable"}
						</Button>
					</div>
				</div>

				<Separator />

				{/* Active Sessions Section */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold">Active Sessions</h3>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">Current Session</p>
							<div className="flex items-center gap-1 text-green-600">
								<div className="w-2 h-2 bg-green-600 rounded-full"></div>
								<span className="text-sm">This device</span>
							</div>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">Other Sessions</p>
							<p className="text-sm">{securityInfo?.activeSessions || 0} active sessions</p>
						</div>
					</div>
					<Button variant="outline" size="sm" onClick={handleRevokeAllSessions} disabled={isSessionRevoking}>
						{isSessionRevoking && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
						Revoke All Other Sessions
					</Button>
				</div>

				<Separator />

				{/* Account Status Section */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold">Account Status</h3>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">Email Verification</p>
							<div className="flex items-center gap-1 text-green-600">
								<Check className="w-3 h-3" />
								<span className="text-sm">{securityInfo?.emailVerified ? "Verified" : "Not Verified"}</span>
							</div>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">Account Created</p>
							<p className="text-sm text-muted-foreground">{securityInfo?.createdAt ? new Date(securityInfo.createdAt).toLocaleDateString() : "Unknown"}</p>
						</div>
					</div>
				</div>

				<Separator />

				{/* Danger Zone */}
				<div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
					<h3 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h3>
					<div className="space-y-4">
						<div>
							<h4 className="font-medium text-destructive">Delete Account</h4>
							<p className="text-sm text-muted-foreground mt-1">Permanently delete your account and all associated data. This action cannot be undone.</p>
							<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
								<DialogTrigger asChild>
									<Button variant="destructive" size="sm" className="mt-3">
										<Trash2 className="h-4 w-4 mr-1" />
										Delete Account
									</Button>
								</DialogTrigger>
								<DialogContent className="max-w-md">
									<DialogHeader>
										<DialogTitle className="flex items-center gap-2">
											<AlertTriangle className="h-5 w-5 text-destructive" />
											Delete Account
										</DialogTitle>
										<DialogDescription>This action cannot be undone. This will permanently delete your account and remove all associated data.</DialogDescription>
									</DialogHeader>
									<div className="space-y-4">
										<div className="space-y-2">
											<Label htmlFor="delete-reason">Reason for deletion</Label>
											<Input id="delete-reason" value={deleteReason} onChange={e => setDeleteReason(e.target.value)} placeholder="Tell us why you're leaving..." />
										</div>
										<div className="space-y-2">
											<Label htmlFor="delete-confirmation">
												Type <span className="font-mono">DELETE</span> to confirm
											</Label>
											<Input id="delete-confirmation" value={deleteConfirmation} onChange={e => setDeleteConfirmation(e.target.value)} placeholder="DELETE" />
										</div>
									</div>
									<DialogFooter className="flex gap-2">
										<Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
											Cancel
										</Button>
										<Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting || deleteConfirmation !== "DELETE"}>
											{isDeleting && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
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
	)
}
