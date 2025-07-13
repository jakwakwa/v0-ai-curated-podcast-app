"use client"

import { removePodcastSource } from "@/app/actions"
<<<<<<< HEAD
import type { Source } from "@/lib/types"
// import { X } from "lucide-react"
import Image from "next/image"
import styles from "./source-list-item.module.css"
import { Card } from "./ui/card"

export function SourceListItem({ source }: { source: Source }) {
	return (
		<Card className={styles["card-container"]}>
			<div className={styles["image-wrapper"]}>
				<Image
					src={source.imageUrl || "/placeholder.svg"}
					alt={`${source.name} cover art`}
					width={80}
					height={80}
					className={styles["image-styles"]}
				/>
			</div>
			<div className={styles["text-content-wrapper"]}>
				<p className={styles["text-xs"]}>{source.name}</p>
				<p className={`${styles["text-xs"]} ${styles["text-muted-foreground"]}`}>{source.url}</p>
			</div>
			<form action={removePodcastSource}>
				<input type="hidden" name="id" value={source.id} />
			</form>
		</Card>
	)
=======
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { PodcastSource } from "@/lib/types"
import { Input } from "./ui/input";
import { updatePodcastSourceName } from "@/app/actions";
import { useState } from "react";

function RemoveButton() {
  const { pending } = useFormStatus()
  return (
    <Button size="icon" variant="ghost" type="submit" disabled={pending}>
      <X className="h-4 w-4" />
      <span className="sr-only">Remove</span>
    </Button>
  )
}

export function SourceListItem({ source }: { source: PodcastSource }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(source.name);

  const handleNameChange = async (formData: FormData) => {
    const newName = formData.get("name") as string;
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
      console.error("Failed to update source name:", result.message);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Image
        src={source.imageUrl || "/placeholder.svg"}
        alt={`${source.name} cover art`}
        width={40}
        height={40}
        className="rounded-md"
      />
      <div className="flex-grow">
        {isEditing ? (
          <form action={handleNameChange} onBlur={() => setIsEditing(false)}>
            <Input
              type="text"
              name="name"
              defaultValue={editedName}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.form?.requestSubmit();
                }
              }}
            />
          </form>
        ) : (
          <p className="font-medium" onClick={() => setIsEditing(true)}>{editedName}</p>
        )}
        <p className="text-sm text-muted-foreground truncate">{source.url}</p>
      </div>
      <form action={removePodcastSource}>
        <input type="hidden" name="id" value={source.id} />
        <RemoveButton />
      </form>
    </div>
  )
>>>>>>> 79fd8d0ff (feat: integrate YouTube video support and enhance podcast generation workflow)
}
