'use client';

import Image from 'next/image';
import { useFormStatus } from 'react-dom';
import { removePodcastSource } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { Source } from '@/lib/types';
import { Input } from './ui/input';
import { updatePodcastSourceName } from '@/app/actions';
import { useState } from 'react';
import { Card } from './ui/card';
import styles from './source-list-item.module.css';

function RemoveButton() {
  const { pending } = useFormStatus();
  return (
    <Button size="icon" variant="ghost" type="submit" disabled={pending}>
      <X className={styles["remove-button-icon"]} />
      <span className={styles["sr-only"]}>Remove</span>
    </Button>
  );
}

export function SourceListItem({ source }: { source: Source }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(source.name);

  const handleNameChange = async (formData: FormData) => {
    const newName = formData.get('name') as string;
    if (newName === source.name) {
      setIsEditing(false); // No change, just exit edit mode
      return;
    }

    const result = await updatePodcastSourceName(source.id, newName);
    if (result.success) {
      setEditedName(newName);
      setIsEditing(false);
    } else {
      // Optionally, show a toast error here
      console.error('Failed to update source name:', result.message);
    }
  };

  return (
    <Card className={styles["card-container"]}>
      <div className={styles["image-wrapper"]}>
        <Image
          src={source.imageUrl || '/placeholder.svg'}
          alt={`${source.name} cover art`}
          width={80}
          height={80}
          className={styles["image-styles"]}
        />
      </div>
      <div className={styles["text-content-wrapper"]}>
        <p className={styles["text-xs"]}>{editedName}</p>
        <p className={`${styles["text-xs"]} ${styles["text-muted-foreground"]}`}>{source.url}</p>
      </div>
      <form action={removePodcastSource}>
        <input type="hidden" name="id" value={source.id} />
        {/* <RemoveButton /> */}
      </form>
    </Card>
  );
}
