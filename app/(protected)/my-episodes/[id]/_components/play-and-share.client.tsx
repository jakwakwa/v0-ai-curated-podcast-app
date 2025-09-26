"use client";

import { Play, Share2 } from "lucide-react";
import { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { UserEpisode } from "@/lib/types";
import { useAudioPlayerStore } from "@/store/audioPlayerStore";

export default function PlayAndShare({ episode, canPlay }: { episode: UserEpisode; canPlay: boolean }) {
	const { setEpisode } = useAudioPlayerStore();

	const shareUrl = useMemo(() => {
		if (typeof window === "undefined") return "";
		const url = new URL(window.location.href);
		return url.toString();
	}, []);

	const onPlay = useCallback(() => {
		if (!canPlay) return;
		setEpisode(episode);
	}, [canPlay, episode, setEpisode]);

	const onShare = useCallback(async () => {
		try {
			if (navigator.share) {
				await navigator.share({ title: episode.episode_title, url: shareUrl });
				return;
			}
			await navigator.clipboard.writeText(shareUrl);
			// Optional: you can toast here, but avoiding extra deps
			console.log("Copied link:", shareUrl);
		} catch (e) {
			console.warn("Share failed", e);
		}
	}, [episode.episode_title, shareUrl]);

	return (
		<div className="flex items-center gap-4">
			<Button type="button" variant="play" size="playLarge" onClick={onPlay} disabled={!canPlay} icon={<Play />}>
				Play
			</Button>
			<Button type="button" variant="play" size="playLarge" onClick={onShare} icon={<Share2 />}>
				Share
			</Button>
		</div>
	);
}
