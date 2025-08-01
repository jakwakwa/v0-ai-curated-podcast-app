"use client"

import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import * as React from "react"

import styles from "./sheet.module.css"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>>(({ className, ...props }, ref) => (
	<SheetPrimitive.Overlay className={`${styles.sheetOverlay} ${className}`} {...props} ref={ref} />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(styles.sheetContent, {
	variants: {
		side: {
			top: styles.sheetContentTop,
			bottom: styles.sheetContentBottom,
			left: styles.sheetContentLeft,
			right: styles.sheetContentRight,
		},
	},
	defaultVariants: {
		side: "right",
	},
})

interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>, VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, SheetContentProps>(({ side = "right", className, children, ...props }, ref) => (
	<SheetPortal>
		<SheetOverlay />
		<SheetPrimitive.Content ref={ref} className={`${sheetVariants({ side })} ${className}`} {...props}>
			<SheetPrimitive.Close className={styles.sheetCloseButton}>
				<X className={styles.sheetCloseButtonIcon} />
				<span className="sr-only">Close</span>
			</SheetPrimitive.Close>
			{children}
		</SheetPrimitive.Content>
	</SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={`${styles.sheetHeader} ${className}`} {...props} />
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={`${styles.sheetFooter} ${className}`} {...props} />
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Title>, React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>>(({ className, ...props }, ref) => (
	<SheetPrimitive.Title ref={ref} className={`${styles.sheetTitle} ${className}`} {...props} />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Description>, React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>>(({ className, ...props }, ref) => (
	<SheetPrimitive.Description ref={ref} className={`${styles.sheetDescription} ${className}`} {...props} />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export { Sheet, SheetPortal, SheetOverlay, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription }
