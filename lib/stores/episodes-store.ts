import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { Episode, UserCurationProfileWithRelations } from "@/lib/types"

// Combined episode type for display - extending Prisma Episode with display type
interface CombinedEpisode extends Episode {
	type: "user" | "bundle"
}

interface EpisodesState {
	// State
	episodes: Episode[]
	bundleEpisodes: Episode[]
	combinedEpisodes: CombinedEpisode[]
	userCurationProfile: UserCurationProfileWithRelations | null
	isLoading: boolean
	isFromCache: boolean
	lastFetched: number | null
	error: string | null

	// Actions
	fetchEpisodes: () => Promise<void>
	fetchUserCurationProfile: () => Promise<void>
	refreshData: () => Promise<void>
	clearError: () => void
	invalidateProfileCache: () => void
	refreshProfileAfterChange: () => Promise<void>
	reset: () => void
}

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
const PROFILE_CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds - optimized for weekly content updates

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

export const useEpisodesStore = create<EpisodesState>()(
	devtools(
		(set, _get) => ({
			// Initial state
			episodes: [],
			bundleEpisodes: [],
			combinedEpisodes: [],
			userCurationProfile: null,
			isLoading: false,
			isFromCache: false,
			lastFetched: null,
			error: null,

			// Main actions
			fetchEpisodes: async () => {
				try {
					set({ isLoading: true, error: null })

					// Try to get cached episodes first
					const cachedEpisodes = getCachedData("episodes_cache", CACHE_DURATION) as Episode[] | null

					if (cachedEpisodes && Array.isArray(cachedEpisodes)) {
						// Process cached episodes
						const combined: CombinedEpisode[] = cachedEpisodes.map((ep: Episode) => ({
							...ep,
							type: ep.bundle_id ? "bundle" : ("user" as const),
						}))

						// Sort by published date (newest first)
						combined.sort((a, b) => {
							const dateA = a.published_at ? new Date(a.published_at).getTime() : 0
							const dateB = b.published_at ? new Date(b.published_at).getTime() : 0
							return dateB - dateA
						})

						set({
							episodes: cachedEpisodes.filter((ep: Episode) => !ep.bundle_id),
							bundleEpisodes: cachedEpisodes.filter((ep: Episode) => ep.bundle_id),
							combinedEpisodes: combined,
							isFromCache: true,
							isLoading: false,
							lastFetched: Date.now(),
						})
						return
					}

					// Fetch fresh episodes
					const response = await fetch("/api/episodes", {
						headers: { "Cache-Control": "max-age=604800" }, // 7 days cache
					})

					if (!response.ok) {
						throw new Error("Failed to fetch episodes")
					}

					const fetchedEpisodes: Episode[] = await response.json()

					// Cache the fresh data
					if (fetchedEpisodes.length > 0) {
						setCachedData("episodes_cache", fetchedEpisodes)
					}

					// Process episodes
					const combined: CombinedEpisode[] = fetchedEpisodes.map((ep: Episode) => ({
						...ep,
						type: ep.bundle_id ? "bundle" : ("user" as const),
					}))

					// Sort by published date (newest first)
					combined.sort((a, b) => {
						const dateA = a.published_at ? new Date(a.published_at).getTime() : 0
						const dateB = b.published_at ? new Date(b.published_at).getTime() : 0
						return dateB - dateA
					})

					set({
						episodes: fetchedEpisodes.filter((ep: Episode) => !ep.bundle_id),
						bundleEpisodes: fetchedEpisodes.filter((ep: Episode) => ep.bundle_id),
						combinedEpisodes: combined,
						isFromCache: false,
						isLoading: false,
						lastFetched: Date.now(),
					})
				} catch (error) {
					const message = error instanceof Error ? error.message : "Failed to fetch episodes"
					set({ error: message, isLoading: false })
					console.error("Failed to fetch episodes:", error)
				}
			},

			fetchUserCurationProfile: async () => {
				try {
					// Try to get cached profile first
					const cachedProfile = getCachedData("profile_cache", PROFILE_CACHE_DURATION) as UserCurationProfileWithRelations | null

					if (cachedProfile) {
						set({
							userCurationProfile: cachedProfile,
							isFromCache: true,
						})
						return
					}

					// Fetch fresh profile
					const response = await fetch("/api/user-curation-profiles", {
						headers: { "Cache-Control": "max-age=3600" }, // 1 hour cache
					})

					if (!response.ok) {
						throw new Error("Failed to fetch user curation profile")
					}

					const fetchedProfile = await response.json()

					// Cache the fresh data
					if (fetchedProfile) {
						setCachedData("profile_cache", fetchedProfile)
					}

					set({
						userCurationProfile: fetchedProfile,
						isFromCache: false,
					})
				} catch (error) {
					const message = error instanceof Error ? error.message : "Failed to fetch profile"
					set({ error: message })
					console.error("Failed to fetch user curation profile:", error)
				}
			},

			refreshData: async () => {
				try {
					set({ isLoading: true, error: null })

					// Clear cache to force fresh fetch
					try {
						localStorage.removeItem("episodes_cache")
						localStorage.removeItem("profile_cache")
					} catch (error) {
						console.warn("Failed to clear cache:", error)
					}

					// Fetch fresh data
					const [profileResponse, episodesResponse] = await Promise.all([
						fetch("/api/user-curation-profiles", {
							headers: { "Cache-Control": "max-age=3600" },
						}),
						fetch("/api/episodes", {
							headers: { "Cache-Control": "max-age=604800" },
						}),
					])

					if (!(profileResponse.ok && episodesResponse.ok)) {
						throw new Error("Failed to refresh data")
					}

					const [fetchedProfile, fetchedEpisodes] = await Promise.all([profileResponse.json(), episodesResponse.json()])

					// Cache the fresh data
					if (fetchedEpisodes.length > 0) {
						setCachedData("episodes_cache", fetchedEpisodes)
					}
					if (fetchedProfile) {
						setCachedData("profile_cache", fetchedProfile)
					}

					// Process episodes
					const combined: CombinedEpisode[] = fetchedEpisodes.map((ep: Episode) => ({
						...ep,
						type: ep.bundle_id ? "bundle" : ("user" as const),
					}))

					// Sort by published date (newest first)
					combined.sort((a, b) => {
						const dateA = a.published_at ? new Date(a.published_at).getTime() : 0
						const dateB = b.published_at ? new Date(b.published_at).getTime() : 0
						return dateB - dateA
					})

					set({
						episodes: fetchedEpisodes.filter((ep: Episode) => !ep.bundle_id),
						bundleEpisodes: fetchedEpisodes.filter((ep: Episode) => ep.bundle_id),
						combinedEpisodes: combined,
						userCurationProfile: fetchedProfile,
						isFromCache: false,
						isLoading: false,
						lastFetched: Date.now(),
					})
				} catch (error) {
					const message = error instanceof Error ? error.message : "Failed to refresh data"
					set({ error: message, isLoading: false })
					console.error("Failed to refresh data:", error)
				}
			},

			clearError: () => {
				set({ error: null })
			},

			// Invalidate specific cache entries
			invalidateProfileCache: () => {
				try {
					localStorage.removeItem("profile_cache")
				} catch (error) {
					console.warn("Failed to invalidate profile cache:", error)
				}
			},

			// Force refresh profile after changes (e.g., bundle selection)
			refreshProfileAfterChange: async () => {
				const store = _get()
				store.invalidateProfileCache()
				await store.fetchUserCurationProfile()
			},

			reset: () => {
				set({
					episodes: [],
					bundleEpisodes: [],
					combinedEpisodes: [],
					userCurationProfile: null,
					isLoading: false,
					isFromCache: false,
					lastFetched: null,
					error: null,
				})
			},
		}),
		{
			name: "episodes-store",
		}
	)
)
