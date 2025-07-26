"use client"

import * as React from "react"
import styles from './Input-new.module.css'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const inputClassName = `${styles.input} ${className || ''}`;

    return (
      <input
        type={type}
        className={inputClassName.trim()}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
