import React from "react"
import { type HeaderProps, headerVariants } from "@/lib/component-variants"
import { cn } from "@/lib/utils"
import { H1, H2, H3, Typography } from "./typography"

interface PageHeaderProps extends React.HTMLAttributes<HTMLElement>, HeaderProps {
	title: string
	description?: string
	level?: 1 | 2 | 3
}

const PageHeader = React.forwardRef<HTMLElement, PageHeaderProps>(({ className, spacing, title, description, level = 1, ...props }, ref) => {
	const HeadingComponent = level === 1 ? H1 : level === 2 ? H2 : H3

	return (
		<header className={cn(headerVariants({ spacing, className }))} ref={ref} {...props}>
			<HeadingComponent className="mb-6 text-custom-2xl font-bold">{title}</HeadingComponent>
			{description && (
				<Typography as="h3" className="text-md text-muted-foreground max-w-2xl">
					{description}
				</Typography>
			)}
		</header>
	)
})
PageHeader.displayName = "PageHeader"

export { PageHeader }
