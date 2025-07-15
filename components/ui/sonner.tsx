"use client"

import { useTheme } from "next-themes"
import type React from "react"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme()

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			toastOptions={{
				classNames: {
					toast: "bg-primary text-accent text-bold font-sm group toast",
					description: "group-[.toast]:text-accent",
					actionButton: "group-[.toast]:bg-white group-[.toast]:text-accent",
					cancelButton: "group-[.toast]:bg-red group-[.toast]:text-accent",
				},
			}}
			{...props}
		/>
	)
}

export { Toaster }
