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
			<HeadingComponent className="mt-2 mb-6 text-h1 font-bold">{title}</HeadingComponent>
			{description && (
				<Typography as="p" className="text-h4 max-w-4xl">
					{description}
				</Typography>
			)}
		</header>
	)
})
PageHeader.displayName = "PageHeader"

export { PageHeader }
