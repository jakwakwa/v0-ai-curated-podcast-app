import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import { textareaVariants } from "@/lib/component-variants"
import { cn } from "@/lib/utils"

interface TextareaComponentProps extends Omit<React.ComponentProps<"textarea">, "size">, VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaComponentProps>(({ className, variant, size, ...props }, ref) => {
	return <textarea className={cn(textareaVariants({ variant, size }), className)} ref={ref} {...props} />
})
Textarea.displayName = "Textarea"

export { Textarea, type TextareaComponentProps }
