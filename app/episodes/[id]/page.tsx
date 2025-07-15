import { notFound } from "next/navigation";
import AudioPlayer from "@/components/ui/audio-player"; // Import as default
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getEpisodes } from "@/lib/data";
import { Suspense } from "react";

interface EpisodePageProps {
  params: { id: string };
}

const EpisodeDetailPage = async ({ params }: EpisodePageProps) => {
  const episodes = await getEpisodes(); // Fetch all episodes to find the one by ID
  const episode = episodes.find((ep) => ep.id === params.id);

  if (!episode) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{episode.title}</CardTitle>
          {episode.publishedAt && (
            <CardDescription>
              Published: {new Date(episode.publishedAt).toLocaleDateString()}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {episode.imageUrl && (
            // biome-ignore lint/a11y/imgAltText: <explanation>
            <img
              src={episode.imageUrl}
              alt={episode.title}
              className="w-full h-auto object-cover rounded-md mb-4"
            />
          )}
          <p className="text-muted-foreground mb-4">{episode.description}</p>
          {episode.audioUrl ? (
            <AudioPlayer episode={episode} /> // Pass the entire episode object
          ) : (
            <p className="text-red-500">Audio not available for this episode.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EpisodeDetailPage; 