import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { useUserCurationProfileStore } from "./user-curation-profile-store"

export interface Subscription {
	id: string
	userId: string
	linkCustomerId?: string
	linkSubscriptionId?: string
	linkPriceId?: string
	status: "trialing" | "active" | "canceled" | "past_due" | "incomplete"
	currentPeriodStart?: Date
	currentPeriodEnd?: Date
	trialStart?: Date
	trialEnd?: Date
	canceledAt?: Date
	createdAt: Date
	updatedAt: Date
}

export interface SubscriptionTier {
	id: string
	name: string
	price: number
	linkPriceId?: string
	features: string[]
}

export interface SubscriptionStore {
	// State
	subscription: Subscription | null
	tiers: SubscriptionTier[]
	isLoading: boolean
	error: string | null

	// Subscription info computed properties
	isTrialing: boolean
	isActive: boolean
	isCanceled: boolean
	daysUntilTrialEnd: number | null
	daysUntilPeriodEnd: number | null

	// Actions
	setSubscription: (subscription: Subscription | null) => void
	loadSubscription: () => Promise<void>
	createTrialSubscription: () => Promise<void>
	upgradeTopremium: () => Promise<{ checkoutUrl: string }>
	cancelSubscription: () => Promise<void>
	resumeSubscription: () => Promise<void>
	updatePaymentMethod: () => Promise<{ portalUrl: string }>

	// Utility actions
	setLoading: (loading: boolean) => void
	setError: (error: string | null) => void
	reset: () => void

	// Helper methods
	canCreateUserCurationProfile: () => boolean
	getRemainingTrialDays: () => number | null
}

// Subscription tiers from requirements
const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
	{
		id: "freeslice",
		name: "FreeSlice",
		price: 0,
		features: ["Always free", "Free member", "Free Bundle"],
	},
	{
		id: "casual_listener",
		name: "Casual Listener",
		price: 5, // $5/month in USD
		linkPriceId: process.env.NEXT_PUBLIC_LINK_CASUAL_PRICE_ID,
		features: ["Only billed monthly", "Free member", "Free Bundle"],
	},
	{
		id: "curate_control",
		name: "Curate & Control",
		price: 10, // $10/month in USD
		linkPriceId: process.env.NEXT_PUBLIC_LINK_PREMIUM_PRICE_ID,
		features: ["Only billed monthly", "custom-curation-profiles", "Free member", "Free Bundle"],
	},
]

const initialState = {
	subscription: null,
	tiers: SUBSCRIPTION_TIERS,
	isLoading: false,
	error: null,
	isTrialing: false,
	isActive: false,
	isCanceled: false,
	daysUntilTrialEnd: null,
	daysUntilPeriodEnd: null,
}

const calculateDaysUntil = (targetDate: Date | undefined): number | null => {
	if (!targetDate) return null

	const now = new Date()
	const target = new Date(targetDate)
	const diffTime = target.getTime() - now.getTime()
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

	return diffDays > 0 ? diffDays : 0
}

export const useSubscriptionStore = create<SubscriptionStore>()(
	devtools(
		(set, get) => ({
			...initialState,

			// Actions
			setSubscription: subscription => {
				const isTrialing = subscription?.status === "trialing"
				const isActive = subscription?.status === "active"
				const isCanceled = subscription?.status === "canceled"
				const daysUntilTrialEnd = calculateDaysUntil(subscription?.trialEnd)
				const daysUntilPeriodEnd = calculateDaysUntil(subscription?.currentPeriodEnd)

				set(
					{
						subscription,
						isTrialing,
						isActive,
						isCanceled,
						daysUntilTrialEnd,
						daysUntilPeriodEnd,
					},
					false,
					"setSubscription"
				)
			},

			loadSubscription: async () => {
				set({ isLoading: true, error: null }, false, "loadSubscription:start")

				try {
					const response = await fetch("/api/subscription")

					if (!response.ok) {
						if (response.status === 404) {
							// No subscription exists yet
							set({ subscription: null, isLoading: false }, false, "loadSubscription:none")
							return
						}
						throw new Error("Failed to load subscription")
					}

					const subscription = await response.json()
					const { setSubscription } = get()
					setSubscription(subscription)
					set({ isLoading: false }, false, "loadSubscription:success")
				} catch (error) {
					set(
						{
							error: error instanceof Error ? error.message : "Unknown error",
							isLoading: false,
						},
						false,
						"loadSubscription:error"
					)
					throw error
				}
			},

			createTrialSubscription: async () => {
				set({ isLoading: true, error: null }, false, "createTrialSubscription:start")

				try {
					const response = await fetch("/api/subscription/trial", {
						method: "POST",
					})

					if (!response.ok) {
						throw new Error("Failed to create trial subscription")
					}

					const subscription = await response.json()
					const { setSubscription } = get()
					setSubscription(subscription)
					set({ isLoading: false }, false, "createTrialSubscription:success")
				} catch (error) {
					set(
						{
							error: error instanceof Error ? error.message : "Unknown error",
							isLoading: false,
						},
						false,
						"createTrialSubscription:error"
					)
					throw error
				}
			},

			upgradeTopremium: async () => {
				set({ isLoading: true, error: null }, false, "upgradeTopremium:start")

				try {
					const response = await fetch("/api/subscription/upgrade", {
						method: "POST",
					})

					if (!response.ok) {
						throw new Error("Failed to create upgrade checkout")
					}

					const { checkoutUrl } = await response.json()
					set({ isLoading: false }, false, "upgradeToPremium:success")
					return { checkoutUrl }
				} catch (error) {
					set(
						{
							error: error instanceof Error ? error.message : "Unknown error",
							isLoading: false,
						},
						false,
						"upgradeTopremium:error"
					)
					throw error
				}
			},

			cancelSubscription: async () => {
				set({ isLoading: true, error: null }, false, "cancelSubscription:start")

				try {
					const response = await fetch("/api/subscription/cancel", {
						method: "POST",
					})

					if (!response.ok) {
						throw new Error("Failed to cancel subscription")
					}

					const subscription = await response.json()
					const { setSubscription } = get()
					setSubscription(subscription)
					set({ isLoading: false }, false, "cancelSubscription:success")
				} catch (error) {
					set(
						{
							error: error instanceof Error ? error.message : "Unknown error",
							isLoading: false,
						},
						false,
						"cancelSubscription:error"
					)
					throw error
				}
			},

			resumeSubscription: async () => {
				set({ isLoading: true, error: null }, false, "resumeSubscription:start")

				try {
					const response = await fetch("/api/subscription/resume", {
						method: "POST",
					})

					if (!response.ok) {
						throw new Error("Failed to resume subscription")
					}

					const subscription = await response.json()
					const { setSubscription } = get()
					setSubscription(subscription)
					set({ isLoading: false }, false, "resumeSubscription:success")
				} catch (error) {
					set(
						{
							error: error instanceof Error ? error.message : "Unknown error",
							isLoading: false,
						},
						false,
						"resumeSubscription:error"
					)
					throw error
				}
			},

			updatePaymentMethod: async () => {
				set({ isLoading: true, error: null }, false, "updatePaymentMethod:start")

				try {
					const response = await fetch("/api/subscription/billing-portal", {
						method: "POST",
					})

					if (!response.ok) {
						throw new Error("Failed to access billing portal")
					}

					const { portalUrl } = await response.json()
					set({ isLoading: false }, false, "updatePaymentMethod:success")
					return { portalUrl }
				} catch (error) {
					set(
						{
							error: error instanceof Error ? error.message : "Unknown error",
							isLoading: false,
						},
						false,
						"updatePaymentMethod:error"
					)
					throw error
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

			// Helper methods
			canCreateUserCurationProfile: () => {
				// Development mode bypass - allow creation in development
				if (process.env.NODE_ENV === "development") {
					return true
				}

				const { subscription } = get()
				const userCurationProfileStore = useUserCurationProfileStore.getState()
				const { userCurationProfile } = userCurationProfileStore

				// If the user has a premium subscription, they can create a profile (unlimited is conceptual for future)
				if (subscription?.status === "active") {
					return true
				}

				// If the user is on trial, they can create a profile if they don't already have one
				if (subscription?.status === "trialing") {
					return !userCurationProfile
				}

				// If no subscription or other status, they cannot create
				return false
			},

			getRemainingTrialDays: () => {
				const { subscription } = get()

				if (subscription?.status !== "trialing" || !subscription?.trialEnd) return null

				return calculateDaysUntil(subscription.trialEnd)
			},
		}),
		{
			name: "subscription-store",
			enabled: process.env.NODE_ENV === "development",
		}
	)
)
