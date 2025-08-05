"use client"

import { useSubscriptionStore } from "@/lib/stores/subscription-store-paddlejs"

export type Feature = "custom_curation_profiles" | "weekly_combo" | "free_bundle"

export const useAccessControl = () => {
	const { subscription } = useSubscriptionStore()

	const checkAccess = (feature: Feature): boolean => {
		if (!subscription) {
			return feature === "free_bundle"
		}

		switch (subscription.status) {
			case "active":
			case "trialing": {
				const plan = useSubscriptionStore.getState().tiers.find(t => t.paystackPlanCode === subscription.paystackPlanCode)
				if (plan) {
					if (plan.name === "Curate & Control") {
						return true // Access to all features
					}
					if (plan.name === "Casual Listener") {
						return feature === "weekly_combo" || feature === "free_bundle"
					}
				}
				return feature === "free_bundle"
			}
			default:
				return feature === "free_bundle"
		}
	}

	return {
		hasAccess: checkAccess,
	}
}
