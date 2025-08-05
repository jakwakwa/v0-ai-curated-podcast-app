"use client"

import { Camera, Edit3, Loader2, Save, User, X } from "lucide-react"
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
						<User className="h-5 w-5" />
						Profile Information
					</CardTitle>
					<CardDescription>Manage your personal information and account details.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Avatar Section */}
					<div className="flex items-center gap-6">
						<div className="relative">
							<Avatar className="h-30 w-30 bg-[#176a888f]">
								<AvatarImage src={profile?.avatar || null} alt={profile?.name} />
								<AvatarFallback className="text-lg">{profile?.name ? getUserInitials(profile.name) : "U"}</AvatarFallback>
							</Avatar>

							{/* Avatar Upload Button */}
							<Button
								size="sm"
								variant="default"
								className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full p-0 bg-cardglass border-2 border-[var(--color-border)] z-60"
								onClick={() => fileInputRef.current?.click()}
								disabled={isLoading}
							>
								<Camera className="h-4 w-4" />
							</Button>

							{/* Hidden file input */}
							<Input ref={fileInputRef} type="file" accept="image/*" className="hidden bg-transparent z-50  opacity-0 absolute bottom-0 right-0" onChange={handleFileChange} />
						</div>

						<div className="flex-1">
							<h3 className="font-medium">{profile?.name || "User"}</h3>
							<p className="text-sm text-muted-foreground">{profile?.email}</p>
							<div className="flex gap-2 mt-2">
								{profile?.avatar && (
									<Button size="sm" variant="outline" onClick={handleRemoveAvatar} disabled={isLoading}>
										<X className="h-4 w-4 mr-1" />
										Remove
									</Button>
								)}
							</div>
						</div>
					</div>

					<Separator />

					{/* Profile Information */}
					<Card className="space-y-4 p-4 bg-cardglass">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">Personal Information</h3>
							<Button variant="default" size="sm" onClick={() => setIsEditing(!isEditing)} disabled={isLoading}>
								{isEditing ? (
									<>
										<X className="h-4 w-4 mr-1" />
										Cancel
									</>
								) : (
									<>
										<Edit3 className="h-4 w-4 mr-1" />
										Edit
									</>
								)}
							</Button>
						</div>

						{isEditing ? (
							/* Edit Form */
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name">Full Name</Label>
									<Input id="name" value={editForm.name} onChange={e => handleInputChange("name", e.target.value)} placeholder="Enter your full name" />
								</div>

								<div className="space-y-2">
									<Label htmlFor="email">Email Address</Label>
									<Input id="email" type="email" value={editForm.email} onChange={e => handleInputChange("email", e.target.value)} placeholder="Enter your email address" />
								</div>

								<div className="flex gap-2">
									<Button variant="default" onClick={handleUpdateProfile} disabled={isLoading}>
										{isLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
										Save Changes
									</Button>
									<Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
										Cancel
									</Button>
								</div>
							</div>
						) : (
							/* Display Information */
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<p className="text-sm font-medium">Full Name</p>
									<p className="text-sm text-muted-foreground">{profile?.name || "Not set"}</p>
								</div>
								<div className="space-y-2">
									<p className="text-sm font-medium">Email Address</p>
									<p className="text-sm text-muted-foreground">{profile?.email || "Not set"}</p>
								</div>
								<div className="space-y-2">
									<p className="text-sm font-medium">Member Since</p>
									<p className="text-sm text-muted-foreground">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Unknown"}</p>
								</div>
								<div className="space-y-2">
									<p className="text-sm font-medium">Last Updated</p>
									<p className="text-sm text-muted-foreground">{profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : "Unknown"}</p>
								</div>
							</div>
						)}
					</Card>

					<Separator />

					{/* Account Status */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Account Status</h3>
						<div className="flex items-center gap-2">
							<Badge variant="default" size="sm">
								Active
							</Badge>
							<span className="text-sm text-muted-foreground">Your account is active and in good standing</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
