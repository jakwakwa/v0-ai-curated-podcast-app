"use client";

import { Play, Share2 } from "lucide-react";
import { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { Episode } from "@/lib/types";
import { useAudioPlayerStore } from "@/store/audioPlayerStore";

// Accept an Episode plus an optional signedAudioUrl we resolved serverside.
export default function PlayAndShare({ episode, signedAudioUrl }: { episode: Episode; signedAudioUrl: string | null }) {
  const { setEpisode } = useAudioPlayerStore();

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  const canPlay = !!(signedAudioUrl || episode.audio_url);

  const onPlay = useCallback(() => {
    if (!canPlay) return;
    // Normalize so audio player uses the signed URL when present
    const normalized: Episode = { ...episode, audio_url: signedAudioUrl || episode.audio_url };
    setEpisode(normalized as unknown as Episode); // store expects generic episode object
  }, [canPlay, episode, setEpisode, signedAudioUrl]);

  const onShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: episode.title, url: shareUrl });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      // Intentionally no toast (keep lightweight like user version)
      console.log("Copied link:", shareUrl);
    } catch (e) {
      console.warn("Share failed", e);
    }
  }, [episode.title, shareUrl]);

  return (
    <div className="flex items-center gap-4">
      <Button type="button" variant="play" size="sm" onClick={onPlay} disabled={!canPlay} icon={<Play />}>Play</Button>
      <Button type="button" variant="play" size="sm" onClick={onShare} icon={<Share2 />}>Share</Button>
    </div>
  );
}
