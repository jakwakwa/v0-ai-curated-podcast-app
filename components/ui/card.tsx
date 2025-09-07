import React from "react"
import { type CardProps, cardVariants } from "@/lib/component-variants"
import { cn } from "@/lib/utils"

interface CardComponentProps extends React.HTMLAttributes<HTMLDivElement>, CardProps { }

// Main Card component
const Card = React.forwardRef<HTMLDivElement, CardComponentProps>(({ className, variant, selected, hoverable, ...props }, ref) => (
	<div ref={ref} className={cn(cardVariants({ variant: "default", selected, hoverable, className }))} {...props} />
))
Card.displayName = "Card"

// Card sub-components
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("flex flex-col ", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("text-h2 text-shadow-bottom-[1px] font-heading font-semibold leading-none tracking-tight my-4", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
	<p ref={ref} className={cn("text-body pb-8 text-foreground/80 font-sans", className)} {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => <div ref={ref} className={cn(className)} {...props} />)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("flex items-center", className)} {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
