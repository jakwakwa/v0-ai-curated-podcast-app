"use client"

import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import type { VariantProps } from "class-variance-authority"
import { Check } from "lucide-react"
import * as React from "react"
import { checkboxVariants } from "@/lib/component-variants"
import { cn } from "@/lib/utils"

interface CheckboxComponentProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, VariantProps<typeof checkboxVariants> {}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxComponentProps>(({ className, size, ...props }, ref) => (
	<CheckboxPrimitive.Root ref={ref} className={cn(checkboxVariants({ size }), className)} {...props}>
		<CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
			<Check className="h-4 w-4" />
		</CheckboxPrimitive.Indicator>
	</CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox, type CheckboxComponentProps }
