"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, Check } from "lucide-react"
import styles from "./page.module.css"

export default function CuratedBundlesPage() {
  // Dummy curated bundles data
  const dummyCuratedBundles = [
    {
      id: "bundle1",
      name: "Tech Weekly",
      description: "Latest in technology and innovation",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop",
      isActive: true,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      podcasts: [
        { id: "pod1", name: "Lex Fridman Podcast", description: "Conversations about science, technology, history, philosophy and the nature of intelligence, consciousness, love, and power." },
        { id: "pod2", name: "The Vergecast", description: "The flagship podcast of The Verge... and the internet." },
        { id: "pod3", name: "Reply All", description: "A podcast about modern life and the internet." },
        { id: "pod4", name: "Planet Money", description: "The economy explained. Imagine you could call up a friend and say, 'Meet me at the bar and tell me what's going on with the economy.'" },
        { id: "pod5", name: "The Indicator", description: "A little show about big ideas. From the people who make Planet Money." }
      ]
    },
    {
      id: "bundle2",
      name: "Business Insights",
      description: "Deep dives into business and economics",
      imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=400&fit=crop",
      isActive: true,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      podcasts: [
        { id: "pod6", name: "How I Built This", description: "Stories behind some of the world's best known companies." },
        { id: "pod7", name: "Masters of Scale", description: "LinkedIn co-founder and Greylock partner Reid Hoffman shares startup stories and entrepreneurial insights." },
        { id: "pod8", name: "The Tim Ferriss Show", description: "Interviews with world-class performers to extract tools and tactics you can use." },
        { id: "pod9", name: "Freakonomics", description: "Discover the hidden side of everything with Stephen J. Dubner." },
        { id: "pod10", name: "Planet Money", description: "The economy explained. Imagine you could call up a friend and say, 'Meet me at the bar and tell me what's going on with the economy.'" }
      ]
    },
    {
      id: "bundle3",
      name: "Science & Discovery",
      description: "Exploring the wonders of science",
      imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop",
      isActive: true,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      podcasts: [
        { id: "pod11", name: "Radiolab", description: "Investigating a strange world." },
        { id: "pod12", name: "Science Friday", description: "Covering the outer reaches of space to the tiniest microbes in our bodies." },
        { id: "pod13", name: "Hidden Brain", description: "Shankar Vedantam uses science and storytelling to reveal the unconscious patterns that drive human behavior." },
        { id: "pod14", name: "Invisibilia", description: "Unseeable forces control human behavior and shape our ideas, beliefs, and assumptions." },
        { id: "pod15", name: "99% Invisible", description: "All about the thought that goes into the things we don't think about." }
      ]
    }
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Curated Bundles</h1>
        <p>Choose from our pre-curated podcast bundles. Each bundle contains 5 carefully selected shows and cannot be modified once selected.</p>
      </div>

      <div className={styles.bundleGrid}>
        {dummyCuratedBundles.map((bundle) => (
          <Card key={bundle.id} className={styles.bundleCard}>
            <CardHeader className={styles.cardHeader}>
              {bundle.imageUrl && (
                <img
                  src={bundle.imageUrl}
                  alt={bundle.name}
                  className={styles.bundleImage}
                />
              )}
              <div className={styles.bundleInfo}>
                <CardTitle className={styles.bundleTitle}>{bundle.name}</CardTitle>
                <CardDescription className={styles.bundleDescription}>
                  {bundle.description}
                </CardDescription>
                <div className={styles.bundleMeta}>
                  <Badge variant="outline" className={styles.podcastCount}>
                    {bundle.podcasts.length} Podcasts
                  </Badge>
                  <div className={styles.lockedIndicator}>
                    <Lock size={12} />
                    <span>Fixed Selection</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className={styles.cardContent}>
              <h4 className={styles.podcastListTitle}>Included Podcasts:</h4>
              <ul className={styles.podcastList}>
                {bundle.podcasts.map((podcast) => (
                  <li key={podcast.id} className={styles.podcastItem}>
                    <div className={styles.podcastInfo}>
                      <span className={styles.podcastName}>{podcast.name}</span>
                      <p className={styles.podcastDescription}>{podcast.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
