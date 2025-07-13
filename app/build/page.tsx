import { CurationBuilder } from '@/components/curation-builder';
import { getCuratedCollections } from '@/lib/data';
import type { CuratedCollection } from '@/lib/types'; // adjust path if needed

export default async function BuildCurationPage() {
  let collections: CuratedCollection[] = [];
  try {
    collections = await getCuratedCollections();
  } catch (e) {
    console.error('Error calling getCuratedCollections:', e);
    collections = [];
  }
  const draftCollection = collections.find((c) => c.status === 'Draft');

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <CurationBuilder collection={draftCollection} />
        </div>
      </main>
    </div>
  );
}
