import * as React from "react"

import styles from "./input.module.css"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ type, ...props }, ref) => {
	return <input type={type} className={styles.input} ref={ref} {...props} />
})
Input.displayName = "Input"

export { Input }
