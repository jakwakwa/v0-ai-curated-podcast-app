import { useEffect } from "react";
import { useSubscriptionStore } from "@/lib/stores/subscription-store-paddlejs";

/**
 * Hook to initialize subscription data on app load
 * This ensures subscription data is available consistently across components
 */
export function useSubscriptionInit() {
	const { setSubscription, setIsLoading, setError } = useSubscriptionStore();

	useEffect(() => {
		const initializeSubscription = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch("/api/account/subscription", {
					// Use cached data if available, but allow stale-while-revalidate
					cache: "default",
				});

				if (!response.ok) {
					if (response.status === 204) {
						// No subscription found - this is valid
						setSubscription(null);
					} else {
						throw new Error(`Failed to fetch subscription: ${response.status}`);
					}
					return;
				}

				const subscription = await response?.json();
				setSubscription(subscription);
			} catch (error) {
				console.error("Failed to initialize subscription:", error);
				setError(error instanceof Error ? error.message : "Failed to load subscription");
			} finally {
				setIsLoading(false);
			}
		};

		initializeSubscription();
	}, [setSubscription, setIsLoading, setError]);
}
