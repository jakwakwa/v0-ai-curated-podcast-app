import * as React from "react"

import styles from "./input-textarea.module.css"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(({ className, ...props }, ref) => {
	return <textarea className={styles.inputTextarea} ref={ref} {...props} />
})
Textarea.displayName = "Textarea"

export { Textarea }
