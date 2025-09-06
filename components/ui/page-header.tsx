import React from "react"
import { type HeaderProps, headerVariants } from "@/lib/component-variants"
import { cn } from "@/lib/utils"
import { H1, H2, H3, Typography } from "./typography"

interface PageHeaderProps extends React.HTMLAttributes<HTMLElement>, HeaderProps {
	title: string
	description?: string
	level?: 1 | 2 | 3
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(({ className, spacing, title, description, level = 1, ...props }, ref) => {
	const _HeadingComponent = level === 1 ? H1 : level === 2 ? H2 : H3

	return (
		<div className={cn(headerVariants({ spacing, className }))} ref={ref} {...props}>
			<Typography className="flex text-custom-h2 leading-[1.4] font-medium px-2 md:px-0 pt-6 pb-4 md:py-3.5  text-primary leading-[1.5] max-w-screen md:max-w-4xl">
				{title}
			</Typography>
			{description && (
				<Typography as="p" variant="body" className="text-base px-2  md:px-0  md:py-3.5 text-primary/80 leading-[1.5] max-w-screen md:max-w-4xl">
					{description}
				</Typography>
			)}
		</div>
	)
})
PageHeader.displayName = "PageHeader"

export { PageHeader }
