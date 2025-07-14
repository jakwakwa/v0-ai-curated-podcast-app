import { create } from "zustand"
import type { Podcast } from "@/lib/types"

interface AudioPlayerState {
  activePodcast: Podcast | null
  isPlaying: boolean
  volume: number
  duration: number
  currentTime: number
}

interface AudioPlayerActions {
  setActivePodcast: (podcast: Podcast | null) => void
  togglePlayPause: () => void
  setVolume: (volume: number) => void
  setDuration: (duration: number) => void
  setCurrentTime: (time: number) => void
  reset: () => void
}

const initialState: AudioPlayerState = {
  activePodcast: null,
  isPlaying: false,
  volume: 0.5,
  duration: 0,
  currentTime: 0,
}

export const useAudioPlayerStore = create<AudioPlayerState & AudioPlayerActions>((set, get) => ({
  ...initialState,
  setActivePodcast: (podcast) => {
    const { activePodcast, isPlaying } = get()
    // If the same podcast is selected, toggle play/pause, otherwise play the new one
    if (activePodcast?.id === podcast?.id) {
      set({ isPlaying: !isPlaying })
    } else {
      set({ activePodcast: podcast, isPlaying: true, currentTime: 0 })
    }
  },
  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (volume) => set({ volume }),
  setDuration: (duration) => set({ duration }),
  setCurrentTime: (time) => set({ currentTime: time }),
  reset: () => set(initialState),
}))
