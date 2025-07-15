import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface CuratedPodcast {
  id: string
  name: string
  url: string
  description?: string
  imageUrl?: string
  category: string
  isActive: boolean
  createdAt: Date
}

export interface CuratedBundle {
  id: string
  name: string
  description?: string
  imageUrl?: string
  isActive: boolean
  createdAt: Date
  bundlePodcasts: {
    podcast: CuratedPodcast
  }[]
}

export interface Collection {
  id: string
  userId: string
  name: string
  status: string
  audioUrl?: string
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
  generatedAt?: Date
  lastGenerationDate?: Date
  nextGenerationDate?: Date
  isActive: boolean
  isBundleSelection: boolean
  selectedBundleId?: string
  selectedBundle?: CuratedBundle
  sources: any[]
  episodes: any[]
}

export interface CollectionStore {
  // State
  collection: Collection | null
  curatedPodcasts: CuratedPodcast[]
  curatedBundles: CuratedBundle[]
  selectedPodcasts: CuratedPodcast[]
  isLoading: boolean
  error: string | null

  // Collection actions
  setCollection: (collection: Collection | null) => void
  createCollection: (data: { name: string; isBundleSelection: boolean; selectedBundleId?: string; selectedPodcasts?: string[] }) => Promise<void>
  updateCollection: (data: Partial<Collection>) => Promise<void>
  deleteCollection: () => Promise<void>

  // Curated content actions
  setCuratedPodcasts: (podcasts: CuratedPodcast[]) => void
  setCuratedBundles: (bundles: CuratedBundle[]) => void
  loadCuratedContent: () => Promise<void>

  // Selection actions
  togglePodcastSelection: (podcast: CuratedPodcast) => void
  clearSelectedPodcasts: () => void
  setSelectedBundle: (bundleId: string) => void

  // Utility actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  collection: null,
  curatedPodcasts: [],
  curatedBundles: [],
  selectedPodcasts: [],
  isLoading: false,
  error: null,
}

export const useCollectionStore = create<CollectionStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Collection actions
      setCollection: (collection) => {
        set({ collection }, false, 'setCollection')
      },

      createCollection: async (data) => {
        set({ isLoading: true, error: null }, false, 'createCollection:start')
        
        try {
          const response = await fetch('/api/collections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })

          if (!response.ok) {
            throw new Error('Failed to create collection')
          }

          const collection = await response.json()
          set({ collection, isLoading: false }, false, 'createCollection:success')
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false 
          }, false, 'createCollection:error')
          throw error
        }
      },

      updateCollection: async (data) => {
        const { collection } = get()
        if (!collection) return

        set({ isLoading: true, error: null }, false, 'updateCollection:start')
        
        try {
          const response = await fetch(`/api/collections/${collection.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })

          if (!response.ok) {
            throw new Error('Failed to update collection')
          }

          const updatedCollection = await response.json()
          set({ collection: updatedCollection, isLoading: false }, false, 'updateCollection:success')
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false 
          }, false, 'updateCollection:error')
          throw error
        }
      },

      deleteCollection: async () => {
        const { collection } = get()
        if (!collection) return

        set({ isLoading: true, error: null }, false, 'deleteCollection:start')
        
        try {
          const response = await fetch(`/api/collections/${collection.id}`, {
            method: 'DELETE',
          })

          if (!response.ok) {
            throw new Error('Failed to delete collection')
          }

          set({ collection: null, isLoading: false }, false, 'deleteCollection:success')
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false 
          }, false, 'deleteCollection:error')
          throw error
        }
      },

      // Curated content actions
      setCuratedPodcasts: (podcasts) => {
        set({ curatedPodcasts: podcasts }, false, 'setCuratedPodcasts')
      },

      setCuratedBundles: (bundles) => {
        set({ curatedBundles: bundles }, false, 'setCuratedBundles')
      },

      loadCuratedContent: async () => {
        set({ isLoading: true, error: null }, false, 'loadCuratedContent:start')
        
        try {
          const [podcastsResponse, bundlesResponse] = await Promise.all([
            fetch('/api/curated-podcasts'),
            fetch('/api/curated-bundles'),
          ])

          if (!podcastsResponse.ok || !bundlesResponse.ok) {
            throw new Error('Failed to load curated content')
          }

          const [podcasts, bundles] = await Promise.all([
            podcastsResponse.json(),
            bundlesResponse.json(),
          ])

          set({ 
            curatedPodcasts: podcasts,
            curatedBundles: bundles,
            isLoading: false 
          }, false, 'loadCuratedContent:success')
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false 
          }, false, 'loadCuratedContent:error')
          throw error
        }
      },

      // Selection actions
      togglePodcastSelection: (podcast) => {
        const { selectedPodcasts } = get()
        const isSelected = selectedPodcasts.some(p => p.id === podcast.id)
        
        if (isSelected) {
          set({ 
            selectedPodcasts: selectedPodcasts.filter(p => p.id !== podcast.id) 
          }, false, 'togglePodcastSelection:remove')
        } else {
          // Limit to 5 podcasts
          if (selectedPodcasts.length < 5) {
            set({ 
              selectedPodcasts: [...selectedPodcasts, podcast] 
            }, false, 'togglePodcastSelection:add')
          }
        }
      },

      clearSelectedPodcasts: () => {
        set({ selectedPodcasts: [] }, false, 'clearSelectedPodcasts')
      },

      setSelectedBundle: (bundleId) => {
        const { curatedBundles } = get()
        const bundle = curatedBundles.find(b => b.id === bundleId)
        
        set({ 
          selectedPodcasts: bundle ? bundle.bundlePodcasts.map(bp => bp.podcast) : []
        }, false, 'setSelectedBundle')
      },

      // Utility actions
      setLoading: (loading) => {
        set({ isLoading: loading }, false, 'setLoading')
      },

      setError: (error) => {
        set({ error }, false, 'setError')
      },

      reset: () => {
        set(initialState, false, 'reset')
      },
    }),
    { name: 'collection-store' }
  )
)