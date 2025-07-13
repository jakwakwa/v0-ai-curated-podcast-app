import { PodcastList } from '@/components/podcast-list';
import { CurationDashboard } from '@/components/curation-dashboard';
import { getEpisodes, getCuratedCollections } from '@/lib/data';

export default async function DashboardPage() {
  const [episodes, collections] = await Promise.all([
    getEpisodes(),
    getCuratedCollections(),
  ]);
  const savedCollections = collections.filter(
    (c) => c.status === 'Saved' || c.status === 'Generated'
  );

  // Sort savedCollections by createdAt in descending order (newest first)
  savedCollections.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PodcastList episodes={episodes as any} />
          </div>
          <CurationDashboard savedCollections={savedCollections} />
        </div>
      </main>
    </div>
  );
}
