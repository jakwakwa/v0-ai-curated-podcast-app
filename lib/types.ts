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
  transcript?: string | null;
}

export interface CuratedCollection {
  id: string;
  name: string;
  status: "Draft" | "Saved" | "Generated";
  audioUrl?: string | null;
  sources: PodcastSource[];
  createdAt: Date;
}

export interface FormState {
  success: boolean;
  message: string;
}
