import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Check } from 'lucide-react'
import { useUserCurationProfileStore } from '@/lib/stores/user-curation-profile-store'
import type { CuratedPodcast } from '@/lib/types'
import styles from './collection-creation-wizard.module.css' // Reusing styles from the wizard

interface CuratedPodcastListProps {
  onSelectPodcast: (podcast: CuratedPodcast) => void;
  selectedPodcasts: CuratedPodcast[];
}

export function CuratedPodcastList({
  onSelectPodcast,
  selectedPodcasts,
}: CuratedPodcastListProps) {
  const [curatedPodcasts, setCuratedPodcasts] = useState<CuratedPodcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCuratedPodcasts = async () => {
      try {
        const response = await fetch('/api/curated-podcasts');
        if (!response.ok) {
          throw new Error('Failed to fetch curated podcasts');
        }
        const data = await response.json();
        setCuratedPodcasts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCuratedPodcasts();
  }, []);

  if (isLoading) {
    return <div>Loading podcasts...</div>; // Replace with a skeleton loader later
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const categories = [...new Set(curatedPodcasts.map((p) => p.category))];

  return (
    <div className={styles.customSelection}>
      <div className={styles.selectionHeader}>
        <p>Select up to 5 podcasts for your custom user curation profile</p>
        <Badge variant="outline">
          {selectedPodcasts.length}/5 selected
        </Badge>
      </div>

      <Tabs defaultValue={categories[0]} className={styles.categoryTabs}>
        <TabsList className={styles.tabsList}>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className={styles.tabContent}>
            <div className={styles.podcastGrid}>
              {curatedPodcasts
                .filter((podcast) => podcast.category === category)
                .map((podcast) => {
                  const isSelected = selectedPodcasts.some((p) => p.id === podcast.id);
                  const canSelect = selectedPodcasts.length < 5 || isSelected;

                  return (
                    <Card
                      key={podcast.id}
                      className={`${styles.podcastCard} ${isSelected ? styles.selected : ""} ${!canSelect ? styles.disabled : ""}`}
                      onClick={() => canSelect && onSelectPodcast(podcast)}
                    >
                      {podcast.imageUrl && (
                        <img
                          src={podcast.imageUrl}
                          alt={podcast.name}
                          className={styles.podcastImage}
                        />
                      )}
                      <div className={styles.podcastContent}>
                        <h4>{podcast.name}</h4>
                        <p>{podcast.description}</p>
                        {isSelected && (
                          <div className={styles.selectedIndicator}>
                            <Check size={16} />
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 