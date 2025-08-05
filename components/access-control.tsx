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
                if (subscription.plan_type === "curate_control") {
                    return true // Full access
                }
                if (subscription.plan_type === "casual_listener") {
                    return feature === "weekly_combo" || feature === "free_bundle"
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