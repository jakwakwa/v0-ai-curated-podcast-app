import { create } from "zustand"

export interface PaddleSubscription {
	subscription_id: string
	user_id: string
	paddle_subscription_id: string | null
	paddle_price_id: string | null
	plan_type: "casual_listener" | "curate_control"
	status: "trialing" | "active" | "canceled" | "paused"
	current_period_start: Date | null
	current_period_end: Date | null
	trial_start: Date | null
	trial_end: Date | null
	canceled_at: Date | null
	cancel_at_period_end: boolean
	created_at: Date
	updated_at: Date
}

interface SubscriptionState {
	subscription: PaddleSubscription | null
	isLoading: boolean
	error: string | null

	// Computed properties
	status: string | null
	plan: string | null
	trialEndsAt: Date | null
	cancelAtPeriodEnd: boolean
	nextBillDate: Date | null

	// Actions
	setSubscription: (subscription: PaddleSubscription | null) => void
	setIsLoading: (isLoading: boolean) => void
	setError: (error: string | null) => void
	cancelSubscription: () => Promise<void>
	resumeSubscription: () => Promise<void>
	updatePaymentMethod: () => Promise<void>
	updateSubscription: (priceId: string) => Promise<void>
    loadSubscription: () => Promise<void>
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
	subscription: null,
	isLoading: false,
	error: null,

	// Computed properties based on subscription
	get status() {
		return get().subscription?.status || null
	},

	get plan() {
		return get().subscription?.plan_type || null
	},

	get trialEndsAt() {
		return get().subscription?.trial_end || null
	},

	get cancelAtPeriodEnd() {
		return get().subscription?.cancel_at_period_end ?? false
	},

	get nextBillDate() {
		return get().subscription?.current_period_end || null
	},

	// Actions
	setSubscription: subscription => set({ subscription }),
	setIsLoading: isLoading => set({ isLoading }),
	setError: error => set({ error }),

    loadSubscription: async () => {
        set({ isLoading: true })
        try {
            const res = await fetch("/api/subscriptions/status")
            if (!res.ok) throw new Error(await res.text())
            const data = await res.json()
            set({ subscription: data })
        } catch (error) {
            set({ error: error instanceof Error ? error.message : "Failed to load subscription" })
        } finally {
            set({ isLoading: false })
        }
    },

	cancelSubscription: async () => {
		set({ isLoading: true })
		try {
			const res = await fetch("/api/subscriptions/cancel", { method: "POST" })
			if (!res.ok) throw new Error(await res.text())
			await get().loadSubscription()
		} catch (error) {
			set({ error: error instanceof Error ? error.message : "Failed to cancel subscription" })
		} finally {
			set({ isLoading: false })
		}
	},

	resumeSubscription: async () => {
		set({ isLoading: true })
		try {
			const res = await fetch("/api/subscriptions/resume", { method: "POST" })
			if (!res.ok) throw new Error(await res.text())
			await get().loadSubscription()
		} catch (error) {
			set({ error: error instanceof Error ? error.message : "Failed to resume subscription" })
		} finally {
			set({ isLoading: false })
		}
	},

	updatePaymentMethod: async () => {
		set({ isLoading: true })
		try {
			const res = await fetch("/api/subscriptions/update-payment", { method: "POST" })
			if (!res.ok) throw new Error(await res.text())
			await get().loadSubscription()
		} catch (error) {
			set({ error: error instanceof Error ? error.message : "Failed to update payment method" })
		} finally {
			set({ isLoading: false })
		}
	},

	updateSubscription: async (priceId: string) => {
		set({ isLoading: true })
		try {
			const res = await fetch("/api/subscriptions/update", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ planId: priceId }),
			})
			if (!res.ok) throw new Error(await res.text())
			await get().loadSubscription()
		} catch (error) {
			set({ error: error instanceof Error ? error.message : "Failed to update subscription" })
		} finally {
			set({ isLoading: false })
		}
	},
}))
