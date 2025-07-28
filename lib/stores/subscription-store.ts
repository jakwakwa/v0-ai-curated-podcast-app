import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { useUserCurationProfileStore } from "./user-curation-profile-store"

export interface Subscription {
	id: string
	userId: string
	paystackSubscriptionCode?: string | null
	paystackPlanCode?: string | null
	status: "trialing" | "active" | "canceled" | "past_due" | "incomplete" | "non-renewing" | "attention" | "complete"
	currentPeriodStart?: Date | null
	currentPeriodEnd?: Date | null
	trialStart?: Date | null
	trialEnd?: Date | null
	canceledAt?: Date | null
	createdAt: Date
	updatedAt: Date
}

export interface SubscriptionTier {
	id: string
	name: string
	price: number
	paystackPlanCode?: string
	features: string[]
	popular?: boolean
	description?: string
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
	initializeTransaction: (planCode: string) => Promise<{ checkoutUrl: string } | { error: string }>

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
		description: "Perfect for podcast discovery and light listening",
		features: ["Always free", "Free member", "Free Bundle"],
		popular: false,
	},
	{
		id: "casual_listener",
		name: "Casual Listener",
		price: 5, // $5/month in USD
		paystackPlanCode: process.env.NEXT_PUBLIC_PAYSTACK_CASUAL_PLAN_CODE,
		description: "Enhanced experience with premium features and priority access",
		features: ["Only billed monthly", "Free member", "Free Bundle"],
		popular: false,
	},
	{
		id: "curate_control",
		name: "Curate & Control",
		price: 10, // $10/month in USD
		paystackPlanCode: process.env.NEXT_PUBLIC_PAYSTACK_PREMIUM_PLAN_CODE,
		description: "Ultimate control with unlimited custom curation profiles",
		features: ["Only billed monthly", "custom-curation-profiles", "Free member", "Free Bundle"],
		popular: true,
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

const calculateDaysUntil = (targetDate: Date | null | undefined): number | null => {
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
				}
			},

			initializeTransaction: async (planCode: string) => {
				set({ isLoading: true, error: null }, false, "initializeTransaction:start")

				try {
					const response = await fetch("/api/paystack/initialize-transaction", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ planCode }),
					})

					if (!response.ok) {
						const errorData = await response.json()
						throw new Error(errorData.message || "Failed to initialize transaction")
					}

					const { authorization_url } = await response.json()
					set({ isLoading: false }, false, "initializeTransaction:success")
					return { checkoutUrl: authorization_url }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : "Unknown error"
					set(
						{
							error: errorMessage,
							isLoading: false,
						},
						false,
						"initializeTransaction:error"
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
