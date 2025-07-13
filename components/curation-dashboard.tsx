import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { SavedCollectionList } from './saved-collection-list';
import type { CuratedCollection } from '@/lib/types';

export function CurationDashboard({
  savedCollections,
}: {
  savedCollections: CuratedCollection[];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Saved Collections</CardTitle>
          <CardDescription>
            Generate podcasts from your saved c urations.
          </CardDescription>
        </div>
        <Button asChild size={'sm'}>
          <Link href="/build">
            <PlusCircle className="mr-2 h-4 w-4" />
            Build New
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        <SavedCollectionList collections={savedCollections} />
      </CardContent>
    </Card>
  );
}
