"use client";

import { ChevronDown, ChevronRight, Loader2, PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VOICE_OPTIONS } from "@/lib/constants/voices";
import { useNotificationStore } from "@/lib/stores";

const EPISODE_LIMIT = 10;
const MAX_DURATION_SECONDS = 60 * 60; // 60 minutes

export function EpisodeCreator() {
	const router = useRouter();
	const { resumeAfterSubmission } = useNotificationStore();

	const [youtubeUrl, setYouTubeUrl] = useState("");
	const [debouncedYoutubeUrl] = useDebounce(youtubeUrl, 500);

	const [youtubeUrlError, setYouTubeUrlError] = useState<string | null>(null);
	const [videoTitle, setVideoTitle] = useState<string | null>(null);
	const [videoDuration, setVideoDuration] = useState<number | null>(null);
	const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);

	const [podcastName, setPodcastName] = useState("");

	// Generation options
	const [generationMode, setGenerationMode] = useState<"single" | "multi">("single");
	const [voiceA, setVoiceA] = useState<string>("Zephyr");
	const [voiceB, setVoiceB] = useState<string>("Kore");
	const [isPlaying, setIsPlaying] = useState<string | null>(null);
	const [audioUrlCache, setAudioUrlCache] = useState<Record<string, string>>({});

	// UX
	const [isCreating, setIsCreating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [usage, setUsage] = useState({ count: 0, limit: EPISODE_LIMIT });
	const [isLoadingUsage, setIsLoadingUsage] = useState(true);

	// Restriction dialog state
	const [showRestrictionDialog, setShowRestrictionDialog] = useState(false);

	// Tips visibility state
	const [showTips, setShowTips] = useState(false);

	const isBusy = isCreating || isFetchingMetadata;
	const isAudioPlaying = isPlaying !== null;
	function isYouTubeUrl(url: string): boolean {
		try {
			const { hostname } = new URL(url);
			const host = hostname.toLowerCase();
			return host === "youtu.be" || host.endsWith(".youtu.be") || host === "youtube.com" || host.endsWith(".youtube.com");
		} catch {
			return false;
		}
	}

	const isDurationValid = videoDuration !== null && videoDuration <= MAX_DURATION_SECONDS;
	const canSubmit = Boolean(videoTitle) && isYouTubeUrl(youtubeUrl) && !isBusy && isDurationValid;

	const fetchUsage = useCallback(async () => {
		try {
			setIsLoadingUsage(true);
			const res = await fetch("/api/user-episodes?count=true");
			if (res.ok) {
				const { count } = await res.json();
				setUsage({ count, limit: EPISODE_LIMIT });
			}
		} catch (error) {
			console.error("Failed to fetch user episodes data:", error);
		} finally {
			setIsLoadingUsage(false);
		}
	}, []);

	useEffect(() => {
		fetchUsage();
	}, [fetchUsage]);

	// Timer effect for restriction dialog
	useEffect(() => {
		let timer: NodeJS.Timeout;

		if (!isLoadingUsage && usage.count >= usage.limit) {
			timer = setTimeout(() => {
				setShowRestrictionDialog(true);
			}, 3000); // 3 second delay
		}

		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [isLoadingUsage, usage.count, usage.limit]);

	useEffect(() => {
		async function fetchMetadata() {
			setYouTubeUrlError(null);
			if (isYouTubeUrl(debouncedYoutubeUrl)) {
				setIsFetchingMetadata(true);
				setVideoTitle(null);
				setVideoDuration(null);
				try {
					const res = await fetch(`/api/youtube-metadata?url=${encodeURIComponent(debouncedYoutubeUrl)}`);
					if (!res.ok) {
						throw new Error("Could not fetch video details. Please check the URL.");
					}
					const { title, duration } = await res.json();
					setVideoTitle(title);
					setVideoDuration(duration);
					if (duration > MAX_DURATION_SECONDS) {
						setYouTubeUrlError(`Video is too long. Please select a video that is 60 minutes or less. This video is ${Math.round(duration / 60)} minutes long.`);
					}
				} catch (err) {
					setYouTubeUrlError(err instanceof Error ? err.message : "An unknown error occurred.");
				} finally {
					setIsFetchingMetadata(false);
				}
			} else {
				setVideoTitle(null);
				setVideoDuration(null);
				if (debouncedYoutubeUrl) {
					setYouTubeUrlError("Please enter a valid YouTube URL.");
				}
			}
		}
		fetchMetadata();
	}, [debouncedYoutubeUrl]);

	async function handleCreate() {
		if (!canSubmit) return;

		setIsCreating(true);
		setError(null);
		try {
			const payload = {
				title: videoTitle,
				youtubeUrl: youtubeUrl,
				podcastName: podcastName || undefined,
				generationMode,
				voiceA,
				voiceB,
			};
			const res = await fetch("/api/user-episodes/create-from-metadata", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) throw new Error(await res.text());
			toast.message("We're processing your episode and will email you when it's ready.", { duration: Infinity, action: { label: "Dismiss", onClick: () => { } } });
			resumeAfterSubmission();
			router.push("/dashboard");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to start episode generation.");
			toast.error((err instanceof Error ? err.message : "Failed to start episode generation.") || "", { duration: Infinity, action: { label: "Dismiss", onClick: () => { } } });
		} finally {
			setIsCreating(false);
		}
	}

	async function playSample(voiceName: string) {
		try {
			setIsPlaying(voiceName);
			const cached = audioUrlCache[voiceName];
			let url = cached;
			if (!url) {
				const res = await fetch(`/api/tts/voice-sample?voice=${encodeURIComponent(voiceName)}`);
				if (!res.ok) throw new Error(await res.text());
				const blob = await res.blob();
				url = URL.createObjectURL(blob);
				setAudioUrlCache(prev => ({ ...prev, [voiceName]: url }));
			}
			const audio = new Audio(url);
			audio.onended = () => setIsPlaying(null);
			await audio.play();
		} catch (err) {
			setIsPlaying(null);
			console.error("Failed to play sample", err);
			toast.error("Could not load voice sample");
		}
	}

	const hasReachedLimit = usage.count >= usage.limit;
	const handleUpgradeMembership = () => router.push("/manage-membership");
	const handleGoBack = () => router.back();

	return (
		<div className="w-full h-auto mb-0 px-4 py-4 md:px-8 lg:px-10 lg:py-12">
			<div className="w-full flex flex-col gap-3 md:gap-8">
				<CardHeader>
					<h1 className="text-xl text-foreground font-bold mb-2  md:mb-4">Generate a custom episode</h1>
					<CardDescription>Provide a YouTube link. We'll handle the rest in the background.</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoadingUsage ? (
						<p>Loading usage data...</p>
					) : hasReachedLimit ? (
						<p className="text-amber-500">
							<span className="mr-3">⚠️</span>You have reached your monthly limit for episode creation.
						</p>
					) : (
						<form
							className="space-y-6 w-full"
							onSubmit={e => {
								e.preventDefault();
								void handleCreate();
							}}>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2 md:col-span-2">
									<Label htmlFor="youtubeUrl">YouTube URL (Max 60 minutes)</Label>
									<Input id="youtubeUrl" placeholder="https://www.youtube.com/..." value={youtubeUrl} onChange={e => setYouTubeUrl(e.target.value)} disabled={isBusy} required />
									{isFetchingMetadata && (
										<p className="text-sm text-muted-foreground flex items-center mt-2">
											<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Fetching video details...
										</p>
									)}
									{youtubeUrlError && <p className="text-red-500 text-sm mt-2">{youtubeUrlError}</p>}
								</div>

								{videoTitle && (
									<div className="space-y-2 md:col-span-2 bg-muted/50 p-4 rounded-lg border">
										<Label>Episode Title</Label>
										<p className="text-foreground font-semibold">{videoTitle}</p>
										{videoDuration !== null && (
											<p className="text-sm text-muted-foreground">
												Duration: {Math.floor(videoDuration / 60)}m {videoDuration % 60}s
											</p>
										)}
									</div>
								)}
							</div>

							<div className="hidden not-only:grid-cols-1 gap-4">
								<div className="space-y-2">
									<Label htmlFor="podcastName">Podcast Name (optional)</Label>
									<Input id="podcastName" placeholder="Podcast show name" value={podcastName} onChange={e => setPodcastName(e.target.value)} disabled={isBusy} />
								</div>
							</div>

							<div className="space-y-6 border border-[#0c525b6f] rounded-md md:rounded-xl shadow-md px-6 py-4 bg-[#000]/20">
								<div className="space-y-2">
									<Label size="lg">Voice Settings</Label>
									<div className="flex flex-row gap-3 mt-4">
										<Button type="button" variant={generationMode === "single" ? "default" : "outline"} onClick={() => setGenerationMode("single")} disabled={isBusy} className="px-4">
											Single speaker
										</Button>
										<Button type="button" variant={generationMode === "multi" ? "default" : "outline"} onClick={() => setGenerationMode("multi")} disabled={isBusy} className="px-4">
											Multi speaker
										</Button>
									</div>
									<button
										type="button"
										onClick={() => setShowTips(!showTips)}
										className="flex mt-4 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-3">
										{showTips ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}💡 Helpful Tips
									</button>

									{showTips && (
										<div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
											<p className="text-xs text-foreground">
												Both options can handle 90% of any youtube URL you provide! The quality of your generated episode depends on the content you choose to upload. These tips can help you decide if
												you're unsure:
											</p>
											<ul className="space-y-2 leading-relaxed text-foreground text-xs mt-1">
												<li className="flex items-start gap-2">
													<span className="text-orange-500 mt-1">⏱️</span>
													<span>
														<strong className="text-teal-500 ">For videos over 2 hours:</strong> We recommend Single Speaker for faster processing and guaranteed success
													</span>
												</li>
												<li className="flex items-start gap-2">
													<span className="text-blue-500 mt-1">⚡</span>
													<span>
														<strong className="text-teal-500">Single Speaker</strong> processes faster and is ideal for solo presentations, tutorials, or monologues
													</span>
												</li>
												<li className="flex items-start gap-2">
													<span className="text-green-200 mt-1">🎙️</span>
													<span>
														<strong className="text-teal-500">Multi Speaker</strong> results will be generated into two speaker conversational podcast syled episode. For more engaging information
														consumption. May not be suite for all types of content.
													</span>
												</li>

												<li className="flex items-start gap-2">
													<span className="text-purple-500 mt-1">🎯</span>
													<span>
														<strong className="text-teal-500">Best results come from:</strong> Clear audio, minimal background noise, and well-structured content
													</span>
												</li>
												<li className="flex items-start gap-2">
													<span className="text-red-500 mt-1">⚠️</span>
													<span>
														<strong className="text-amber-500">Avoid:</strong> Music-heavy content, very fast speech, or videos with poor audio quality
													</span>
												</li>
												<li className="flex items-start gap-2">
													<span className="text-indigo-500 mt-1">💡</span>
													<span>
														<strong className="text-indigo-400">Pro tip:</strong> If you're unsure, start with Single Speaker - it's our most reliable option for any content type
													</span>
												</li>
											</ul>
										</div>
									)}
								</div>

								{generationMode === "multi" && (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<div className="py-0 text-[#b4edf1] text-sm">Voice A</div>
											<Select value={voiceA} onValueChange={setVoiceA}>
												<SelectTrigger className="w/full" disabled={isBusy}>
													<SelectValue placeholder="Select Voice A" />
												</SelectTrigger>
												<SelectContent>
													{VOICE_OPTIONS.map(v => (
														<SelectItem key={v.name} value={v.name}>
															<div className="flex items-center justify-between w/full gap-3 ">
																<div className="flex flex-col">
																	<span>{v.label}</span>
																	{/* <span className="text-xs opacity-75">{v.sample}</span> */}
																</div>
																<button
																	type="button"
																	onMouseDown={e => e.preventDefault()}
																	onClick={e => {
																		e.stopPropagation();
																		void playSample(v.name);
																	}}
																	aria-label={`Play ${v.name} sample`}
																	className="inline-flex items-center gap-1 text-xs opacity-80 hover:opacity-100"></button>
															</div>
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<div className="mt-2">
												<Button type="button" variant="outline" size="sm" onClick={() => void playSample(voiceA)} disabled={isBusy || isAudioPlaying}>
													<PlayCircle className="mr-2 h-4 w-4" /> {isPlaying === voiceA ? "Playing" : "Play sample"}
												</Button>
											</div>
										</div>
										<div>
											<div className="py-0 text-[#d1b2f2] text-sm">Voice B</div>
											<Select value={voiceB} onValueChange={setVoiceB}>
												<SelectTrigger className="w/full" disabled={isBusy}>
													<SelectValue placeholder="Select Voice B" />
												</SelectTrigger>
												<SelectContent>
													{VOICE_OPTIONS.map(v => (
														<SelectItem key={v.name} value={v.name}>
															<div className="flex items-center justify-between w/full gap-3">
																<div className="flex flex-col">
																	<span>{v.label}</span>
																	{/* <span className="text-xs opacity-75">{v.sample}</span> */}
																</div>
																<button
																	type="button"
																	onMouseDown={e => e.preventDefault()}
																	onClick={e => {
																		e.stopPropagation();
																		void playSample(v.name);
																	}}
																	aria-label={`Play ${v.name} sample`}
																	className="inline-flex items-center gap-1 text-xs opacity-80 hover:opacity-100"></button>
															</div>
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<div className="mt-2">
												<Button type="button" variant="outline" size="sm" onClick={() => void playSample(voiceB)} disabled={isBusy || isAudioPlaying}>
													<PlayCircle className="mr-2 h-4 w-4" /> {isPlaying === voiceB ? "Playing" : "Play sample"}
												</Button>
											</div>
										</div>
									</div>
								)}
							</div>

							<Button type="submit" variant="secondary" disabled={!canSubmit} className="w-full p-4">
								{isCreating ? "Creating..." : "Create & Generate"}
							</Button>
						</form>
					)}
					{error && <p className="text-red-500 mt-4">{error}</p>}
				</CardContent>
			</div>

			<Dialog open={showRestrictionDialog} onOpenChange={() => { }} modal={true}>
				<DialogContent className="sm:max-w-md" onInteractOutside={e => e.preventDefault()} onEscapeKeyDown={e => e.preventDefault()}>
					<DialogHeader>
						<DialogTitle className="text-center text-xl">Episode Creation Limit Reached</DialogTitle>
						<DialogDescription className="text-center space-y-4">
							<p>You've reached your monthly limit of {usage.limit} episodes for your current membership plan.</p>
							<p className="font-medium">To create more episodes, you'll need to upgrade your membership to unlock higher limits and premium features.</p>
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-3 mt-6">
						<Button onClick={handleUpgradeMembership} className="w-full" size="lg" variant={"link"}>
							Upgrade Membership
						</Button>
						<Button onClick={handleGoBack} variant="outline" className="w-full" size="lg">
							Go Back
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
