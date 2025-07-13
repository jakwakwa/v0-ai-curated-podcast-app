import { SourceListItem } from './source-list-item';
import type { PodcastSource } from '@/lib/types';
import { Card } from './ui/card';

interface SourceListProps {
  sources: PodcastSource[];
}

export function SourceList({ sources }: SourceListProps) {
  if (sources.length === 0) {
    return (
      <Card className="text-center text-sm text-muted-foreground">
        No sources added yet.
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {sources.map((source) => (
        <SourceListItem key={source.id} source={source} />
      ))}
    </div>
  );
}
