import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { PlayIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-20 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer hover:opacity-0.9",
	{
		variants: {
			variant: {
				default: "btn-default shadow-[inset_0_-1px_2px_rgba(0,0,0,0.9)] text-primary-foreground shadow hover:bg-[#0C2327]/90",
				destructive: "bg-destructive text-destructive-foreground shadow-[0 -2px 2px 1px #000] hover:bg-destructive/90",
				outline: "border border-[#9FB3D031] bg-[#030404C7] rounded-full shadow-sm hover:bg-sidebar hover:text-accent-foreground",
				secondary: "bg-[#000] text-secondary-foreground hover:bg-secondary/80 shadow-[0px_4px_rgba(0,0,0,0.9)]",
				ghost: "hover:bg-secondary/80 hover:text-accent-foreground",
				link: "text-primary-forefround underline-offset-4 hover:underline",
				play: "p-0 m-0 h-32 w-32",
				icon: ""
			},
			size: {
				default: "h-10 rounded-md px-4 pt-3 pb-3 text-xs",
				sm: "h-10 rounded-md px-4 pt-3 pb-3 text-xs",
				lg: "h-9 px-2 py-2 text-xs",
				md: "h-10 rounded-md px-4 pt-3 pb-3 text-xs",
				xs: "p-2",
				icon: "h-24 w-24",
				play: "h-24 w-24"
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default"
		},
	}
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

function Button({
	className,
	variant,
	size,
	asChild = false,
	children,
	icon,
	...props
}: React.ComponentProps<"button"> & {
	variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "play" | "icon";
	size?: "default" | "sm" | "xs" | "md" | "lg";
	asChild?: boolean;
	icon?: React.ReactNode;
}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props}>
			{children}
			{variant === "play" &&

				<PlayIcon color="#238681F7" />

			}
		</Comp>
	);
}

export { Button, buttonVariants };
