"use client";

import { ChevronDown, ChevronUp, Loader2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatTime } from "@/components/ui/audio-player.disabled";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { Episode, UserEpisode } from "@/lib/types";

type AudioPlayerSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	episode: Episode | UserEpisode | null;
	onClose?: () => void;
};

export const AudioPlayerSheet: FC<AudioPlayerSheetProps> = ({ open, onOpenChange, episode }) => {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [_currentTime, setCurrentTime] = useState(0);
	const [_duration, setDuration] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [volume, setVolume] = useState(1);
	const [isMuted, setIsMuted] = useState(false);
	const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false);
	const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const pendingPlayRef = useRef(false);
	const canPlayDebounceRef = useRef<NodeJS.Timeout | null>(null);

	const clearCanPlayDebounce = useCallback(() => {
		if (canPlayDebounceRef.current) {
			clearTimeout(canPlayDebounceRef.current);
			canPlayDebounceRef.current = null;
		}
	}, []);

	const clearLoadingTimeout = useCallback(() => {
		if (loadingTimeoutRef.current) {
			clearTimeout(loadingTimeoutRef.current);
			loadingTimeoutRef.current = null;
		}
	}, []);

	const setLoadingWithTimeout = useCallback(
		(loading: boolean) => {
			clearLoadingTimeout();
			setIsLoading(loading);

			if (loading) {
				// Set a 5-second timeout to clear loading state as fallback
				loadingTimeoutRef.current = setTimeout(() => {
					console.log("AudioPlayerSheet - Loading timeout, clearing loading state");
					setIsLoading(false);
					loadingTimeoutRef.current = null;
				}, 5000);
			}
		},
		[clearLoadingTimeout]
	);

	// Clean up timeout on unmount
	useEffect(() => {
		return () => clearLoadingTimeout();
	}, [clearLoadingTimeout]);

	const audioSrc = useMemo(() => {
		if (!episode) {
			console.log("AudioPlayerSheet - No episode provided");
			return "";
		}

		let src = "";
		if ("audio_url" in episode && episode.audio_url) {
			src = episode.audio_url;
			console.log("AudioPlayerSheet - Using audio_url:", src);
		} else if ("gcs_audio_url" in episode && episode.gcs_audio_url) {
			src = episode.gcs_audio_url;
			console.log("AudioPlayerSheet - Using gcs_audio_url:", src);
		} else {
			console.warn("AudioPlayerSheet - No audio source found in episode:", episode);
		}

		return src;
	}, [episode]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
		const handleLoadedMetadata = () => {
			console.log("AudioPlayerSheet - Audio loaded metadata, duration:", audio.duration);
			setDuration(audio.duration || 0);
			// Keep loading until actual playback starts
		};
		const handleEnded = () => {
			console.log("AudioPlayerSheet - Audio playback ended");
			setIsPlaying(false);
			setCurrentTime(0);
			pendingPlayRef.current = false;
			clearLoadingTimeout();
			setIsLoading(false);
		};
		const handleError = (e: Event) => {
			console.error("AudioPlayerSheet - Audio error event:", e, { audioSrc });
			pendingPlayRef.current = false;
			clearLoadingTimeout();
			setIsLoading(false);
			setIsPlaying(false);
		};
		const handleCanPlay = () => {
			console.log("AudioPlayerSheet - Audio can play, readyState:", audio.readyState);
			// If a play was requested while not ready, try again now
			if (pendingPlayRef.current && audio.paused) {
				void audio.play().catch(err => {
					console.error("AudioPlayerSheet - play() retry on canplay failed:", err);
					pendingPlayRef.current = false;
					clearLoadingTimeout();
					setIsLoading(false);
				});
			}
			// Debounce clearing loading on canplay to avoid flicker for signed URLs
			clearCanPlayDebounce();
			canPlayDebounceRef.current = setTimeout(() => {
				// If we still aren't playing after a short grace period, clear loading
				if (!audio.paused || audio.readyState >= 3) {
					clearLoadingTimeout();
					setIsLoading(false);
				}
				canPlayDebounceRef.current = null;
			}, 250);
		};
		const handleLoadStart = () => {
			console.log("AudioPlayerSheet - Audio load started");
			clearCanPlayDebounce();
			setLoadingWithTimeout(true);
		};
		const handlePlay = () => {
			console.log("AudioPlayerSheet - Audio play event");
			pendingPlayRef.current = false;
			setIsPlaying(true);
			clearLoadingTimeout();
			setIsLoading(false);
			clearCanPlayDebounce();
		};
		const handlePlaying = () => {
			console.log("AudioPlayerSheet - Audio playing event");
			pendingPlayRef.current = false;
			setIsPlaying(true);
			clearLoadingTimeout();
			setIsLoading(false);
			clearCanPlayDebounce();
		};
		const handlePause = () => {
			console.log("AudioPlayerSheet - Audio pause event");
			setIsPlaying(false);
			clearCanPlayDebounce();
		};
		const handleSeeking = () => {
			console.log("AudioPlayerSheet - Audio seeking");
			clearCanPlayDebounce();
			setLoadingWithTimeout(true);
		};
		const handleSeeked = () => {
			console.log("AudioPlayerSheet - Audio seeked");
			if (!audio.paused) {
				clearLoadingTimeout();
				setIsLoading(false);
			}
			clearCanPlayDebounce();
		};

		console.log("AudioPlayerSheet - useEffect [open, audioSrc]:", { open, audioSrc });

		// Add event listeners once per mount of this effect
		audio.addEventListener("timeupdate", handleTimeUpdate);
		audio.addEventListener("loadedmetadata", handleLoadedMetadata);
		audio.addEventListener("ended", handleEnded);
		audio.addEventListener("error", handleError);
		audio.addEventListener("canplay", handleCanPlay);
		audio.addEventListener("loadstart", handleLoadStart);
		audio.addEventListener("play", handlePlay);
		audio.addEventListener("playing", handlePlaying);
		audio.addEventListener("pause", handlePause);
		audio.addEventListener("waiting", handleLoadStart);
		audio.addEventListener("seeking", handleSeeking);
		audio.addEventListener("seeked", handleSeeked);

		if (open && audioSrc) {
			if (audio.src !== audioSrc) {
				console.log("AudioPlayerSheet - Setting up audio with source:", audioSrc);
				audio.src = audioSrc;
			}
			// Ensure the element preloads for snappier start
			audio.preload = "auto";
			// Reset loading state when setting up new audio
			pendingPlayRef.current = false;
			clearLoadingTimeout();
			setIsLoading(false);
			// Do not call audio.load() here to avoid cancelling a user-initiated play()
		} else if (!(open || audio.paused)) {
			console.log("AudioPlayerSheet - Sheet closed, pausing audio");
			audio.pause();
			pendingPlayRef.current = false;
			setIsPlaying(false);
			clearLoadingTimeout();
			setIsLoading(false);
		}

		return () => {
			audio.removeEventListener("timeupdate", handleTimeUpdate);
			audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
			audio.removeEventListener("ended", handleEnded);
			audio.removeEventListener("error", handleError);
			audio.removeEventListener("canplay", handleCanPlay);
			audio.removeEventListener("loadstart", handleLoadStart);
			audio.removeEventListener("play", handlePlay);
			audio.removeEventListener("playing", handlePlaying);
			audio.removeEventListener("pause", handlePause);
			audio.removeEventListener("waiting", handleLoadStart);
			audio.removeEventListener("seeking", handleSeeking);
			audio.removeEventListener("seeked", handleSeeked);
			clearCanPlayDebounce();
		};
	}, [open, audioSrc, clearLoadingTimeout, setLoadingWithTimeout, clearCanPlayDebounce]);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = isMuted ? 0 : Math.max(0, Math.min(1, volume));
		}
	}, [volume, isMuted]);

	const togglePlayPause = async () => {
		const audio = audioRef.current;
		if (!(audio && audioSrc)) {
			console.warn("AudioPlayerSheet - togglePlayPause: Missing audio element or audioSrc", { audio: !!audio, audioSrc });
			return;
		}

		console.log("AudioPlayerSheet - togglePlayPause:", { isPlaying, audioSrc, readyState: audio.readyState, paused: audio.paused });

		try {
			const isActuallyPaused = audio.paused;
			if (!isActuallyPaused) {
				console.log("AudioPlayerSheet - Pausing audio");
				audio.pause();
				setIsPlaying(false);
				pendingPlayRef.current = false;
				clearLoadingTimeout();
				setIsLoading(false);
			} else {
				// Ensure source is applied immediately on first interaction
				if (audio.src !== audioSrc) {
					console.log("AudioPlayerSheet - Applying src before play:", audioSrc);
					audio.src = audioSrc;
				}
				// If media is not ready, show loading and mark a pending play intent
				if (audio.readyState < 2) {
					console.log("AudioPlayerSheet - Audio not ready, showing loading state");
					setLoadingWithTimeout(true);
				}
				pendingPlayRef.current = true;
				if (audio.paused) {
					console.log("AudioPlayerSheet - Playing audio (audio was paused)");
					const playPromise = audio.play();
					if (playPromise && typeof (playPromise as Promise<void>).then === "function") {
						playPromise
							.then(() => {
								console.log("AudioPlayerSheet - play() promise resolved");
								// Ensure UI is responsive even if 'playing' event is delayed
								pendingPlayRef.current = false;
								setIsPlaying(true);
								clearLoadingTimeout();
								setIsLoading(false);
							})
							.catch((err: unknown) => {
								console.error("AudioPlayerSheet - Audio play() failed:", err);
								pendingPlayRef.current = false;
								setIsPlaying(false);
								clearLoadingTimeout();
								setIsLoading(false);
							});
					}
				} else {
					console.log("AudioPlayerSheet - Audio not paused, setting playing intent");
					// If already playing but state out of sync, rely on 'playing' event to correct
					pendingPlayRef.current = true;
				}
			}
		} catch (error) {
			console.error("AudioPlayerSheet - Audio Player Error:", error);
			setIsPlaying(false);
			pendingPlayRef.current = false;
			clearLoadingTimeout();
			setIsLoading(false);

			// Try to reload if play failed (fallback)
			if (!isPlaying) {
				console.log("AudioPlayerSheet - Reloading audio after play failure");
				setLoadingWithTimeout(true);
				audio.load();
			}
		}
	};

	const progressPercent = useMemo(() => {
		return _duration > 0 ? Math.max(0, Math.min(100, (_currentTime / _duration) * 100)) : 0;
	}, [_currentTime, _duration]);

	const formattedCurrent = useMemo(() => formatTime(_currentTime), [_currentTime]);
	const formattedDuration = useMemo(() => formatTime(_duration), [_duration]);

	const seekToClientX = (clientX: number, target: HTMLDivElement) => {
		const rect = target.getBoundingClientRect();
		const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
		const newTime = ratio * (_duration || 0);
		if (audioRef.current && _duration) {
			audioRef.current.currentTime = newTime;
			setCurrentTime(newTime);
		}
	};

	const handleProgressClick: React.MouseEventHandler<HTMLDivElement> = e => {
		if (!_duration) return;
		seekToClientX(e.clientX, e.currentTarget);
	};

	const handleProgressKeyDown: React.KeyboardEventHandler<HTMLDivElement> = e => {
		if (!(_duration && audioRef.current)) return;
		const step = 5; // seconds
		let newTime = _currentTime;
		switch (e.key) {
			case "ArrowRight":
				newTime = Math.min(_duration, _currentTime + step);
				break;
			case "ArrowLeft":
				newTime = Math.max(0, _currentTime - step);
				break;
			case "Home":
				newTime = 0;
				break;
			case "End":
				newTime = _duration;
				break;
			default:
				return; // ignore other keys
		}
		e.preventDefault();
		audioRef.current.currentTime = newTime;
		setCurrentTime(newTime);
	};

	// Volume interactions
	const volumePercent = Math.round((isMuted ? 0 : volume) * 100);

	const setVolumeFromClientX = (clientX: number, target: HTMLDivElement) => {
		const rect = target.getBoundingClientRect();
		const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
		setIsMuted(ratio === 0);
		setVolume(ratio);
	};

	const handleVolumeClick: React.MouseEventHandler<HTMLDivElement> = e => {
		setVolumeFromClientX(e.clientX, e.currentTarget);
	};

	const handleVolumeKeyDown: React.KeyboardEventHandler<HTMLDivElement> = e => {
		const step = 0.05;
		let next = isMuted ? 0 : volume;
		switch (e.key) {
			case "ArrowRight":
				next = Math.min(1, next + step);
				break;
			case "ArrowLeft":
				next = Math.max(0, next - step);
				break;
			case "Home":
				next = 0;
				break;
			case "End":
				next = 1;
				break;
			default:
				return;
		}
		e.preventDefault();
		setIsMuted(next === 0);
		setVolume(next);
	};

	const toggleMute = () => {
		setIsMuted(m => !m);
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="bg-[#0d0f14] p-0 text-[var(--audio-sheet-foreground)] w-full sm:w-[430px] md:min-w-[500px] gap-0">
				{/* Sections */}
				<div className="hero-bg h-full min-h-[320px] items-center flex-col">
					{/* Hero background per Figma (radial + overlay) */}
					{/* Artwork + Meta */}
					<div className="flex flex-col items-center justify-center px-0 align-middle justify-centre py-10 w-full">
						{episode && "image_url" in episode && episode.image_url && (
							<Image
								src={episode.image_url}
								alt={episode.title}
								width={56}
								height={56}
								className="h-full w-fit max-h-[120px] shrink-0 rounded-[19.8347px] object-cover shadow-[0px_5.607px_5.607px_rgba(0,0,0,0.3),0px_11.2149px_16.8224px_8.4112px_rgba(0,0,0,0.15)]"
							/>
						)}
					</div>
					<SheetHeader>
						<SheetTitle className="truncate text-[17.64px] font-bold leading-[1.9] tracking-[0.009375em] text-white/70 text-center">
							{episode ? ("title" in episode ? episode.title : episode.episode_title) : "Episode title"}
						</SheetTitle>
						<SheetDescription className="truncate text-[14.69px] font-semibold leading-[1.72857] tracking-[0.007142em] text-[#88B0B9] text-center">
							{episode ? ("description" in episode ? episode.description : "User Generated Episode") : "Podcast source"}
						</SheetDescription>
					</SheetHeader>
				</div>

				<div className="bg-sidebar rounded-none max-h-[300px] pt-10 px-12">
					{/* Transcript */}
					{episode && (("transcript" in episode && episode.transcript) || ("summary" in episode && episode.summary)) && (
						<div className="flex flex-col gap-[10px]">
							<div className="flex items-center justify-between">
								<h3 className="text-[14px] font-semibold text-[var(--audio-sheet-foreground)]">Episode Transcript</h3>
								<button
									type="button"
									onClick={() => setIsTranscriptExpanded(!isTranscriptExpanded)}
									className="flex items-center gap-1 text-[12px] text-[var(--audio-sheet-foreground)]/70 hover:text-[var(--audio-sheet-foreground)] transition-colors">
									{isTranscriptExpanded ? "Show Less" : "Show More"}
									{isTranscriptExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
								</button>
							</div>
							<div
								className={`overflow-y-auto rounded-[8px] p-[12px] text-[14px] leading-[1.8] text-[var(--audio-sheet-foreground)]/80 transition-all ${isTranscriptExpanded ? "max-h-[600px]" : "max-h-[150px]"
									}`}>
								{("transcript" in episode && episode.transcript) || ("summary" in episode && episode.summary)}
							</div>
						</div>
					)}
				</div>

				<div className=" w-ful h-full flex bg-[#020106]  p-8 flex-col my-0 gap-8">
					{/* Controls */}
					<div className="flex items-center justify-center">
						<button
							type="button"
							aria-label={isLoading ? "Loading..." : isPlaying ? "Pause" : "Play"}
							aria-pressed={isPlaying}
							onClick={togglePlayPause}
							disabled={!audioSrc || isLoading}
							className="inline-flex h-[48px] w-[48px] items-center justify-center rounded-[14px] border border-[var(--audio-sheet-border)] bg-[radial-gradient(circle_at_30%_18%,rgba(82,167,151,0.99)_0%,rgba(80,84,205,0.42)_100%)] text-sm font-semibold shadow-[0px_1px_3px_rgba(0,0,0,0.3),0px_4px_8px_3px_rgba(0,0,0,0.15)] transition-all hover:brightness-110 active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--audio-sheet-accent)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--audio-sheet-bg)] disabled:opacity-50 disabled:cursor-not-allowed">
							{isLoading ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : isPlaying ? <Pause className="h-[18px] w-[18px]" /> : <Play className="h-[18px] w-[18px]" />}
						</button>
					</div>

					{/* Progress */}
					<div className="flex items-center gap-[16px]">
						<span className="w-[27.2px] text-center text-[10px] tabular-nums opacity-90" aria-live="polite">
							{formattedCurrent}
						</span>
						<div
							role="slider"
							aria-label="Seek"
							aria-valuemin={0}
							aria-valuemax={Math.floor(_duration || 0)}
							aria-valuenow={Math.floor(_currentTime || 0)}
							tabIndex={0}
							onClick={handleProgressClick}
							onKeyDown={handleProgressKeyDown}
							className="group relative h-[5px] w-full rounded-[11px] bg-[#523A3A] transition-colors">
							<div
								className="absolute inset-y-0 left-0 rounded-[11px] transition-all"
								style={{ width: `${progressPercent}%`, background: "linear-gradient(90deg, rgba(91,47,142,1) 0%, rgba(25,178,117,0.81) 40%, rgba(101,199,231,1) 100%)" }}
							/>
						</div>
						<span className="w-[32px] text-center text-[10px] tabular-nums opacity-70">{formattedDuration}</span>
					</div>

					{/* Volume */}
					<div className="audio-player flex items-center justify-center gap-[12px]">
						<button
							type="button"
							aria-label={isMuted ? "Unmute" : "Mute"}
							aria-pressed={isMuted}
							onClick={toggleMute}
							className="inline-flex h-[28px] w-[28px] items-center justify-center rounded-[8px] border border-[var(--audio-sheet-border)] bg-transparent text-xs transition-colors hover:bg-[var(--audio-sheet-border)]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--audio-sheet-accent)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--audio-sheet-bg)]">
							{isMuted ? <VolumeX className="h-[16px] w-[16px]" /> : <Volume2 className="h-[16px] w-[16px]" />}
						</button>
						<div
							role="slider"
							aria-label="Volume"
							aria-valuemin={0}
							aria-valuemax={100}
							aria-valuenow={volumePercent}
							tabIndex={0}
							onClick={handleVolumeClick}
							onKeyDown={handleVolumeKeyDown}
							className="group relative h-[5px] w-[160px] rounded-[11px] bg-[var(--audio-sheet-border)]/40 transition-colors hover:bg-[var(--audio-sheet-border)]/30">
							<div className="absolute inset-y-0 left-0 rounded-[11px] bg-[var(--audio-sheet-foreground)]/50 transition-all" style={{ width: `${volumePercent}%` }} />
						</div>
					</div>
				</div>
				{/* Hidden audio element */}
				<audio ref={audioRef} className="hidden">
					<track kind="captions" />
				</audio>
			</SheetContent>
		</Sheet>
	);
};
