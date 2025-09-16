import { useEffect, useState } from "react";

interface ChannelData {
	channelName?: string;
	channelImage?: string;
	fallback?: string;
	error?: string;
	cached?: boolean;
}

interface UseYouTubeChannelResult {
	channelName: string | null;
	channelImage: string | null;
	isLoading: boolean;
	error: string | null;
}

export function useYouTubeChannel(youtubeUrl: string | null): UseYouTubeChannelResult {
	const [channelName, setChannelName] = useState<string | null>(null);
	const [channelImage, setChannelImage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!youtubeUrl) {
			setChannelName(null);
			setChannelImage(null);
			setError(null);
			setIsLoading(false);
			return;
		}

		const fetchChannelName = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch(`/api/youtube/channel?url=${encodeURIComponent(youtubeUrl)}`);
				const data: ChannelData = await response.json();

				if (response.ok && data.channelName) {
					setChannelName(data.channelName);
					setChannelImage(data.channelImage || null);
				} else if (data.fallback) {
					// Use fallback cleaned URL
					setChannelName(data.fallback);
					setChannelImage(null);
				} else {
					setError(data.error || "Failed to fetch channel name");
					setChannelName(null);
					setChannelImage(null);
				}
			} catch (err) {
				console.error("Error fetching YouTube channel:", err);
				setError("Network error");
				setChannelName(null);
				setChannelImage(null);
			} finally {
				setIsLoading(false);
			}
		};

		fetchChannelName();
	}, [youtubeUrl]);

	return { channelName, channelImage, isLoading, error };
}
