import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-20 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer hover:opacity-0.9",
	{
		variants: {
			variant: {
				default: "btn-default text-primary-foreground shadow hover:bg-[#045A69] md:min-w-[100px] h-auto text-lg px-3 leading-0",
				destructive: "bg-destructive text-destructive-foreground shadow-[0 -2px 2px 1px #000000BA] hover:bg-destructive/90",
				outline: "border border-[#DEECEE1A] bg-[#0B101011] px-6 rounded-2xl shadow-sm hover:bg-sidebar hover:text-accent-foreground text-[0.9rem] font-bold",
				secondary: "bg-[#5F0573] disabled:bg-[#5E5C6F] rounded-lg border-1 border-[#AA31C5] text-secondary-foreground hover:bg-secondary/80 shadow-[0px_4px_rgba(0,0,0,0.9)] w-full md:max-w-fit px-4 min-h-10 h-auto text-[1rem] shadow-lg shadow-black",
				ghost: "hover:bg-secondary/80 hover:text-accent-foreground",
				link: "text-primary-forefround underline-offset-4 hover:underline",
				play: "p-0 m-0 btn-playicon hover:btn-playicon",
				icon: "",
			},
			size: {
				default: "text-[0.9rem] pt-2 pb-2.5  font-medium",
				sm: "h-9 rounded-lg px-4 pt-2.5 pb-3 text-xs",
				lg: "h-9 px-8 pt-2.5 pb-3  text-sm font-medium",
				md: "h-9 rounded-md text-[0.9rem] pt-2.5 pb-3  font-medium",
				xs: "p-2 text-xs",
				icon: "h-32 w-32",
				play: "",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
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
			{variant === "play" && icon ? icon : children}
		</Comp>
	);
}

export { Button, buttonVariants };
