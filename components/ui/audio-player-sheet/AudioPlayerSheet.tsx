"use client";

import { ChevronDown, ChevronUp, Pause, Play, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import type { FC } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
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
	const [volume, setVolume] = useState(1);
	const [isMuted, setIsMuted] = useState(false);
	const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false);

	const audioSrc = useMemo(() => {
		if (!episode) return "";
		
		let src = "";
		if ("audio_url" in episode && episode.audio_url) {
			src = episode.audio_url;
		} else if ("gcs_audio_url" in episode && episode.gcs_audio_url) {
			src = episode.gcs_audio_url;
		}
		
		// Debug logging
		console.log("AudioPlayerSheet - Episode:", episode);
		console.log("AudioPlayerSheet - Detected audioSrc:", src);
		
		return src;
	}, [episode]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
		const handleLoadedMetadata = () => setDuration(audio.duration || 0);
		const handleEnded = () => {
			setIsPlaying(false);
			setCurrentTime(0);
		};
		const handleError = () => {
			console.error("Audio failed to load", { audioSrc });
		};

		audio.addEventListener("timeupdate", handleTimeUpdate);
		audio.addEventListener("loadedmetadata", handleLoadedMetadata);
		audio.addEventListener("ended", handleEnded);
		audio.addEventListener("error", handleError);

		return () => {
			audio.removeEventListener("timeupdate", handleTimeUpdate);
			audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
			audio.removeEventListener("ended", handleEnded);
			audio.removeEventListener("error", handleError);
		};
	}, [audioSrc]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		
		if (open && audioSrc) {
			// Only reload if the source has actually changed
			if (audio.src !== audioSrc) {
				audio.src = audioSrc;
				audio.load();
			}
			setIsPlaying(false);
		} else if (!open && !audio.paused) {
			// Only pause if currently playing
			audio.pause();
			setIsPlaying(false);
		}
	}, [open, audioSrc]);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = isMuted ? 0 : Math.max(0, Math.min(1, volume));
		}
	}, [volume, isMuted]);

	const togglePlayPause = async () => {
		const audio = audioRef.current;
		if (!(audio && audioSrc)) return;
		
		try {
			if (isPlaying) {
				audio.pause();
				setIsPlaying(false);
			} else {
				// Ensure audio is ready before attempting to play
				if (audio.readyState < 2) {
					// Wait for audio to be ready
					await new Promise((resolve, reject) => {
						const onCanPlay = () => {
							audio.removeEventListener('canplay', onCanPlay);
							audio.removeEventListener('error', onError);
							resolve(void 0);
						};
						const onError = () => {
							audio.removeEventListener('canplay', onCanPlay);
							audio.removeEventListener('error', onError);
							reject(new Error('Audio failed to load'));
						};
						audio.addEventListener('canplay', onCanPlay);
						audio.addEventListener('error', onError);
						
						// If already ready, resolve immediately
						if (audio.readyState >= 2) {
							onCanPlay();
						}
					});
				}
				
				await audio.play();
				setIsPlaying(true);
			}
		} catch (err) {
			console.error("Audio play/pause failed", err);
			setIsPlaying(false);
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
								alt={"title" in episode ? episode.title : "Episode artwork"}
								width={56}
								height={56}
								className="h-full w-fit max-h-[120px] shrink-0 rounded-[19.8347px] object-cover shadow-[0px_5.607px_5.607px_rgba(0,0,0,0.3),0px_11.2149px_16.8224px_8.4112px_rgba(0,0,0,0.15)]"
							/>
						)}
					</div>
					<SheetHeader>
						<SheetTitle className="truncate text-[17.64px] font-bold leading-[1.9] tracking-[0.009375em] text-white/70 text-center">
							{episode && "title" in episode ? episode.title : "Episode title"}
						</SheetTitle>
						<SheetDescription className="truncate text-[14.69px] font-semibold leading-[1.72857] tracking-[0.007142em] text-[#88B0B9] text-center">
							{episode && "description" in episode ? episode.description : "Podcast source"}
						</SheetDescription>
					</SheetHeader>
				</div>

				<div className="bg-sidebar rounded-none max-h-[300px] pt-10 px-12">

					{/* Transcript */}
					{episode && (
						(("transcript" in episode && episode.transcript) || ("summary" in episode && episode.summary)) && (
							<div className="flex flex-col gap-[10px]">
								<div className="flex items-center justify-between">
									<h3 className="text-[14px] font-semibold text-[var(--audio-sheet-foreground)]">Episode Transcript</h3>
									<button
										type="button"
										onClick={() => setIsTranscriptExpanded(!isTranscriptExpanded)}
										className="flex items-center gap-1 text-[12px] text-[var(--audio-sheet-foreground)]/70 hover:text-[var(--audio-sheet-foreground)] transition-colors"
									>
										{isTranscriptExpanded ? "Show Less" : "Show More"}
										{isTranscriptExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
									</button>
								</div>
								<div className={`overflow-y-auto rounded-[8px] p-[12px] text-[14px] leading-[1.8] text-[var(--audio-sheet-foreground)]/80 transition-all ${
									isTranscriptExpanded ? "max-h-[600px]" : "max-h-[150px]"
								}`}>
									{("transcript" in episode && episode.transcript) || ("summary" in episode && episode.summary)}
								</div>
							</div>
						)
					)}

				</div>


				<div className=" w-ful h-full flex bg-[#020106]  p-8 flex-col my-0 gap-8">

					{/* Controls */}
					<div className="flex items-center justify-center">
						<button
							type="button"
							aria-label={isPlaying ? "Pause" : "Play"}
							aria-pressed={isPlaying}
							onClick={togglePlayPause}
							disabled={!audioSrc}
							className="inline-flex h-[48px] w-[48px] items-center justify-center rounded-[14px] border border-[var(--audio-sheet-border)] bg-[radial-gradient(circle_at_30%_18%,rgba(82,167,151,0.99)_0%,rgba(80,84,205,0.42)_100%)] text-sm font-semibold shadow-[0px_1px_3px_rgba(0,0,0,0.3),0px_4px_8px_3px_rgba(0,0,0,0.15)] transition-all hover:brightness-110 active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--audio-sheet-accent)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--audio-sheet-bg)] disabled:opacity-50 disabled:cursor-not-allowed">
							{isPlaying ? <Pause className="h-[18px] w-[18px]" /> : <Play className="h-[18px] w-[18px]" />}
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
		</Sheet >
	);
};
