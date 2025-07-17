import type { UserCurationProfile as UserCurationProfileType } from "@/lib/types"
import { toast } from "sonner"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UserCurationProfileStore {
	userCurationProfile: UserCurationProfileType | null
	// UserCurationProfile actions
	setUserCurationProfile: (userCurationProfile: UserCurationProfileType | null) => void
	createUserCurationProfile: (data: {
		name: string
		isBundleSelection: boolean
		selectedBundleId?: string
		selectedPodcasts?: string[]
	}) => Promise<void>
	updateUserCurationProfile: (data: Partial<UserCurationProfileType>) => Promise<void>
	deactivateUserCurationProfile: () => Promise<void>
	// Loading and error states
	isLoading: boolean
	error: string | null
}

export const useUserCurationProfileStore = create<UserCurationProfileStore>()(
	persist(
		(set, get) => ({
			userCurationProfile: null,
			isLoading: false,
			error: null,

			// UserCurationProfile actions
			setUserCurationProfile: userCurationProfile => {
				set({ userCurationProfile }, false)
			},

			createUserCurationProfile: async data => {
				set({ isLoading: true, error: null }, false)

				try {
					const response = await fetch("/api/user-curation-profiles", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(data),
					})

					if (!response.ok) {
						const errorData = await response.json()
						throw new Error(errorData.message || "Failed to create user curation profile")
					}

					const userCurationProfile = await response.json()
					set({ userCurationProfile, isLoading: false })
					toast.success("User Curation Profile created successfully!")
				} catch (error: unknown) {
					const message = error instanceof Error ? error.message : String(error)
					set({ error: message, isLoading: false })
					toast.error(message || "Error creating user curation profile")
				}
			},

			updateUserCurationProfile: async data => {
				set({ isLoading: true, error: null }, false)

				if (!data.id) {
					set({ error: "User Curation Profile ID is required for update", isLoading: false }, false)
					toast.error("User Curation Profile ID is required for update")
					return
				}

				try {
					const response = await fetch(`/api/user-curation-profiles/${data.id}`, {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(data),
					})

					if (!response.ok) {
						const errorData = await response.json()
						throw new Error(errorData.message || "Failed to update user curation profile")
					}

					const updatedUserCurationProfile = await response.json()
					set({ userCurationProfile: updatedUserCurationProfile, isLoading: false })
					toast.success("User Curation Profile updated successfully!")
				} catch (error: unknown) {
					const message = error instanceof Error ? error.message : String(error)
					set({ error: message, isLoading: false })
					toast.error(message || "Error updating user curation profile")
				}
			},

			deactivateUserCurationProfile: async () => {
				set({ isLoading: true, error: null }, false)

				if (!get().userCurationProfile?.id) {
					set({ error: "No active user curation profile to deactivate", isLoading: false }, false)
					toast.error("No active user curation profile to deactivate")
					return
				}

				try {
					const response = await fetch(`/api/user-curation-profiles/${get().userCurationProfile!.id}`, {
						method: "DELETE",
					})

					if (!response.ok) {
						const errorData = await response.json()
						throw new Error(errorData.message || "Failed to deactivate user curation profile")
					}

					set({ userCurationProfile: null, isLoading: false })
					toast.success("User Curation Profile deactivated successfully.")
				} catch (error: unknown) {
					const message = error instanceof Error ? error.message : String(error)
					set({ error: message, isLoading: false })
					toast.error(message || "Error deactivating user curation profile")
				}
			},
		}),
		{
			name: "user-curation-profile-storage",
			storage: {
				getItem: name => {
					const item = localStorage.getItem(name)
					return item ? JSON.parse(item) : null
				},
				setItem: (name, value) => {
					localStorage.setItem(name, JSON.stringify(value))
				},
				removeItem: name => localStorage.removeItem(name),
			},
		}
	)
)
