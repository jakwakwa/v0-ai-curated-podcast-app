import type { Source } from "@/lib/types"
import { Card } from "../ui/card"
import styles from "./source-list.module.css"
import { SourceListItem } from "./source-list-item"

interface SourceListProps {
	sources: Source[]
}

export function SourceList({ sources }: SourceListProps) {
	if (sources.length === 0) {
		return <Card className={styles["empty-state-card"]}>No sources added yet.</Card>
	}

	return (
		<div className={styles["source-list-container"]}>
			{sources.map(source => (
				<SourceListItem key={source.id} source={source} />
			))}
		</div>
	)
}
