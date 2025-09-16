# GOAL:  Refactor the  generic "User Generated Episode" string in the AudioSheetPlayer SheetDescription section for USER EPISODES ONLY to use dynamically fetched youtube channel name related to the episode's source which is in the prisma db's `user_episode` table using the `youtube_url` keyname. We want the to display the youtube channel name related to the video url, Essentially the creator of the video, in this case channel name will usually be the podcast show's name. 

# Requirement details:

So audio player sheet HERO section in the UI must display the following after your task is completed:

## User Episodes:

 Herotitle: Episode Title - already implemented
Hero subtitle: fetched "The Youtube channel name " displayed in the ui as "@JoeRoganExperience" or "JordanBPeterson" not as url "youtube.com/@joeroganexperience" for instance. 
                OR if fetch fails fallback to raw video youtube url displayed cleanly like "yu.tube/244i0929" without "https://" or  additional querie params "?playlist=" = your task

## Bundle Episodes 
Bundle Episodes  already displays correctly in hero audio sheet at `/`episodes` route, but (not yet) for the recently added bundle episode on `/dashboard` 

Image: from `image_url` - already implemented

- Herotitle: Episode Title/Name  - already implemented

- Hero subtitle:Podcast Show  - already implemented /episodes  but not in /dashboard route for recent bundle episode

---

# Tasks


 1. Task 1: Substitute generic "User Generated Episode" string with proper dynamically fetched youtube channel name.

2.  Be sure to cache this response for a url already fetched as the channel will likely never change and I dont want to call the youtube api for no reason. ttl for instance can be a month, but you can use your best judgement on the duration

3. Fix recent bundle hero section podcast source subtitle as per current `/episodes` episodes



# POSSIBLE ISSUES AND SOLUTIONS

Since we have the youtube url each user episode db row - retreive the podcast source (channel name) using the youtube public api. We only have youtube video urls that we can use from the database, we dont have a the actual channel url, the code example shows how to get the channel name with mutlipart fetch calls.

## Useful Knowledge References / Resources


1. @https://w3things.com/blog/youtube-data-api-v3-fetch-video-data-nodejs/ 

    -We are using nextjs.  Even though the guide explains the youtube v3 publid api for node.js implementation, there should still be many simmilarities to be very useful as a reference:

2. Code Example

- The following is purely as examples and not exact implementation code snippets use it as reference and with caution. Its for referencing only


```typescript
// ..../route.ts
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: videoId } = params;
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
  }

  try {
    // API Call 1: Get video details to find the channel ID
    const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
    const videoResponse = await fetch(videoDetailsUrl);
    const videoData = await videoResponse.json();

    if (!videoResponse.ok || !videoData.items || videoData.items.length === 0) {
      return NextResponse.json({ error: 'Video not found or API error' }, { status: 404 });
    }

    const channelId = videoData.items[0].snippet.channelId;

    // API Call 2: Get channel details using the channel ID
    const channelDetailsUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`;
    const channelResponse = await fetch(channelDetailsUrl);
    const channelData = await channelResponse.json();

    if (!channelResponse.ok || !channelData.items || channelData.items.length === 0) {
      return NextResponse.json({ error: 'Channel details not found' }, { status: 404 });
    }

    const channelName = channelData.items[0].snippet.title;
    return NextResponse.json({ channelName });

  } catch (error) {
    console.error('Error fetching channel data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

```

# Extract the video ID from the URL

To get the video ID from a URL, you'll need to handle several possible YouTube URL formats: 
Standard: https://www.youtube.com/watch?v=**VIDEO_ID**
Shortened: https://youtu.be/**VIDEO_ID**
With extra parameters: https://www.youtube.com/watch?v=**VIDEO_ID**&t=30s 
You can use a simple function to parse the URL and extract the video ID. 
Step 3: Call the API route from a client component
Now, in a client component, create a function to fetch the channel name using the URL. 



```typescript
// app/page.tsx
'use client';
import { useState } from 'react';

// Allowed YouTube hostnames for video extraction/sanitization
const YOUTUBE_HOSTS = ['youtube.com', 'www.youtube.com', 'm.youtube.com'];
const YOUTU_BE_HOSTS = ['youtu.be', 'www.youtu.be'];

// Function to extract video ID from various YouTube URL formats
const extractVideoId = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    if (YOUTUBE_HOSTS.includes(parsedUrl.hostname)) {
      return parsedUrl.searchParams.get('v');
    }
    if (YOUTU_BE_HOSTS.includes(parsedUrl.hostname)) {
      return parsedUrl.pathname.substring(1);
    }
  } catch (e) {
    console.error('Invalid URL:', e);
  }
  return null;
};

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [channelName, setChannelName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchChannelName = async () => {
    setLoading(true);
    setChannelName('');
    setError('');

    const videoId = extractVideoId(url);

    if (!videoId) {
      setError('Invalid YouTube video URL format.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/video/${videoId}`);
      const data = await res.json();

      if (res.ok) {
        setChannelName(data.channelName);
      } else {
        setError(data.error);
      }
    } catch (e) {
      console.error(e);
      setError('Failed to fetch channel information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Fetch YouTube Channel Name from Video URL</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter YouTube video URL"
      />
      <button onClick={fetchChannelName} disabled={loading}>
        {loading ? 'Fetching...' : 'Get Channel Name'}
      </button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {channelName && <p>Channel Name: {channelName}</p>}
    </div>
  );
}
```


### How this example code works

- User input: The user enters a YouTube video URL into the input field.
- Video ID extraction: The extractVideoId function parses the URL and pulls out the video's unique identifier.
- Client-side fetch: The fetchChannelName function makes a secure request to your new, server-side route handler at /api/video/[id].
- Server-side API calls: The route handler performs the two-step process:
- First API call: Requests the /videos endpoint, including the snippet part and the extracted video ID. This returns the video's metadata, which includes the channelId.
- Second API call: Requests the /channels endpoint, including the snippet part and the channelId obtained in the previous step.
- Return channel name: The server extracts the channelName from the channel details and sends it back to the client.
- Display result: The client component receives the channel name and displays it on the page. 
