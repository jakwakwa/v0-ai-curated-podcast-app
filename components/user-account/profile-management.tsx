"use client"

import { Camera, Edit3, Loader2, Save, Upload, User, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useProfileStore } from "@/lib/stores/profile-store"
import styles from "./profile-management.module.css"

interface ProfileManagementProps {
	className?: string
}

export function ProfileManagement({ className }: ProfileManagementProps) {
	const { profile, isLoading, loadProfile, updateProfile, uploadAvatar, removeAvatar } = useProfileStore()
	const [isEditing, setIsEditing] = useState(false)
	const [editForm, setEditForm] = useState({ name: "", email: "" })
	const fileInputRef = useRef<HTMLInputElement>(null)

	// Initialize form when profile loads
	useEffect(() => {
		if (profile && !isEditing) {
			setEditForm({
				name: profile.name || "",
				email: profile.email || "",
			})
		}
	}, [profile, isEditing])

	// Load profile on mount
	useEffect(() => {
		loadProfile()
	}, [loadProfile])

	// Handle form input changes
	const handleInputChange = (field: "name" | "email", value: string) => {
		setEditForm(prev => ({ ...prev, [field]: value }))
	}

	// Handle profile update
	const handleUpdateProfile = async () => {
		if (!(editForm.name.trim() && editForm.email.trim())) {
			toast.error("Name and email are required")
			return
		}

		const result = await updateProfile({
			name: editForm.name.trim(),
			email: editForm.email.trim(),
		})

		if ("success" in result) {
			toast.success("Profile updated successfully")
			setIsEditing(false)
		} else {
			toast.error(`Failed to update profile: ${result.error}`)
		}
	}

	// Handle avatar upload
	const handleAvatarUpload = async (file: File) => {
		const result = await uploadAvatar(file)

		if ("success" in result) {
			toast.success("Avatar updated successfully")
		} else {
			toast.error(`Failed to upload avatar: ${result.error}`)
		}
	}

	// Handle avatar removal
	const handleRemoveAvatar = async () => {
		const result = await removeAvatar()

		if ("success" in result) {
			toast.success("Avatar removed successfully")
		} else {
			toast.error(`Failed to remove avatar: ${result.error}`)
		}
	}

	// Handle file input change
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			handleAvatarUpload(file)
		}
	}

	// Get user initials for avatar fallback
	const getUserInitials = (name: string) => {
		return name
			.split(" ")
			.map(n => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2)
	}

	if (isLoading && !profile) {
		return (
			<Card className={className}>
				<CardContent className={styles.loadingContent}>
					<Loader2 className="spinner" />
				</CardContent>
			</Card>
		)
	}

	return (
		<div className={className}>
			<Card>
				<CardHeader>
					<CardTitle className={styles.cardTitle}>
						<User className={styles.cardTitleIcon} />
						Profile Information
					</CardTitle>
					<CardDescription>Manage your personal information and account details.</CardDescription>
				</CardHeader>
				<CardContent className={styles.cardContentSpaceY6}>
					{/* Avatar Section */}
					<div className={styles.avatarSection}>
						<div className={styles.avatarContainer}>
							<Avatar className={styles.avatarSize}>
								<AvatarImage src={profile?.avatar || ""} alt={profile?.name} />
								<AvatarFallback className={styles.avatarFallbackText}>{profile?.name ? getUserInitials(profile.name) : "U"}</AvatarFallback>
							</Avatar>

							{/* Avatar Upload Button */}
							<Button size="sm" variant="outline" className={styles.avatarUploadButton} onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
								<Camera className={styles.avatarUploadButtonIcon} />
							</Button>

							{/* Hidden file input */}
							<input ref={fileInputRef} type="file" accept="image/*" className={styles.hiddenInput} onChange={handleFileChange} />
						</div>

						<div className={styles.profileDetails}>
							<h3 className={styles.profileName}>{profile?.name || "User"}</h3>
							<p className={styles.profileEmail}>{profile?.email}</p>
							<div className={styles.profileActions}>
								<Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
									<Upload className={styles.profileActionButtonIcon} />
									Upload Photo
								</Button>
								{profile?.avatar && (
									<Button size="sm" variant="outline" onClick={handleRemoveAvatar} disabled={isLoading}>
										<X className={styles.profileActionButtonIcon} />
										Remove
									</Button>
								)}
							</div>
						</div>
					</div>

					<Separator />

					{/* Profile Information */}
					<div className={styles.profileInfoSection}>
						<div className={styles.profileInfoSectionHeader}>
							<h3 className={styles.profileInfoTitle}>Personal Information</h3>
							<Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} disabled={isLoading}>
								{isEditing ? (
									<>
										<X className={styles.profileActionButtonIcon} />
										Cancel
									</>
								) : (
									<>
										<Edit3 className={styles.profileActionButtonIcon} />
										Edit
									</>
								)}
							</Button>
						</div>

						{isEditing ? (
							/* Edit Form */
							<div className={styles.editForm}>
								<div className={styles.formGroup}>
									<Label htmlFor="name">Full Name</Label>
									<Input id="name" value={editForm.name} onChange={e => handleInputChange("name", e.target.value)} placeholder="Enter your full name" />
								</div>

								<div className={styles.formGroup}>
									<Label htmlFor="email">Email Address</Label>
									<Input id="email" type="email" value={editForm.email} onChange={e => handleInputChange("email", e.target.value)} placeholder="Enter your email address" />
								</div>

								<div className={styles.formActions}>
									<Button variant="default" onClick={handleUpdateProfile} disabled={isLoading}>
										{isLoading ? <Loader2 className={`${styles.formButtonIcon} ${styles.formButtonIconSpin}`} /> : <Save className={styles.formButtonIcon} />}
										Save Changes
									</Button>
									<Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
										Cancel
									</Button>
								</div>
							</div>
						) : (
							/* Display Information */
							<div className={styles.displayInfoGrid}>
								<div className={styles.displayInfoGroup}>
									<p className={styles.displayInfoLabel}>Full Name</p>
									<p className={styles.displayInfoValue}>{profile?.name || "Not set"}</p>
								</div>
								<div className={styles.displayInfoGroup}>
									<p className={styles.displayInfoLabel}>Email Address</p>
									<p className={styles.displayInfoValue}>{profile?.email || "Not set"}</p>
								</div>
								<div className={styles.displayInfoGroup}>
									<p className={styles.displayInfoLabel}>Member Since</p>
									<p className={styles.displayInfoValue}>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Unknown"}</p>
								</div>
								<div className={styles.displayInfoGroup}>
									<p className={styles.displayInfoLabel}>Last Updated</p>
									<p className={styles.displayInfoValue}>{profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : "Unknown"}</p>
								</div>
							</div>
						)}
					</div>

					<Separator />

					{/* Account Status */}
					<div className={styles.accountStatusSection}>
						<h3 className={styles.accountStatusTitle}>Account Status</h3>
						<div className={styles.accountStatusDetails}>
							<Badge variant="default">Active</Badge>
							<span className={styles.accountStatusText}>Your account is active and in good standing</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
