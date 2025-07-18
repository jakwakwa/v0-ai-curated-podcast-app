import { Card } from '@/components/ui/card'
import { Check, Lock } from 'lucide-react'
import type { TransformedCuratedBundle } from '@/lib/types'
import { useState, useEffect } from 'react'
import styles from './collection-creation-wizard.module.css'
import { shouldUseDummyData, logDummyDataUsage } from '@/lib/config'

interface CuratedBundleListProps {
  onSelectBundle: (bundleId: string) => void;
  selectedBundleId?: string;
}

export function CuratedBundleList({
  onSelectBundle,
  selectedBundleId,
}: CuratedBundleListProps) {
  const [curatedBundles, setCuratedBundles] = useState<TransformedCuratedBundle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Dummy curated bundles data
  const dummyCuratedBundles: TransformedCuratedBundle[] = [
    {
      id: "bundle1",
      name: "Tech Weekly",
      description: "Latest in technology and innovation",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop",
      isActive: true,
      createdAt: new Date(),
      podcasts: [
        { id: "pod1", name: "Lex Fridman Podcast", description: "Conversations about science, technology, history, philosophy and the nature of intelligence, consciousness, love, and power.", url: "https://www.youtube.com/@lexfridman", imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop", category: "Technology", isActive: true, createdAt: new Date() },
        { id: "pod2", name: "The Vergecast", description: "The flagship podcast of The Verge... and the internet.", url: "https://www.youtube.com/@verge", imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop", category: "Technology", isActive: true, createdAt: new Date() },
        { id: "pod3", name: "Reply All", description: "A podcast about modern life and the internet.", url: "https://gimletmedia.com/shows/reply-all", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop", category: "Technology", isActive: true, createdAt: new Date() },
        { id: "pod4", name: "Planet Money", description: "The economy explained. Imagine you could call up a friend and say, 'Meet me at the bar and tell me what's going on with the economy.'", url: "https://www.npr.org/sections/money/", imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop", category: "Technology", isActive: true, createdAt: new Date() },
        { id: "pod5", name: "The Indicator", description: "A little show about big ideas. From the people who make Planet Money.", url: "https://www.npr.org/podcasts/510325/the-indicator-from-planet-money", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop", category: "Technology", isActive: true, createdAt: new Date() }
      ]
    },
    {
      id: "bundle2",
      name: "Business Insights",
      description: "Deep dives into business and economics",
      imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=400&fit=crop",
      isActive: true,
      createdAt: new Date(),
      podcasts: [
        { id: "pod6", name: "How I Built This", description: "Stories behind some of the world's best known companies.", url: "https://www.npr.org/podcasts/510313/how-i-built-this", imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=400&fit=crop", category: "Business", isActive: true, createdAt: new Date() },
        { id: "pod7", name: "Masters of Scale", description: "LinkedIn co-founder and Greylock partner Reid Hoffman shares startup stories and entrepreneurial insights.", url: "https://mastersofscale.com/", imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop", category: "Business", isActive: true, createdAt: new Date() },
        { id: "pod8", name: "The Tim Ferriss Show", description: "Interviews with world-class performers to extract tools and tactics you can use.", url: "https://tim.blog/podcast/", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", category: "Business", isActive: true, createdAt: new Date() },
        { id: "pod9", name: "Freakonomics", description: "Discover the hidden side of everything with Stephen J. Dubner.", url: "https://freakonomics.com/", imageUrl: "https://images.unsplash.com/photo-1556761175-4acf4c6d6c96?w=400&h=400&fit=crop", category: "Business", isActive: true, createdAt: new Date() },
        { id: "pod10", name: "Planet Money", description: "The economy explained. Imagine you could call up a friend and say, 'Meet me at the bar and tell me what's going on with the economy.'", url: "https://www.npr.org/sections/money/", imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop", category: "Business", isActive: true, createdAt: new Date() }
      ]
    },
    {
      id: "bundle3",
      name: "Science & Discovery",
      description: "Exploring the wonders of science",
      imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop",
      isActive: true,
      createdAt: new Date(),
      podcasts: [
        { id: "pod11", name: "Radiolab", description: "Investigating a strange world.", url: "https://www.wnycstudios.org/podcasts/radiolab", imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop", category: "Science", isActive: true, createdAt: new Date() },
        { id: "pod12", name: "Science Friday", description: "Covering the outer reaches of space to the tiniest microbes in our bodies.", url: "https://www.sciencefriday.com/", imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop", category: "Science", isActive: true, createdAt: new Date() },
        { id: "pod13", name: "Hidden Brain", description: "Shankar Vedantam uses science and storytelling to reveal the unconscious patterns that drive human behavior.", url: "https://www.npr.org/series/423302056/hidden-brain", imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop", category: "Science", isActive: true, createdAt: new Date() },
        { id: "pod14", name: "Invisibilia", description: "Unseeable forces control human behavior and shape our ideas, beliefs, and assumptions.", url: "https://www.npr.org/podcasts/510307/invisibilia", imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop", category: "Science", isActive: true, createdAt: new Date() },
        { id: "pod15", name: "99% Invisible", description: "All about the thought that goes into the things we don't think about.", url: "https://99percentinvisible.org/", imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop", category: "Science", isActive: true, createdAt: new Date() }
      ]
    }
  ]

  useEffect(() => {
    const fetchCuratedBundles = async () => {
      if (shouldUseDummyData()) {
        logDummyDataUsage("CuratedBundleList")
        setCuratedBundles(dummyCuratedBundles)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/curated-bundles')
        if (!response.ok) {
          throw new Error(`Failed to fetch curated bundles: ${response.status}`)
        }
        const data = await response.json()
        setCuratedBundles(data)
      } catch (error) {
        console.error('Error fetching curated bundles:', error)
        // Fallback to dummy data
        logDummyDataUsage("CuratedBundleList (API fallback)")
        setCuratedBundles(dummyCuratedBundles)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCuratedBundles()
  }, [])

  if (isLoading) {
    return <div>Loading curated bundles...</div>
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
