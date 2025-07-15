'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CuratedCollection, PodcastSource } from '@/lib/types';
import { PlusCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface EditCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: CuratedCollection | null;
  onSave: (updatedCollection: Partial<CuratedCollection>) => Promise<void>;
}

export const EditCollectionModal: React.FC<EditCollectionModalProps> = ({ isOpen, onClose, collection, onSave }) => {
  const [collectionName, setCollectionName] = useState(collection?.name || '');
  const [sources, setSources] = useState<PodcastSource[]>(collection?.sources || []);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (collection) {
      setCollectionName(collection.name);
      setSources(collection.sources || []);
    }
  }, [collection]);

  const handleAddSource = () => {
    setSources([...sources, { id: '', name: '', url: '', imageUrl: '' }]);
  };

  const handleSourceChange = (index: number, field: keyof PodcastSource, value: string) => {
    const newSources = [...sources];
    // @ts-ignore
    newSources[index][field] = value;
    setSources(newSources);
  };

  const handleRemoveSource = (index: number) => {
    const newSources = sources.filter((_, i) => i !== index);
    setSources(newSources);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const updatedData: Partial<CuratedCollection> = {
        name: collectionName,
      };

      if (!collection?.isBundleSelection) {
        updatedData.sources = sources;
      }

      await onSave(updatedData);
      toast.success('Collection updated successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to update collection:', error);
      toast.error('Failed to update collection.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!collection) return null; // Should not happen if opened correctly

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Collection</DialogTitle>
          <DialogDescription>
            Make changes to your collection here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              className="col-span-3"
            />
          </div>
          {!collection.isBundleSelection && (
            <div>
              <Label className="text-sm font-medium">Sources</Label>
              {sources.map((source, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <Input
                    placeholder="Source Name"
                    value={source.name}
                    onChange={(e) => handleSourceChange(index, 'name', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Source URL"
                    value={source.url}
                    onChange={(e) => handleSourceChange(index, 'url', e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={() => handleRemoveSource(index)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="mt-4" onClick={handleAddSource}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Source
              </Button>
            </div>
          )}
           {collection.isBundleSelection && (
            <p className="text-sm text-muted-foreground">
              This is a bundle-based collection and its sources cannot be edited directly.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 