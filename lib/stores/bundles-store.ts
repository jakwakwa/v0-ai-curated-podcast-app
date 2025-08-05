import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { Bundle, Podcast } from "@/lib/types"

// Bundle with podcasts array from API response
export type BundleWithPodcasts = Bundle & { podcasts: Podcast[] }

interface BundlesState {
	// State
	bundles: BundleWithPodcasts[]
	isLoading: boolean
	isFromCache: boolean
	lastFetched: number | null
	error: string | null

	// Actions
	fetchBundles: () => Promise<void>
	refreshData: () => Promise<void>
	clearError: () => void
	invalidateBundlesCache: () => void
	reset: () => void
}

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

// Helper functions outside of the store
const getCachedData = (key: string, duration: number): unknown | null => {
	try {
		const cached = localStorage.getItem(key)
		if (cached) {
			const { data, timestamp } = JSON.parse(cached)
			if (Date.now() - timestamp < duration) {
				return data
			}
		}
	} catch (error) {
		console.warn("Failed to read cache:", error)
	}
	return null
}

const setCachedData = (key: string, data: unknown): void => {
	try {
		const cacheData = {
			data,
			timestamp: Date.now(),
		}
		localStorage.setItem(key, JSON.stringify(cacheData))
	} catch (error) {
		console.warn("Failed to write cache:", error)
	}
}

export const useBundlesStore = create<BundlesState>()(
	devtools(
		(set, _get) => ({
			// Initial state
			bundles: [],
			isLoading: false,
			isFromCache: false,
			lastFetched: null,
			error: null,

			// Main actions
			fetchBundles: async () => {
				try {
					set({ isLoading: true, error: null })

					// Try to get cached bundles first
					const cachedBundles = getCachedData("bundles_cache", CACHE_DURATION) as BundleWithPodcasts[] | null

					if (cachedBundles && Array.isArray(cachedBundles)) {
						set({
							bundles: cachedBundles,
							isFromCache: true,
							isLoading: false,
							lastFetched: Date.now(),
						})
						return
					}

					// Fetch fresh bundles
					const response = await fetch("/api/curated-bundles")

					if (!response.ok) {
						throw new Error("Failed to fetch bundles")
					}

					const fetchedBundles: BundleWithPodcasts[] = await response.json()

					// Cache the fresh data
					if (fetchedBundles.length > 0) {
						setCachedData("bundles_cache", fetchedBundles)
					}

					set({
						bundles: fetchedBundles,
						isFromCache: false,
						isLoading: false,
						lastFetched: Date.now(),
					})
				} catch (error) {
					const message = error instanceof Error ? error.message : "Failed to fetch bundles"
					set({ error: message, isLoading: false })
					console.error("Failed to fetch bundles:", error)
				}
			},

			refreshData: async () => {
				try {
					set({ isLoading: true, error: null })

					// Clear cache to force fresh fetch
					try {
						localStorage.removeItem("bundles_cache")
					} catch (error) {
						console.warn("Failed to clear cache:", error)
					}

					// Fetch fresh data
					const response = await fetch("/api/curated-bundles")

					if (!response.ok) {
						throw new Error("Failed to refresh bundles")
					}

					const fetchedBundles: BundleWithPodcasts[] = await response.json()

					// Cache the fresh data
					if (fetchedBundles.length > 0) {
						setCachedData("bundles_cache", fetchedBundles)
					}

					set({
						bundles: fetchedBundles,
						isFromCache: false,
						isLoading: false,
						lastFetched: Date.now(),
					})
				} catch (error) {
					const message = error instanceof Error ? error.message : "Failed to refresh bundles"
					set({ error: message, isLoading: false })
					console.error("Failed to refresh bundles:", error)
				}
			},

			clearError: () => {
				set({ error: null })
			},

			// Invalidate specific cache entries
			invalidateBundlesCache: () => {
				try {
					localStorage.removeItem("bundles_cache")
				} catch (error) {
					console.warn("Failed to invalidate bundles cache:", error)
				}
			},

			reset: () => {
				set({
					bundles: [],
					isLoading: false,
					isFromCache: false,
					lastFetched: null,
					error: null,
				})
			},
		}),
		{
			name: "bundles-store",
		}
	)
)
