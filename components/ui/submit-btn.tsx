import { CheckIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import styles from "./submit-btn.module.css"

function SubmitBtn({ isUpdating, handleSaveAll }: { isUpdating: boolean; handleSaveAll: React.MouseEventHandler<HTMLButtonElement> }): React.ReactElement {
	return (
		<div className={styles.saveButtonContainer}>
			<Button onClick={handleSaveAll} disabled={isUpdating} className={styles.saveButton}>
				{isUpdating ? <Loader2 className={styles.saveButtonIcon} /> : <CheckIcon className={styles.saveButtonIcon} aria-checked={true} aria-label="Save Preferences" />}
			</Button>
		</div>
	)
}

export { SubmitBtn }
