import { SavedCollectionCard } from './saved-collection-card';
import type { CuratedCollection } from '@/lib/types';

export function SavedCollectionList({
  collections,
}: {
  collections: CuratedCollection[];
}) {
  if (collections.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground py-8">
        No collections saved yet.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      {collections.map((collection) => (
        <SavedCollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
}
