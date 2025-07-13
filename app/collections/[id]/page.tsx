import { notFound } from 'next/navigation';
import { getEpisodes, getCuratedCollections } from '@/lib/data';
import { SourceList } from '@/components/source-list';
import { EpisodeTranscript } from '@/components/episode-transcripts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CollectionPageProps {
  params: { id: string };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { id } = params;
  const collections = await getCuratedCollections();
  const collection = collections.find((c) => c.id === id);
  if (!collection) return notFound();

  // Get all episodes for this collection
  const allEpisodes = await getEpisodes();
  const episodes = allEpisodes.filter((ep) => ep.collectionId === id);

  return (
    <>
      {/* Episodes list (2/3 width, left) */}
      <Card className="w-full rounded-lg p-4 min-h-screen">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Episodes for {collection.name}</h2>
        </div>
        {episodes.length === 0 ? (
          <div className="text-muted-foreground">
            No episodes generated yet.
          </div>
        ) : (
          <>
            {episodes.map((ep) => (
              <div key={ep.id} className="border rounded-lg p-4 bg-card">
                <div className="font-semibold text-lg mb-1">{ep.title}</div>
                <div className="text-xs text-muted-foreground mb-1">
                  {ep.publishedAt
                    ? new Date(ep.publishedAt).toLocaleDateString()
                    : ''}
                </div>
                <audio controls src={ep.audioUrl} className="w-full mb-2" />
                {ep.description && (
                  <EpisodeTranscript transcript={ep.description} />
                )}
              </div>
            ))}
          </>
        )}
      </Card>
      {/* Sources list (1/3 width, right) */}
      <Card className="bg-white rounded-lg p-4 max-h-40">
        <h3 className="text-xl font-semibold mb-4">Sources</h3>
        <SourceList sources={collection.sources} />
      </Card>
    </>
  );
}
