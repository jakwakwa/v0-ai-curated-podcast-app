import { create } from "zustand"
import { devtools } from "zustand/middleware"

export interface SecurityInfo {
	emailVerified: boolean
	createdAt: Date
	updatedAt: Date
	lastPasswordChange: Date
	twoFactorEnabled: boolean
	activeSessions: number
}

export interface SecurityStore {
	// State
	securityInfo: SecurityInfo | null
	isLoading: boolean
	error: string | null

	// Actions
	loadSecurityInfo: () => Promise<void>
	updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean } | { error: string }>
	enableTwoFactor: () => Promise<{ success: boolean } | { error: string }>
	disableTwoFactor: () => Promise<{ success: boolean } | { error: string }>
	revokeAllSessions: () => Promise<{ success: boolean } | { error: string }>
	deleteAccount: (confirmation: string, reason?: string) => Promise<{ success: boolean } | { error: string }>

	// Utility actions
	setLoading: (loading: boolean) => void
	setError: (error: string | null) => void
	reset: () => void
}

// Mock security data for testing
const MOCK_SECURITY_INFO: SecurityInfo = {
	emailVerified: true,
	createdAt: new Date("2023-12-01"),
	updatedAt: new Date("2024-01-15"),
	lastPasswordChange: new Date("2024-01-10"),
	twoFactorEnabled: false,
	activeSessions: 2,
}

const initialState = {
	securityInfo: null,
	isLoading: false,
	error: null,
}

export const useSecurityStore = create<SecurityStore>()(
	devtools(
		(set, get) => ({
			...initialState,

			// Actions
			loadSecurityInfo: async () => {
				set({ isLoading: true, error: null }, false, "loadSecurityInfo:start")

				try {
					// For testing purposes, use mock data instead of API call
					// In production, this would be: const response = await fetch("/api/account/security")

					// Simulate API delay
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Use mock data for testing
					const securityInfo = MOCK_SECURITY_INFO
					set({ securityInfo, isLoading: false }, false, "loadSecurityInfo:success")
				} catch (error) {
					set(
						{
							error: error instanceof Error ? error.message : "Unknown error",
							isLoading: false,
						},
						false,
						"loadSecurityInfo:error"
					)
				}
			},

			updatePassword: async (currentPassword: string, newPassword: string) => {
				set({ isLoading: true, error: null }, false, "updatePassword:start")

				try {
					// For testing purposes, simulate API call
					await new Promise(resolve => setTimeout(resolve, 1500))

					// Mock successful password update
					const { securityInfo } = get()
					if (securityInfo) {
						set(
							{
								securityInfo: {
									...securityInfo,
									lastPasswordChange: new Date(),
								},
								isLoading: false,
							},
							false,
							"updatePassword:success"
						)
					}

					return { success: true }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : "Unknown error"
					set(
						{
							error: errorMessage,
							isLoading: false,
						},
						false,
						"updatePassword:error"
					)
					return { error: errorMessage }
				}
			},

			enableTwoFactor: async () => {
				set({ isLoading: true, error: null }, false, "enableTwoFactor:start")

				try {
					// For testing purposes, simulate API call
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Mock successful 2FA enable
					const { securityInfo } = get()
					if (securityInfo) {
						set(
							{
								securityInfo: {
									...securityInfo,
									twoFactorEnabled: true,
								},
								isLoading: false,
							},
							false,
							"enableTwoFactor:success"
						)
					}

					return { success: true }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : "Unknown error"
					set(
						{
							error: errorMessage,
							isLoading: false,
						},
						false,
						"enableTwoFactor:error"
					)
					return { error: errorMessage }
				}
			},

			disableTwoFactor: async () => {
				set({ isLoading: true, error: null }, false, "disableTwoFactor:start")

				try {
					// For testing purposes, simulate API call
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Mock successful 2FA disable
					const { securityInfo } = get()
					if (securityInfo) {
						set(
							{
								securityInfo: {
									...securityInfo,
									twoFactorEnabled: false,
								},
								isLoading: false,
							},
							false,
							"disableTwoFactor:success"
						)
					}

					return { success: true }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : "Unknown error"
					set(
						{
							error: errorMessage,
							isLoading: false,
						},
						false,
						"disableTwoFactor:error"
					)
					return { error: errorMessage }
				}
			},

			revokeAllSessions: async () => {
				set({ isLoading: true, error: null }, false, "revokeAllSessions:start")

				try {
					// For testing purposes, simulate API call
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Mock successful session revocation
					const { securityInfo } = get()
					if (securityInfo) {
						set(
							{
								securityInfo: {
									...securityInfo,
									activeSessions: 1, // Current session
								},
								isLoading: false,
							},
							false,
							"revokeAllSessions:success"
						)
					}

					return { success: true }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : "Unknown error"
					set(
						{
							error: errorMessage,
							isLoading: false,
						},
						false,
						"revokeAllSessions:error"
					)
					return { error: errorMessage }
				}
			},

			deleteAccount: async (confirmation: string, reason?: string) => {
				set({ isLoading: true, error: null }, false, "deleteAccount:start")

				try {
					// For testing purposes, simulate API call
					await new Promise(resolve => setTimeout(resolve, 2000))

					// Mock successful account deletion
					set({ isLoading: false }, false, "deleteAccount:success")

					return { success: true }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : "Unknown error"
					set(
						{
							error: errorMessage,
							isLoading: false,
						},
						false,
						"deleteAccount:error"
					)
					return { error: errorMessage }
				}
			},

			// Utility actions
			setLoading: loading => {
				set({ isLoading: loading }, false, "setLoading")
			},

			setError: error => {
				set({ error }, false, "setError")
			},

			reset: () => {
				set(initialState, false, "reset")
			},
		}),
		{
			name: "security-store",
			enabled: process.env.NODE_ENV === "development",
		}
	)
)
