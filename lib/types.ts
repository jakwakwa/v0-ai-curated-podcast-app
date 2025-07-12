export interface Podcast {
  id: string;
  title: string;
  date: string;
  status: "Completed" | "Processing" | "Failed";
  duration: string;
  audioUrl: string | null;
}

export interface PodcastSource {
  id: string;
  name: string;
  url: string;
  imageUrl: string;
}

export interface CuratedCollection {
  id: string;
  name: string;
  status: "Draft" | "Saved";
  sources: PodcastSource[];
}
