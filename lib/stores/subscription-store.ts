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

export interface BillingHistoryItem {
	id: string
	date: Date
	amount: number
	status: string
	description: string
	plan_code?: string | null
}

export interface SubscriptionStore {
	// State
	subscription: Subscription | null
	tiers: SubscriptionTier[]
	billingHistory: BillingHistoryItem[]
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
	upgradeSubscription: (planCode: string) => Promise<{ checkoutUrl: string } | { error: string }>
	downgradeSubscription: (planCode: string) => Promise<{ checkoutUrl: string } | { error: string }>
	cancelSubscription: () => Promise<{ success: boolean } | { error: string }>
	loadBillingHistory: () => Promise<void>

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
		paystackPlanCode: process.env.NEXT_PUBLIC_PAYSTACK_CASUAL_PLAN_CODE || "PLN_CASUAL_001",
		description: "Enhanced experience with premium features and priority access",
		features: ["Only billed monthly", "Free member", "Free Bundle"],
		popular: false,
	},
	{
		id: "curate_control",
		name: "Curate & Control",
		price: 10, // $10/month in USD
		paystackPlanCode: process.env.NEXT_PUBLIC_PAYSTACK_PREMIUM_PLAN_CODE || "PLN_PREMIUM_001",
		description: "Ultimate control with unlimited custom curation profiles",
		features: ["Only billed monthly", "custom-curation-profiles", "Free member", "Free Bundle"],
		popular: true,
	},
]

// Mock subscription data for testing
const MOCK_SUBSCRIPTION: Subscription = {
	id: "sub_123456789",
	userId: "user_123456789",
	paystackSubscriptionCode: "SUB_CASUAL_001",
	paystackPlanCode: "PLN_CASUAL_001",
	status: "active",
	currentPeriodStart: new Date("2024-01-01"),
	currentPeriodEnd: new Date("2024-02-01"),
	trialStart: new Date("2023-12-15"),
	trialEnd: new Date("2024-01-01"),
	canceledAt: null,
	createdAt: new Date("2023-12-15"),
	updatedAt: new Date("2024-01-01"),
}

// Mock billing history for testing
const MOCK_BILLING_HISTORY: BillingHistoryItem[] = [
	{
		id: "bill_001",
		date: new Date("2024-01-01"),
		amount: 5.00,
		status: "active",
		description: "Casual Listener - Monthly Subscription",
		plan_code: "PLN_CASUAL_001",
	},
	{
		id: "bill_002",
		date: new Date("2023-12-15"),
		amount: 0.00,
		status: "trial",
		description: "Casual Listener - Trial Period",
		plan_code: "PLN_CASUAL_001",
	},
	{
		id: "bill_003",
		date: new Date("2023-12-01"),
		amount: 0.00,
		status: "free",
		description: "FreeSlice - Initial Signup",
		plan_code: null,
	},
]

const initialState = {
	subscription: null,
	tiers: SUBSCRIPTION_TIERS,
	billingHistory: [],
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
					// For testing purposes, use mock data instead of API call
					// In production, this would be: const response = await fetch("/api/subscription")

					// Simulate API delay
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Use mock data for testing
					const subscription = MOCK_SUBSCRIPTION
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
					// For testing purposes, simulate API call
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Mock successful response
					const checkoutUrl = `https://checkout.paystack.com/mock-transaction-${Date.now()}`
					set({ isLoading: false }, false, "initializeTransaction:success")
					return { checkoutUrl }
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

			upgradeSubscription: async (planCode: string) => {
				set({ isLoading: true, error: null }, false, "upgradeSubscription:start")

				try {
					// For testing purposes, simulate API call
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Mock successful response
					const checkoutUrl = `https://checkout.paystack.com/upgrade-${planCode}-${Date.now()}`
					set({ isLoading: false }, false, "upgradeSubscription:success")
					return { checkoutUrl }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : "Unknown error"
					set(
						{
							error: errorMessage,
							isLoading: false,
						},
						false,
						"upgradeSubscription:error"
					)
					return { error: errorMessage }
				}
			},

			downgradeSubscription: async (planCode: string) => {
				set({ isLoading: true, error: null }, false, "downgradeSubscription:start")

				try {
					// For testing purposes, simulate API call
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Mock successful response
					const checkoutUrl = `https://checkout.paystack.com/downgrade-${planCode}-${Date.now()}`
					set({ isLoading: false }, false, "downgradeSubscription:success")
					return { checkoutUrl }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : "Unknown error"
					set(
						{
							error: errorMessage,
							isLoading: false,
						},
						false,
						"downgradeSubscription:error"
					)
					return { error: errorMessage }
				}
			},

			cancelSubscription: async () => {
				set({ isLoading: true, error: null }, false, "cancelSubscription:start")

				try {
					// For testing purposes, simulate API call
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Mock successful cancellation
					set({ isLoading: false }, false, "cancelSubscription:success")
					return { success: true }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : "Unknown error"
					set(
						{
							error: errorMessage,
							isLoading: false,
						},
						false,
						"cancelSubscription:error"
					)
					return { error: errorMessage }
				}
			},

			loadBillingHistory: async () => {
				set({ isLoading: true, error: null }, false, "loadBillingHistory:start")

				try {
					// For testing purposes, simulate API call
					await new Promise(resolve => setTimeout(resolve, 1000))

					// Use mock billing history
					set({ billingHistory: MOCK_BILLING_HISTORY, isLoading: false }, false, "loadBillingHistory:success")
				} catch (error) {
					set(
						{
							error: error instanceof Error ? error.message : "Unknown error",
							isLoading: false,
						},
						false,
						"loadBillingHistory:error"
					)
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
