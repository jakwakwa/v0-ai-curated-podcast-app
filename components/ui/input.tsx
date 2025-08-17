import type { VariantProps } from "class-variance-authority"
import type * as React from "react"
import { inputVariants } from "@/lib/component-variants"
import { cn } from "@/lib/utils"

interface InputComponentProps extends Omit<React.ComponentProps<"input">, "size">, VariantProps<typeof inputVariants> {}

function Input({ className, variant, size, type, ...props }: InputComponentProps) {
	return <input type={type} data-slot="input" className={cn(inputVariants({ variant, size }), className)} {...props} />
}

export { Input, type InputComponentProps }
