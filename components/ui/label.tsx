"use client";


import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils"


// Label variants - form label styling
const labelVariants = cva(
	'text-sm font-bold text-[var(--color-form-input-text)] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
	{
		variants: {
			variant: {
				default: 'font-bold text-sm',

			},
			size: {
				default: 'px-3 py-2 text-sm',
				sm: 'px-2 py-1 text-xs',
				lg: 'px-4 py-3 text-base',
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement>, VariantProps<typeof labelVariants> {
	asChild?: boolean;
}
function Label({
	className,
	variant,
	asChild,
	children,
	...props
}: Omit<LabelProps, "size"> & { size?: "default" | "sm" | "lg" }) {
	const Comp = asChild ? Slot : "label";

	return (
		<Comp
			data-slot="label"
			className={cn(
				labelVariants({
					variant,
					// Only pass size if it's a valid variant key
					...(typeof props.size !== "undefined" ? { size: props.size } : {}),
					className,
				})
			)}
			{...props}
		>
			{children}
		</Comp>
	);
}

export { Label, labelVariants };
