"use client"

import { useEffect } from "react"
import { useNotificationStore, useSubscriptionStore, useUserCurationProfileStore } from "@/lib/stores"

/**
 * Invisible component that initializes all Zustand stores
 * This ensures stores appear in Redux DevTools without any visual elements
 */
export function StoreInitializer() {
	const notificationStore = useNotificationStore()
	const subscriptionStore = useSubscriptionStore()
	const userCurationProfileStore = useUserCurationProfileStore()

	useEffect(() => {
		// Only run in development and if Redux DevTools is available
		if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
			// @ts-ignore - checking for Redux DevTools extension
			const hasReduxDevTools = !!(window.__REDUX_DEVTOOLS_EXTENSION__ || window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)

			if (hasReduxDevTools) {
				// Dispatch minimal actions to make stores visible in DevTools
				notificationStore.setError(null)
				subscriptionStore.setError(null)
				userCurationProfileStore.setUserCurationProfile(userCurationProfileStore.userCurationProfile)

				console.log("🔧 Redux DevTools: Stores initialized")
			}
		}
	}, [notificationStore.setError, subscriptionStore.setError, userCurationProfileStore.setUserCurationProfile, userCurationProfileStore.userCurationProfile]) // Store methods for DevTools initialization

	// Return null - this component is invisible
	return null
}
