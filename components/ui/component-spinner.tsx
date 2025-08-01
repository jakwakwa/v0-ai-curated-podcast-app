import { Loader2 } from "lucide-react"
import styles from "./component-spinner.module.css"

function ComponentSpinner({ label, isLabel = false }: { label?: string; isLabel?: boolean }): React.ReactElement {
	return (
		<div className={styles.spinnerWrapper}>
			<Loader2 aria-label={label} />
			{isLabel && <span className={styles.spinnerWrapperText}>{label ? `Loading ${label}...` : isLabel ? "Loading..." : null}</span>}
		</div>
	)
}

export default ComponentSpinner
