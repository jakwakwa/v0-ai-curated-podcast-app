'use client'

import { useState, useEffect } from 'react'
import { useCollectionStore, useSubscriptionStore } from '@/lib/stores'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Loader2, Plus, Check, Lock, Star } from 'lucide-react'
import styles from './collection-creation-wizard.module.css'

export function CollectionCreationWizard() {
  const [step, setStep] = useState<'type' | 'selection' | 'review'>('type')
  const [selectionType, setSelectionType] = useState<'custom' | 'bundle'>('custom')
  const [collectionName, setCollectionName] = useState('')
  const [selectedBundleId, setSelectedBundleId] = useState<string>('')

  const {
    curatedPodcasts,
    curatedBundles,
    selectedPodcasts,
    isLoading,
    error,
    loadCuratedContent,
    togglePodcastSelection,
    clearSelectedPodcasts,
    setSelectedBundle,
    createCollection,
  } = useCollectionStore()

  const { canCreateCollection, isTrialing, getRemainingTrialDays } = useSubscriptionStore()

  useEffect(() => {
    loadCuratedContent()
  }, [loadCuratedContent])

  const handleSelectionTypeChange = (type: 'custom' | 'bundle') => {
    setSelectionType(type)
    clearSelectedPodcasts()
    setSelectedBundleId('')
    setStep('selection')
  }

  const handleBundleSelect = (bundleId: string) => {
    setSelectedBundleId(bundleId)
    setSelectedBundle(bundleId)
  }

  const handleCreateCollection = async () => {
    if (!canCreateCollection()) {
      toast.error('Please upgrade to premium to create collections')
      return
    }

    if (!collectionName.trim()) {
      toast.error('Please enter a collection name')
      return
    }

    if (selectionType === 'custom' && selectedPodcasts.length === 0) {
      toast.error('Please select at least one podcast')
      return
    }

    if (selectionType === 'bundle' && !selectedBundleId) {
      toast.error('Please select a bundle')
      return
    }

    try {
      await createCollection({
        name: collectionName.trim(),
        isBundleSelection: selectionType === 'bundle',
        selectedBundleId: selectionType === 'bundle' ? selectedBundleId : undefined,
        selectedPodcasts: selectionType === 'custom' ? selectedPodcasts.map(p => p.id) : undefined,
      })

      toast.success('Collection created successfully!')
      // Reset form
      setStep('type')
      setCollectionName('')
      clearSelectedPodcasts()
      setSelectedBundleId('')
    } catch (error) {
      toast.error('Failed to create collection')
    }
  }

  const categories = [...new Set(curatedPodcasts.map(p => p.category))]

  return (
    <div className={styles.wizard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create Your Podcast Collection</h1>
        <p className={styles.subtitle}>
          {isTrialing && getRemainingTrialDays() !== null && (
            <Badge variant="outline" className={styles.trialBadge}>
              Trial: {getRemainingTrialDays()} days remaining
            </Badge>
          )}
        </p>
      </div>

      {/* Step 1: Choose Collection Type */}
      {step === 'type' && (
        <div className={styles.stepContent}>
          <h2 className={styles.stepTitle}>Choose Your Collection Type</h2>
          
          <div className={styles.typeSelection}>
            <Card 
              className={`${styles.typeCard} ${selectionType === 'custom' ? styles.selected : ''}`}
              onClick={() => handleSelectionTypeChange('custom')}
            >
              <div className={styles.typeIcon}>
                <Plus size={32} />
              </div>
              <h3>Custom Collection</h3>
              <p>Build your own collection by selecting up to 5 individual podcasts from our curated list</p>
              <Badge variant="secondary">Editable</Badge>
            </Card>

            <Card 
              className={`${styles.typeCard} ${selectionType === 'bundle' ? styles.selected : ''}`}
              onClick={() => handleSelectionTypeChange('bundle')}
            >
              <div className={styles.typeIcon}>
                <Star size={32} />
              </div>
              <h3>Editor's Choice Bundle</h3>
              <p>Choose from 3 pre-curated bundles, each containing 5 expertly selected podcasts</p>
              <Badge variant="outline">
                <Lock size={12} className={styles.lockIcon} />
                Fixed Selection
              </Badge>
            </Card>
          </div>
        </div>
      )}

      {/* Step 2: Selection */}
      {step === 'selection' && (
        <div className={styles.stepContent}>
          <div className={styles.stepHeader}>
            <Button 
              variant="outline" 
              onClick={() => setStep('type')}
              className={styles.backButton}
            >
              ← Back
            </Button>
            <h2 className={styles.stepTitle}>
              {selectionType === 'custom' ? 'Select Podcasts' : 'Choose a Bundle'}
            </h2>
          </div>

          {selectionType === 'custom' ? (
            <div className={styles.customSelection}>
              <div className={styles.selectionHeader}>
                <p>Select up to 5 podcasts for your collection</p>
                <Badge variant="outline">
                  {selectedPodcasts.length}/5 selected
                </Badge>
              </div>

              <Tabs defaultValue={categories[0]} className={styles.categoryTabs}>
                <TabsList className={styles.tabsList}>
                  {categories.map(category => (
                    <TabsTrigger key={category} value={category}>
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {categories.map(category => (
                  <TabsContent key={category} value={category} className={styles.tabContent}>
                    <div className={styles.podcastGrid}>
                      {curatedPodcasts
                        .filter(podcast => podcast.category === category)
                        .map(podcast => {
                          const isSelected = selectedPodcasts.some(p => p.id === podcast.id)
                          const canSelect = selectedPodcasts.length < 5 || isSelected

                          return (
                            <Card
                              key={podcast.id}
                              className={`${styles.podcastCard} ${isSelected ? styles.selected : ''} ${!canSelect ? styles.disabled : ''}`}
                              onClick={() => canSelect && togglePodcastSelection(podcast)}
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
                          )
                        })}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <div className={styles.selectionActions}>
                <Button
                  onClick={() => setStep('review')}
                  disabled={selectedPodcasts.length === 0}
                  className={styles.nextButton}
                >
                  Continue to Review
                </Button>
              </div>
            </div>
          ) : (
            <div className={styles.bundleSelection}>
              <div className={styles.bundleGrid}>
                {curatedBundles.map(bundle => (
                  <Card
                    key={bundle.id}
                    className={`${styles.bundleCard} ${selectedBundleId === bundle.id ? styles.selected : ''}`}
                    onClick={() => handleBundleSelect(bundle.id)}
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
                          {bundle.bundlePodcasts.slice(0, 3).map(bp => (
                            <li key={bp.podcast.id}>{bp.podcast.name}</li>
                          ))}
                          {bundle.bundlePodcasts.length > 3 && (
                            <li>+{bundle.bundlePodcasts.length - 3} more</li>
                          )}
                        </ul>
                      </div>
                      {selectedBundleId === bundle.id && (
                        <div className={styles.selectedIndicator}>
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              <div className={styles.selectionActions}>
                <Button
                  onClick={() => setStep('review')}
                  disabled={!selectedBundleId}
                  className={styles.nextButton}
                >
                  Continue to Review
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Review and Create */}
      {step === 'review' && (
        <div className={styles.stepContent}>
          <div className={styles.stepHeader}>
            <Button 
              variant="outline" 
              onClick={() => setStep('selection')}
              className={styles.backButton}
            >
              ← Back
            </Button>
            <h2 className={styles.stepTitle}>Review & Create</h2>
          </div>

          <div className={styles.reviewContent}>
            <Card className={styles.reviewCard}>
              <h3>Collection Details</h3>
              
              <div className={styles.formGroup}>
                <label htmlFor="collectionName">Collection Name</label>
                <Input
                  id="collectionName"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  placeholder="Enter a name for your collection"
                  className={styles.nameInput}
                />
              </div>

              <div className={styles.selectionSummary}>
                <h4>
                  {selectionType === 'custom' ? 'Selected Podcasts' : 'Selected Bundle'}
                </h4>
                
                {selectionType === 'custom' ? (
                  <div className={styles.selectedPodcasts}>
                    {selectedPodcasts.map(podcast => (
                      <div key={podcast.id} className={styles.selectedPodcast}>
                        {podcast.imageUrl && (
                          <img src={podcast.imageUrl} alt={podcast.name} />
                        )}
                        <div>
                          <h5>{podcast.name}</h5>
                          <p>{podcast.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.selectedBundle}>
                    {selectedBundleId && (() => {
                      const bundle = curatedBundles.find(b => b.id === selectedBundleId)
                      return bundle ? (
                        <div className={styles.bundleSummary}>
                          {bundle.imageUrl && (
                            <img src={bundle.imageUrl} alt={bundle.name} />
                          )}
                          <div>
                            <h5>{bundle.name}</h5>
                            <p>{bundle.description}</p>
                            <small>{bundle.bundlePodcasts.length} podcasts included</small>
                          </div>
                        </div>
                      ) : null
                    })()}
                  </div>
                )}
              </div>

              <div className={styles.createActions}>
                <Button
                  onClick={handleCreateCollection}
                  disabled={isLoading || !collectionName.trim()}
                  className={styles.createButton}
                >
                  {isLoading && <Loader2 className={styles.spinner} size={16} />}
                  Create Collection
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}