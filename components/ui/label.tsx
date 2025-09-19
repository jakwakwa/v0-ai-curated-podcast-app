"use client"


import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils"


// Label variants - form label styling
const labelVariants = cva(
	'text-md font-bold text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
	{
		variants: {
			variant: {
				default: 'font-bold text-sm mt-2',

			},
			size: {
				default: 'my-1 text-sm',
				sm: 'h-11 mt-2 my-2 text-sm',
				lg: 'my-3 text-base',
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
