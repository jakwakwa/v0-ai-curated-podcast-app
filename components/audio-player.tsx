"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { useAudioPlayerStore } from "@/lib/store/audio-player"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX, X } from "lucide-react"
import { formatTime } from "@/lib/utils"

export function AudioPlayer() {
  const {
    activePodcast,
    isPlaying,
    volume,
    currentTime,
    duration,
    setActivePodcast,
    togglePlayPause,
    setVolume,
    setCurrentTime,
    setDuration,
    reset,
  } = useAudioPlayerStore()

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current && activePodcast?.audioUrl) {
      if (isPlaying) {
        audioRef.current.play().catch((e) => console.error("Error playing audio:", e))
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, activePodcast])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
      const handleLoadedMetadata = () => setDuration(audio.duration)
      const handleEnded = () => setActivePodcast(null) // or play next

      audio.addEventListener("timeupdate", handleTimeUpdate)
      audio.addEventListener("loadedmetadata", handleLoadedMetadata)
      audio.addEventListener("ended", handleEnded)

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate)
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
        audio.removeEventListener("ended", handleEnded)
      }
    }
  }, [setCurrentTime, setDuration, setActivePodcast])

  if (!activePodcast) return null

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-20 border-t bg-background/80 backdrop-blur-md">
      <audio ref={audioRef} src={activePodcast.audioUrl ?? ""} />
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-4 w-1/4">
          <Image
            src={"/placeholder.svg?width=56&height=56&query=album+art"}
            alt={activePodcast.title}
            width={56}
            height={56}
            className="rounded-md"
          />
          <div>
            <p className="font-semibold truncate">{activePodcast.title}</p>
            <p className="text-sm text-muted-foreground">AI Generated Podcast</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 w-1/2">
          <Button size="icon" variant="ghost" onClick={togglePlayPause}>
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
            <Slider value={[currentTime]} max={duration || 1} step={1} onValueChange={handleSeek} className="w-full" />
            <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 w-1/4 justify-end">
          <div className="flex items-center gap-2 w-32">
            <Button size="icon" variant="ghost" onClick={() => setVolume(volume > 0 ? 0 : 0.5)}>
              {volume > 0 ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
            <Slider value={[volume]} max={1} step={0.01} onValueChange={handleVolumeChange} />
          </div>
          <Button size="icon" variant="ghost" onClick={reset}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
