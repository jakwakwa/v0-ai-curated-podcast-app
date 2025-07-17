import { CurationBuilder } from '@/components/curation-builder';
import { getUserCurationProfile } from '@/lib/data'; // Changed from getCuratedCollections
import type { UserCurationProfileWithRelations } from '@/lib/types'; // Changed from CuratedCollection

export default async function BuildCurationPage() {
  let collections: UserCurationProfileWithRelations[] = []; // Explicitly type collections
  try {
    collections = await getUserCurationProfile(); // Changed from getCuratedCollections
  } catch (e: unknown) { // Add unknown type for catch error
    const message = e instanceof Error ? e.message : String(e);
    console.error('Error calling getUserCurationProfile:', message); // Keep for server-side logging
    collections = [];
  }
  const draftCollection = collections.find((c: UserCurationProfileWithRelations) => c.status === 'Draft'); // Explicitly type c

  return (
    <div className="flex w-full flex-col">
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <CurationBuilder userCurationProfile={draftCollection} /> {/* Changed prop name */}
        </div>
      </main>
    </div>
  );
}
