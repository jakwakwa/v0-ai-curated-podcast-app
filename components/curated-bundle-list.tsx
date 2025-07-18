import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Check, Lock } from 'lucide-react'
import type { TransformedCuratedBundle } from '@/lib/types'
import styles from './collection-creation-wizard.module.css' // Reusing styles from the wizard

interface CuratedBundleListProps {
  onSelectBundle: (bundleId: string) => void;
  selectedBundleId?: string;
}

export function CuratedBundleList({
  onSelectBundle,
  selectedBundleId,
}: CuratedBundleListProps) {
  const [curatedBundles, setCuratedBundles] = useState<TransformedCuratedBundle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCuratedBundles = async () => {
      try {
        const response = await fetch('/api/curated-bundles');
        if (!response.ok) {
          throw new Error('Failed to fetch curated bundles');
        }
        const data: TransformedCuratedBundle[] = await response.json();
        setCuratedBundles(data);
      } catch (err: unknown) { // Changed to unknown
        setError((err as Error).message); // Cast to Error
      } finally {
        setIsLoading(false);
      }
    };
    fetchCuratedBundles();
  }, []);

  if (isLoading) {
    return <div>Loading bundles...</div>; // Replace with a skeleton loader later
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className={styles.bundleSelection}>
      <div className={styles.bundleGrid}>
        {curatedBundles.map((bundle) => (
          <Card
            key={bundle.id}
            className={`${styles.bundleCard} ${selectedBundleId === bundle.id ? styles.selected : ""}`}
            onClick={() => onSelectBundle(bundle.id)}
          >
            {bundle.imageUrl && (
              <img
                src={bundle.imageUrl}
                alt={bundle.name}
                className={styles.bundleImage}
              />
            )}
            <div className={styles.bundleContent}>
              <h3>{bundle.name}</h3>
              <p>{bundle.description}</p>
              <div className={styles.bundlePreview}>
                <h5>Included Podcasts:</h5>
                <ul>
                  {bundle.podcasts?.slice(0, 3).map((podcast) => (
                    <li key={podcast.id}>{podcast.name}</li>
                  ))}
                  {bundle.podcasts && bundle.podcasts.length > 3 && (
                    <li>+{bundle.podcasts.length - 3} more</li>
                  )}
                </ul>
              </div>
              {selectedBundleId === bundle.id && (
                <div className={styles.selectedIndicator}>
                  <Check size={16} />
                </div>
              )}
              <div className={styles.lockedIndicator}>
                <Lock size={12} className={styles.lockIcon} />
                Fixed Selection
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 